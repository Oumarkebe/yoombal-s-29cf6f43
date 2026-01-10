
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserAiFeature } from '@/hooks/useUserAiFeature';

interface ImageQCProps {
    imageUrl: string;
    onVerified?: (passed: boolean) => void;
}

export function ImageQC({ imageUrl, onVerified }: ImageQCProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'passed' | 'failed'>('idle');
    const [feedback, setFeedback] = useState<string>('');
    const [score, setScore] = useState<number>(0);
    const { isEnabled: isVisionEnabled } = useUserAiFeature('ai_vision');

    const checkImageQuality = async () => {
        if (!isVisionEnabled) {
            toast.info("Le contrôle qualité par IA est une fonctionnalité Premium !");
            return;
        }

        if (!imageUrl) {
            toast.error("Veuillez d'abord sélectionner une image.");
            return;
        }

        setStatus('loading');
        try {
            // In a real scenario, we'd fetch the image or convert to base64
            // For now, if it's already a URL, we might need the Edge Function to handle it
            // or we convert to base64 if it's a blob/file.

            // Simplified: Assuming we can get a base64 or the function handles the URL
            // Let's assume we can fetch it and convert to base64 for the Edge Function
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64 = (reader.result as string).split(',')[1];

                const { data, error } = await supabase.functions.invoke('ai-vision', {
                    body: { image: base64, mode: 'image-qc' }
                });

                if (error) throw error;

                const result = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;

                setStatus(result.passed ? 'passed' : 'failed');
                setFeedback(result.feedback);
                setScore(result.score);
                if (onVerified) onVerified(result.passed);

                if (result.passed) {
                    toast.success("Image validée par l'IA !");
                } else {
                    toast.warning("L'IA suggère des améliorations pour cette image.");
                }
            };

        } catch (error) {
            console.error('Image QC error:', error);
            toast.error("Erreur lors du contrôle qualité.");
            setStatus('idle');
        }
    };

    return (
        <Card className="mt-4 border-amber-100 bg-amber-50/30 overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        <span className="font-semibold text-sm">Contrôle Qualité IA</span>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-100"
                        onClick={checkImageQuality}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <ImageIcon className="h-3 w-3 mr-2" />}
                        Vérifier l'image
                    </Button>
                </div>

                {status === 'idle' && (
                    <p className="text-xs text-amber-600/80">
                        L'IA peut analyser votre image pour s'assurer qu'elle respecte les standards professionnels.
                    </p>
                )}

                {status === 'loading' && (
                    <div className="flex flex-col items-center py-2 animate-pulse">
                        <Loader2 className="h-6 w-6 text-amber-400 mb-1 animate-spin" />
                        <span className="text-[10px] text-amber-500">Analyse en cours...</span>
                    </div>
                )}

                {(status === 'passed' || status === 'failed') && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${status === 'passed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {status === 'passed' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-bold ${status === 'passed' ? 'text-green-700' : 'text-red-700'}`}>
                                        {status === 'passed' ? 'Excellente Qualité' : 'Qualité Insuffisante'}
                                    </span>
                                    <span className="text-xs font-mono">{score}/100</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-1000 ${status === 'passed' ? 'bg-green-500' : 'bg-red-500'}`}
                                        style={{ width: `${score}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 bg-white/50 p-2 rounded border border-amber-100">
                            {feedback}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
