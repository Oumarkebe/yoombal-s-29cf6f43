
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Mic,
    Camera,
    Sparkles,
    Loader2,
    MicOff,
    Image as ImageIcon
} from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { useUserAiFeature } from '@/hooks/useUserAiFeature';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AISearchControlsProps {
    onSearchUpdate: (term: string) => void;
    onSemanticSearch?: () => void;
}

export function AISearchControls({ onSearchUpdate, onSemanticSearch }: AISearchControlsProps) {
    const [isListening, setIsListening] = useState(false);
    const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);

    const { isEnabled: isSmartSearchEnabled } = useUserAiFeature('ai_smart_search');

    const toggleVoiceSearch = () => {
        if (!isSmartSearchEnabled) {
            toast.info("La recherche vocale est une fonctionnalité Premium !");
            return;
        }

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
            onSearchUpdate(transcript);
            setIsListening(false);
            toast.success(`Recherche vocale : "${transcript}"`);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
            toast.error("Erreur de reconnaissance vocale.");
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

    const handleVisualSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!isSmartSearchEnabled) {
            toast.info("La recherche visuelle est une fonctionnalité Premium !");
            return;
        }

        try {
            toast.loading("Analyse de l'image par l'IA...", { id: 'visual-search' });

            // Convert file to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = (reader.result as string).split(',')[1];

                const { data, error } = await supabase.functions.invoke('ai-vision', {
                    body: { image: base64, mode: 'visual-search' }
                });

                if (error) throw error;

                if (data?.result) {
                    onSearchUpdate(data.result);
                    toast.success("Mots-clés trouvés : " + data.result, { id: 'visual-search' });
                } else {
                    toast.error("L'IA n'a pas pu identifier le produit.", { id: 'visual-search' });
                }
            };
        } catch (error: any) {
            console.error('Visual search error:', error);
            toast.error("Erreur lors de la recherche visuelle.", { id: 'visual-search' });
        }
    };

    return (
        <TooltipProvider>
            <div className="flex items-center gap-1">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={itemClass(isListening)}
                            onClick={toggleVoiceSearch}
                        >
                            {isListening ? <MicOff className="h-5 w-5 animate-pulse text-red-500" /> : <Mic className="h-5 w-5" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Recherche Vocale IA</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleVisualSearch}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                            >
                                <Camera className="h-5 w-5" />
                            </Button>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>Recherche par Image (Visual Search)</TooltipContent>
                </Tooltip>

                {onSemanticSearch && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-gray-400 hover:text-purple-500 hover:bg-purple-50"
                                onClick={onSemanticSearch}
                            >
                                <Sparkles className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Améliorer par IA (Sémantique)</TooltipContent>
                    </Tooltip>
                )}
            </div>
        </TooltipProvider>
    );
}

function itemClass(active: boolean) {
    return active
        ? "h-9 w-9 bg-red-50 text-red-500"
        : "h-9 w-9 text-gray-400 hover:text-amber-500 hover:bg-amber-50";
}
