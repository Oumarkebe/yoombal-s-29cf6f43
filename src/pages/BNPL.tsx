import React, { useRef, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import BNPLCalculator from '@/components/BNPLCalculator';

const BNPLPage = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  useEffect(() => {
    const h1 = document.getElementById('bnpl-title');
    if (h1) h1.focus();
  }, []);

  const handlePlayAudio = () => {
    if (audioRef.current && audioAvailable) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        if ('speechSynthesis' in window) {
          const utter = new window.SpeechSynthesisUtterance("Lecture de l'explication en wolof");
          utter.lang = "fr-FR";
          window.speechSynthesis.speak(utter);
        }
      }
    }
  };

  const handleAudioPlay = () => setIsPlaying(true);
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };
  const handleAudioError = () => {
    setAudioAvailable(false);
    setIsPlaying(false);
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) setAudioProgress(audioRef.current.currentTime);
  };
  const handleLoadedMetadata = () => {
    if (audioRef.current) setAudioDuration(audioRef.current.duration);
  };
  const formatTime = (t: number) => {
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center py-16">
        <Card className="max-w-lg w-full p-8 bg-white/90 border-0 shadow-xl rounded-2xl text-center">
          <h1 id="bnpl-title" className="text-3xl font-bold mb-4 text-gray-900" tabIndex={-1}>Paiement échelonné (BNPL)</h1>
          <p className="text-gray-600 mb-6">Découvrez comment fonctionne le paiement échelonné.</p>

          <div className="mb-6">
            <audio
              ref={audioRef}
              src="/public/audio/bnpl-wolof.mp3"
              onPlay={handleAudioPlay}
              onEnded={handleAudioEnded}
              onError={handleAudioError}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              hidden
            />
            <button
              onClick={handlePlayAudio}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {isPlaying ? "Arrêter l'audio" : "Écouter l'explication en wolof"}
            </button>
            {audioAvailable && (
              <div className="mt-2 text-sm text-gray-500">
                Progression : {formatTime(audioProgress)} / {formatTime(audioDuration)}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Simulateur de paiement</h2>
            <BNPLCalculator />
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default BNPLPage;
