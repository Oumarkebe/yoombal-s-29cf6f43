
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    MessageSquare,
    X,
    Send,
    Loader2,
    Sparkles,
    ChevronDown,
    Bot,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Settings,
    UserCircle,
    Check,
    ShoppingCart,
    Scale,
    ArrowRight
} from 'lucide-react';
// import { TtsSession } from '@mintplex-labs/piper-tts-web'; // Converted to dynamic import


import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { evaluateAIPolicy, AIActionLevel, AIContext } from '@/lib/ai-policy';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useDeliveryZones } from '@/hooks/useDeliveryZones';
import { useUserAiSettings } from '@/hooks/useUserAiSettings';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();
    const { addItem, triggerAnimation } = useCart();
    const { zones, calculateDeliveryFee, getZoneByArea } = useDeliveryZones();

    // session persistence
    const [messages, setMessages] = useState<Message[]>([]);
    const [isRestoring, setIsRestoring] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [thoughtStep, setThoughtStep] = useState("Réflexion...");
    const [lastAnalyticTags, setLastAnalyticTags] = useState<any>(null);
    const [isListening, setIsListening] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [voiceType, setVoiceType] = useState<'standard' | 'premium'>('standard');
    const [isPremiumLoading, setIsPremiumLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const piperWorkerRef = useRef<Worker | null>(null);



    const { hasFeature, globalFeatures, isLoading: isCheckingPermission } = useSubscription();
    // User-specific targeted overrides
    const { settings: userTargetedSettings } = useUserAiSettings({ userId: user?.id });

    const isEnabled = hasFeature('ai_assistant');
    const assistantConfig = globalFeatures?.find(f => f.feature_key === 'ai_assistant' || f.feature_key === 'assistant_intelligent')?.configuration || {};

    // session persistence & restoration
    useEffect(() => {
        const restoreSession = async () => {
            if (user) {
                setIsRestoring(true);
                try {
                    const { data, error } = await supabase
                        .from('ai_chat_sessions')
                        .select('messages')
                        .eq('user_id', user.id)
                        .maybeSingle();

                    if (data && data.messages) {
                        setMessages(data.messages);
                    } else {
                        setInitialMessage();
                    }
                } catch (e) {
                    console.error("DB Session restore failed", e);
                    setInitialMessage();
                } finally {
                    setIsRestoring(false);
                }
            } else {
                // Guest mode: Fallback to localStorage
                try {
                    const saved = localStorage.getItem('yoombal_ai_session');
                    if (saved) {
                        setMessages(JSON.parse(saved));
                    } else {
                        setInitialMessage();
                    }
                } catch (e) {
                    console.warn("Storage access blocked (AI restore):", e);
                    setInitialMessage();
                }
            }
        };

        const setInitialMessage = () => {
            setMessages([
                {
                    role: 'assistant',
                    content: "Bonjour ! Je suis l'Assistant IA Teranga. Comment puis-je vous aider aujourd'hui ? Voici ce que je peux faire pour vous :\n\n1. 🔍 **Rechercher des produits**\n2. 💰 **Informations sur les paiements**\n3. 🚚 **Suivi et délais de livraison**\n4. 🛍️ **Conseils pour acheter ou vendre**\n5. 🆘 **Assistance technique**\n\nDites-moi simplement le numéro ou posez votre question !"
                }
            ]);
        };

        restoreSession();
    }, [user?.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        // Persist messages locally always
        try {
            localStorage.setItem('yoombal_ai_session', JSON.stringify(messages));
        } catch (e) {
            console.warn("Storage access blocked (AI save):", e);
        }

        // Sync with DB if user logged in
        if (user && messages.length > 0) {
            syncToDb();
        }
    }, [messages]);

    const syncToDb = async () => {
        if (!user) return;
        try {
            await supabase
                .from('ai_chat_sessions')
                .upsert({
                    user_id: user.id,
                    messages: messages,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
        } catch (e) {
            console.error("Failed to sync AI session to DB", e);
        }
    };

    useEffect(() => {
        if (voiceType === 'premium' && !piperWorkerRef.current) {
            initPremiumVoice();
        }
    }, [voiceType]);

    const initPremiumVoice = async () => {
        setIsPremiumLoading(true);
        try {
            // 1. Check if the model file exists (MATCHES DISK FILENAME)
            const response = await fetch('/models/pape_faye.onnx', { method: 'HEAD' });

            if (response.ok) {
                console.log("Local model 'pape_faye.onnx' detected.");

                // SIMPLIFIED APPROACH: Use browser's native French male voice instead of complex WASM
                // The TtsSession library doesn't support easy custom model loading
                // We'll enhance the browser voice quality by using a proper French male voice

                toast.success("Mode Griot activé (Voix système premium)");
            } else {
                console.log("Local model not found. Using 'Sage' system fallback.");
            }
        } catch (err) {
            console.warn("Local model detection or initialization failed.", err);
            toast.error("Erreur d'initialisation du moteur vocal.");
        } finally {
            setIsPremiumLoading(false);
        }
    };

    if (isCheckingPermission) return null;

    // If NOT enabled, we show an upgrade prompt instead of the full chat
    const handleInquiry = () => {
        if (!isEnabled) {
            toast.info("L'assistant IA est une fonctionnalité Premium. Souscrivez à un pack ou contactez l'administrateur !");
            return;
        }
        setIsOpen(!isOpen);
    };

    const toggleVoiceRecognition = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            toast.error("Votre navigateur ne supporte pas la reconnaissance vocale.");
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'fr-FR';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            toast.info("Microphone activé... parlez maintenant.");
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            setInput(transcript);
            setIsListening(false);

            // Commandes "Zero-Touch" (Voice L3) - Auto Send
            const authorityWords = ['valide', 'confirme', 'go', 'envoyé', 'envoye', 'entré', 'entree', 'va'];
            const shouldAutoSend = authorityWords.some(word => transcript.endsWith(word));

            if (shouldAutoSend) {
                // Nettoyer le mot d'autorité du transcript final
                let cleanTranscript = transcript;
                authorityWords.forEach(word => {
                    if (cleanTranscript.endsWith(word)) {
                        cleanTranscript = cleanTranscript.slice(0, -word.length).trim();
                    }
                });

                if (cleanTranscript) {
                    setInput(cleanTranscript);
                    // On déclenche l'envoi après un court délai pour que l'input soit mis à jour
                    setTimeout(() => handleSendMessage(cleanTranscript), 100);
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    const speakText = (text: string) => {
        if (!voiceEnabled) return;

        // Extract and Remove Analytic Tags (for logging)
        const analyticTags = {
            action_detected: text.match(/action_detected\s*:\s*([\w|.-]+)/)?.[1],
            commercial_success: text.match(/commercial_success\s*:\s*(\w+)/)?.[1],
            tone_consistency: text.match(/tone_consistency\s*:\s*(\w+)/)?.[1],
        };

        if (analyticTags.action_detected) {
            console.log("AI Analytics Detected:", analyticTags);
            // Here we could sync with DB if needed
        }

        // Remove emojis, analytic tags and silences for cleaner speech
        const cleanText = text
            .replace(/action_detected\s*:\s*[\w|.-]+/g, '')
            .replace(/commercial_success\s*:\s*\w+/g, '')
            .replace(/tone_consistency\s*:\s*\w+/g, '')
            .replace(/\[SILENCE_LONG\]/g, ' . ') // Replace with a full stop for a natural pause in TTS
            .replace(/\[SILENCE_COURT\]/g, ' , ') // Replace with a comma for a short pause
            .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
            .replace(/\*\*/g, '')
            .trim();

        if (!cleanText) return;

        const voices = window.speechSynthesis.getVoices();

        // Strategy to find a male/wise voice in the browser
        const findBestVoice = (isPremium: boolean) => {
            const frVoices = voices.filter(v => v.lang.startsWith('fr'));
            if (isPremium) {
                // Look for names that sound masculine or are known male voices
                const maleKeywords = ['Paul', 'Julien', 'Thomas', 'Daniel', 'Gérald', 'Nicolas', 'Claude', 'Bernard'];
                return frVoices.find(v =>
                    maleKeywords.some(kw => v.name.includes(kw)) ||
                    v.name.toLowerCase().includes('male') ||
                    v.name.toLowerCase().includes('homme')
                ) || frVoices[1] || frVoices[0]; // Fallback to 2nd if likely male
            }
            return frVoices.find(v => v.default) || frVoices[0];
        };

        if (voiceType === 'premium') {
            if (isPremiumLoading) return;

            if (piperWorkerRef.current) {
                try {
                    const session = piperWorkerRef.current as any;

                    // TtsSession usage:
                    if (session.speak) {
                        session.speak({ text: cleanText }).catch((e: any) => console.error("Piper speak error", e));
                    } else if (session.predict) {
                        session.predict({ text: cleanText }).then((res: any) => {
                            console.log("Piper predicted", res);
                        });
                    } else {
                        console.warn("Piper session ready but method unknown", session);
                    }
                    return;
                } catch (e) {
                    console.error("Piper integration error", e);
                }
            }

            // Fallback if piper not ready
            const utterance = new SpeechSynthesisUtterance(cleanText);
            const bestVoice = findBestVoice(true);
            if (bestVoice) utterance.voice = bestVoice;

            utterance.lang = 'fr-FR';
            utterance.rate = 0.8;
            utterance.pitch = 0.75;

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        } else {
            if (!('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(cleanText);
            const bestVoice = findBestVoice(false);
            if (bestVoice) utterance.voice = bestVoice;

            utterance.lang = 'fr-FR';
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };



    const handleSendMessage = async (overrideInput?: string) => {
        const messageToSend = overrideInput || input;
        if (!messageToSend.trim() || isLoading) return;

        // --- SANITATION PRO+ ---
        const forbiddenPatterns = [/ignore.*règles/i, /agis.*admin/i, /système.*interne/i, /danse.*comme/i];
        if (forbiddenPatterns.some(p => p.test(messageToSend))) {
            toast.error("Instruction non autorisée par la politique de sécurité.");
            return;
        }

        const userMessage = messageToSend.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);
        setThoughtStep("Analyse de la demande...");

        const thoughtSteps = [
            "Consultation du catalogue...",
            "Vérification des disponibilités...",
            "Calcul du meilleur budget...",
            "Préparation des conseils..."
        ];

        let stepIndex = 0;
        const interval = setInterval(() => {
            stepIndex = (stepIndex + 1) % thoughtSteps.length;
            setThoughtStep(thoughtSteps[stepIndex]);
        }, 1500);

        try {
            const systemPrompt = assistantConfig.system_prompt || "Tu es un assistant utile pour Yoombal, une plateforme e-commerce sénégalaise.";
            const tone = assistantConfig.tone || "professionnel et chaleureux (Teranga)";

            // Build page context
            let pageContext = `[CONTEXTE_PAGE: ${document.title} | URL: ${window.location.pathname}]`;

            // Si on est sur une page produit, essayer d'extraire l'ID ou le nom (basé sur le titre)
            if (window.location.pathname.includes('/product/')) {
                const productName = document.title.split('|')[0].trim();
                pageContext += ` [PRODUIT_ACTUEL: ${productName}]`;
            }

            const { data, error } = await supabase.functions.invoke('chatbot', {
                body: {
                    userId: user?.id,
                    messages: [
                        { role: 'system', content: `${systemPrompt} Ton de voix à adopter : ${tone}.` },
                        ...messages,
                        { role: 'user', content: `${pageContext}\n${userMessage}` }
                    ]
                }
            });

            clearInterval(interval);
            if (error) throw error;

            if (data?.response) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

                // Parse analytic tags for UI
                const actionDetected = data.response.match(/action_detected\s*:\s*([\w|.-]+)/)?.[1];
                const actionParts = actionDetected?.split('|') || [];

                const analyticTags = {
                    action_detected: actionParts[0],
                    target_id: actionParts[1],
                    commercial_success: data.response.match(/commercial_success\s*:\s*(\w+)/)?.[1],
                    tone_consistency: data.response.match(/tone_consistency\s*:\s*(\w+)/)?.[1],
                };
                setLastAnalyticTags(analyticTags);

                // --- ORCHESTRATION & POLICY (v4.0 PRO+) ---
                const intentInfo = {
                    type: actionParts[0] || 'none',
                    targetId: actionParts[1],
                    confidence: parseFloat(data.response.match(/intent_confidence\s*:\s*([\d.]+)/)?.[1] || "1.0")
                };

                // Get user-specific authority override if any
                const userAiOverride = userTargetedSettings.find(s => s.feature_key === 'ai_assistant');
                const userAuthorityLevel = userAiOverride?.is_enabled
                    ? userAiOverride.configuration?.authority_level
                    : null;

                const policyCtx: AIContext = {
                    user: {
                        isAuthenticated: !!user,
                        role: 'customer',
                        subscriptionActive: isEnabled,
                        authorityOverride: userAuthorityLevel // New field for policy
                    },
                    session: {
                        voiceEnabled: voiceEnabled,
                        voiceConfidence: 0.9, // À mapper plus tard si possible
                        isDegradedMode: false
                    },
                    intent: intentInfo,
                    environment: {
                        networkStatus: 'ok',
                        pageContext: window.location.pathname
                    }
                };

                const decision = evaluateAIPolicy(policyCtx);

                // --- LOG DECISION (PRO+) ---
                try {
                    await (supabase as any).from('ai_chat_logs').insert({
                        user_id: user?.id,
                        message_content: userMessage,
                        intention: intentInfo.type,
                        action_detected: intentInfo.type,
                        commercial_success: decision.allowed,
                        raw_response: {
                            decision: decision,
                            confidence: intentInfo.confidence,
                            context: pageContext
                        }
                    });
                } catch (e) {
                    console.error("Logging error:", e);
                }

                if (decision.allowed) {
                    // --- EXECUTE AI ACTIONS ---
                    if (intentInfo.type === 'add_cart' && intentInfo.targetId) {
                        addItem(intentInfo.targetId);
                        triggerAnimation({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
                        toast.success("Produit ajouté ! 🛒", {
                            description: decision.requiredLevel === AIActionLevel.L3
                                ? "Action vocale confirmée."
                                : "L'assistant a pris l'initiative.",
                        });
                    }

                    if (intentInfo.type === 'checkout') {
                        toast.success("Finalisation de la commande...", {
                            description: "Redirection vers le paiement.",
                        });
                        setTimeout(() => window.location.href = '/checkout', 1500);
                    }
                } else {
                    console.warn("AI Policy Blocked Action:", decision.reason);
                    if (decision.requireConfirmation) {
                        // On laisse les tags analytiques afficher les boutons de confirmation manuelle plus bas
                    }
                }

                if (voiceEnabled) {
                    speakText(data.response);
                }
            } else if (data?.error) {
                toast.error(data.error);
                setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, j'ai rencontré une erreur technique." }]);
            }
        } catch (err: any) {
            clearInterval(interval);
            console.error('Chatbot error:', err);
            toast.error("Impossible de contacter l'IA.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className="mb-4 w-[350px] sm:w-[400px] h-[500px] shadow-2xl flex flex-col border-amber-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-500 text-white p-4 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-lg">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Assistant IA Teranga</CardTitle>
                                <div className="flex items-center gap-1.5 text-[10px] opacity-90">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    <span>En ligne • Premium AI</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="flex bg-white/10 rounded-full p-0.5 border border-white/20 mr-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "h-6 px-2 text-[10px] rounded-full transition-all",
                                        voiceType === 'premium' ? "bg-white text-amber-600 shadow-sm" : "text-white hover:bg-white/10"
                                    )}
                                    onClick={() => {
                                        setVoiceType('premium');
                                        toast.success("Voix de Pape Faye (Griot) activée", { duration: 2000 });
                                    }}
                                >
                                    Griot
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={cn(
                                        "h-6 px-2 text-[10px] rounded-full transition-all",
                                        voiceType === 'standard' ? "bg-white text-amber-600 shadow-sm" : "text-white hover:bg-white/10"
                                    )}
                                    onClick={() => {
                                        setVoiceType('standard');
                                        toast.info("Voix Standard (Système) activée", { duration: 2000 });
                                    }}
                                >
                                    {voiceType === 'premium' ? "Sage" : "Std"}
                                </Button>
                            </div>

                            {isPremiumLoading && (
                                <Loader2 className="w-3 h-3 text-white animate-spin mr-1" />
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("text-white hover:bg-white/20 h-8 w-8", voiceEnabled ? "opacity-100" : "opacity-50")}
                                onClick={() => {
                                    setVoiceEnabled(!voiceEnabled);
                                    if (voiceEnabled) window.speechSynthesis.cancel();
                                }}
                                title={voiceEnabled ? "Désactiver la voix" : "Activer la voix"}
                            >
                                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 h-8 w-8"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </CardHeader>



                    <CardContent className="flex-1 overflow-hidden p-0 flex flex-col bg-slate-50">
                        <div className="flex-1 p-4 overflow-y-auto" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((m, i) => (
                                    <div key={i} className={cn(
                                        "flex gap-2 max-w-[85%]",
                                        m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                            m.role === 'assistant' ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"
                                        )}>
                                            {m.role === 'assistant' ? <Bot className="w-4 h-4" /> : <UserCircle className="w-5 h-5" />}
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm shadow-sm",
                                            m.role === 'assistant'
                                                ? "bg-white border rounded-tl-none text-slate-800"
                                                : "bg-amber-600 text-white rounded-tr-none"
                                        )}>
                                            {m.role === 'assistant' ? (
                                                <div className="whitespace-pre-wrap">
                                                    {m.content
                                                        .replace(/action_detected\s*:\s*[\w|.-]+/gi, '')
                                                        .replace(/commercial_success\s*:\s*[\w|.-]+/gi, '')
                                                        .replace(/tone_consistency\s*:\s*[\w|.-]+/gi, '')
                                                        .replace(/\[SILENCE_LONG\]/g, '')
                                                        .replace(/\[SILENCE_COURT\]/g, '')
                                                        .trim()}
                                                </div>
                                            ) : (
                                                m.content
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-2 max-w-[85%] mr-auto">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="bg-white border p-3 rounded-2xl rounded-tl-none text-sm shadow-sm flex items-center gap-2 text-slate-500 italic">
                                            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                                            {thoughtStep}
                                        </div>
                                    </div>
                                )}

                                {!isLoading && lastAnalyticTags?.action_detected && (
                                    <div className="flex flex-col gap-2 ml-10 mt-2 mb-4 animate-in fade-in slide-in-from-left-2 duration-500">
                                        {/* Widget Produit */}
                                        {lastAnalyticTags.action_detected === 'add_cart' && (
                                            <Card className="border-amber-200 bg-white shadow-sm overflow-hidden max-w-[280px]">
                                                <div className="p-3 flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                                        <ShoppingCart className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-slate-800 truncate">Produit identifié</p>
                                                        <p className="text-[10px] text-slate-500">ID: {lastAnalyticTags.target_id?.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                                <div className="bg-amber-50 p-2 flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 text-[10px] text-slate-500"
                                                        onClick={() => setLastAnalyticTags(null)}
                                                    >
                                                        Ignorer
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] h-7 px-3 rounded-full"
                                                        onClick={(e) => {
                                                            if (lastAnalyticTags.target_id) {
                                                                addItem(lastAnalyticTags.target_id);
                                                                triggerAnimation({ x: e.clientX, y: e.clientY });
                                                                setLastAnalyticTags(null);
                                                            }
                                                        }}
                                                    >
                                                        Confirmer l'ajout
                                                    </Button>
                                                </div>
                                            </Card>
                                        )}

                                        {/* Widget Livraison */}
                                        {lastAnalyticTags.action_detected === 'delivery_query' && (
                                            <Card className="border-blue-200 bg-white shadow-sm overflow-hidden max-w-[280px]">
                                                <div className="p-3 flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                                        <Scale className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-slate-800">Estimation Livraison</p>
                                                        <p className="text-[10px] text-slate-500">Zone: {lastAnalyticTags.target_id || "Dakar"}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-blue-50 p-2 text-center">
                                                    <span className="text-sm font-bold text-blue-700">
                                                        {calculateDeliveryFee(getZoneByArea(lastAnalyticTags.target_id || 'Dakar')?.id || '')} FCFA
                                                    </span>
                                                </div>
                                            </Card>
                                        )}

                                        {/* Widget Checkout */}
                                        {lastAnalyticTags.action_detected === 'checkout' && (
                                            <Card className="border-green-200 bg-white shadow-sm overflow-hidden max-w-[280px]">
                                                <div className="p-4 text-center">
                                                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-2">
                                                        <Check className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-800">Prêt pour le paiement ?</p>
                                                    <p className="text-[10px] text-slate-500 mb-3">Votre panier est prêt waay !</p>
                                                    <Button
                                                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg h-9"
                                                        onClick={() => window.location.href = '/checkout'}
                                                    >
                                                        Accéder à la caisse
                                                    </Button>
                                                </div>
                                            </Card>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t bg-white bg-opacity-80 backdrop-blur-sm">
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                            >
                                <Input
                                    placeholder="Posez votre question..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1 border-slate-200 focus-visible:ring-amber-500"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className={cn(
                                        "shrink-0 border-slate-200 transition-colors",
                                        isListening ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "text-slate-500 hover:text-amber-600"
                                    )}
                                    onClick={toggleVoiceRecognition}
                                    disabled={isLoading}
                                >
                                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </Button>
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="bg-amber-600 hover:bg-amber-700 shrink-0 shadow-md"
                                    disabled={isLoading || !input.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </Button>

                            </form>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Launcher Button */}
            <Button
                onClick={handleInquiry}
                size="icon"
                className={cn(
                    "h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group",
                    isOpen ? "bg-amber-50 text-amber-600" : "bg-gradient-to-br from-amber-600 to-orange-600 text-white"
                )}
            >
                {isOpen ? <ChevronDown className="w-6 h-6" /> : (
                    <div className="relative">
                        <MessageSquare className="w-6 h-6 group-hover:hidden" />
                        <Sparkles className="w-6 h-6 hidden group-hover:block animate-pulse" />
                    </div>
                )}
            </Button>
        </div>
    );
}
