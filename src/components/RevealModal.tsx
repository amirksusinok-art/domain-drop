import React, { useState, useEffect } from 'react';
import { DomainItem } from '../types/domain';
import { DomainCard } from './DomainCard';
import confetti from 'canvas-confetti';
import { Sparkles, Scan, ArrowRight, FastForward } from 'lucide-react';

interface RevealModalProps {
  item: DomainItem;
  onClose: () => void;
  onPlaySound?: (name: 'scan' | 'reveal' | 'claim') => void;
  onHaptic?: (type: 'light' | 'medium' | 'heavy') => void;
}

export const RevealModal: React.FC<RevealModalProps> = ({
  item,
  onClose,
  onPlaySound,
  onHaptic
}) => {
  const [phase, setPhase] = useState<'scanning' | 'revealing' | 'complete'>('scanning');
  const [revealedChars, setRevealedChars] = useState<number>(0);

  const letters = item.name.split('');

  useEffect(() => {
    // Step 1: Scanning beam phase (600ms)
    onPlaySound?.('scan');
    onHaptic?.('light');

    const scanTimer = setTimeout(() => {
      setPhase('revealing');
    }, 600);

    return () => clearTimeout(scanTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'revealing') return;

    // Step 2: Sequential character flip
    const charInterval = setInterval(() => {
      setRevealedChars((prev) => {
        const next = prev + 1;
        onPlaySound?.('scan');
        onHaptic?.('light');

        if (next >= letters.length) {
          clearInterval(charInterval);
          setTimeout(() => {
            setPhase('complete');
            onPlaySound?.('reveal');
            onHaptic?.('heavy');

            if (['Epic', 'Legendary', 'Secret'].includes(item.rarity)) {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
              });
            }
          }, 300);
        }
        return next;
      });
    }, 180);

    return () => clearInterval(charInterval);
  }, [phase, letters.length]);

  const handleSkip = () => {
    setRevealedChars(letters.length);
    setPhase('complete');
    onPlaySound?.('reveal');
    onHaptic?.('medium');
  };

  const handleClaim = () => {
    onPlaySound?.('claim');
    onHaptic?.('medium');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Top action: Skip animation */}
      {phase !== 'complete' && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white"
        >
          <FastForward className="w-3.5 h-3.5" />
          <span>Пропустить</span>
        </button>
      )}

      <div className="w-full max-w-sm flex flex-col items-center">
        {phase === 'scanning' && (
          <div className="flex flex-col items-center py-12 text-center animate-pulse">
            <div className="w-20 h-20 rounded-full border border-cyan-500/40 flex items-center justify-center relative mb-4">
              <Scan className="w-10 h-10 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
            </div>
            <h3 className="text-lg font-bold font-mono text-cyan-300">
              СКАНИРОВАНИЕ ДОМЕНА...
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Анализ частотности и топологии символов
            </p>
          </div>
        )}

        {phase === 'revealing' && (
          <div className="flex flex-col items-center py-10 w-full text-center">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">
              {item.zone} / ДЛИНА: {item.length}
            </span>

            {/* Matrix character display boxes */}
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-full">
              {letters.map((char, index) => {
                const isRevealed = index < revealedChars;
                return (
                  <div
                    key={index}
                    className={`w-11 h-14 rounded-xl border flex items-center justify-center font-mono font-bold text-2xl transition-all duration-200 ${
                      isRevealed
                        ? 'bg-slate-850 border-cyan-500/70 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isRevealed ? char : '?'}
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 mt-6">
              Синтез коллекционного предмета...
            </p>
          </div>
        )}

        {phase === 'complete' && (
          <div className="flex flex-col items-center w-full animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400 mb-3">
              <Sparkles className="w-4 h-4" />
              <span>НОВЫЙ ПРЕДМЕТ ПОЛУЧЕН!</span>
            </div>

            <div className="w-full">
              <DomainCard item={item} size="lg" />
            </div>

            <div className="mt-6 w-full flex flex-col gap-2">
              <button
                onClick={handleClaim}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <span>Забрать в коллекцию</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
