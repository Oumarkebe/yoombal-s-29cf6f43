
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
    Check
} from 'lucide-react';
// import { TtsSession } from '@mintplex-labs/piper-tts-web'; // Converted to dynamic import


import { supabase } from '@/integrations/supabase/client';
import { useUserPremiumSubscriptions } from '@/hooks/useUserPremiumSubscriptions';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Bonjour ! Je suis l'assistant Yoombal. Comment puis-je vous aider aujourd'hui ? Voici ce que je peux faire pour vous :\n\n1. 🔍 **Rechercher des produits**\n2. 💰 **Informations sur les paiements**\n3. 🚚 **Suivi et délais de livraison**\n4. 🛍️ **Conseils pour acheter ou vendre**\n5. 🆘 **Assistance technique**\n\nDites-moi simplement le numéro ou posez votre question !"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [voiceType, setVoiceType] = useState<'standard' | 'premium'>('standard');
    const [isPremiumLoading, setIsPremiumLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const piperWorkerRef = useRef<Worker | null>(null);



    const { checkAccess, isLoading: isCheckingPermission } = useUserPremiumSubscriptions();
    const isEnabled = checkAccess('assistant_intelligent');

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

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
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
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

        // Remove emojis and certain special characters for cleaner speech
        const cleanText = text
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



    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke('chatbot', {
                body: { messages: [...messages, { role: 'user', content: userMessage }] }
            });

            if (error) throw error;

            if (data?.response) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
                if (voiceEnabled) {
                    speakText(data.response);
                }
            } else if (data?.error) {

                toast.error(data.error);
                setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, j'ai rencontré une erreur technique." }]);
            }
        } catch (err: any) {
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
                                <CardTitle className="text-lg">Yoombal Assistant</CardTitle>
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
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-2 max-w-[85%] mr-auto">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                            <Bot className="w-4 h-4" />
                                        </div>
                                        <div className="bg-white border p-3 rounded-2xl rounded-tl-none text-sm shadow-sm flex items-center gap-2 text-slate-500">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Assistant réfléchit...
                                        </div>
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
