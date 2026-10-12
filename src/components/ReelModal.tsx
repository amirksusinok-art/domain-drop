import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { DomainItem, Pack } from '../types/domain';
import { DomainCard } from './DomainCard';

interface ReelModalProps {
  isOpen: boolean;
  pack: Pack | null;
  item: DomainItem | null;
  fastOpen?: boolean;
  onClose: () => void;
  onGoToMarket?: (item: DomainItem) => void;
  audio?: {
    playScan: () => void;
    playReveal: () => void;
    playClick: () => void;
    playCorrect: () => void;
  };
  haptics?: {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notification: (type: 'error' | 'success' | 'warning') => void;
  };
}

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const ReelModal: React.FC<ReelModalProps> = ({
  isOpen,
  pack,
  item,
  fastOpen = false,
  onClose,
  onGoToMarket,
  audio,
  haptics
}) => {
  const [phase, setPhase] = useState<'spinning' | 'revealed'>('spinning');
  const [lockedChars, setLockedChars] = useState<(string | null)[]>([]);
  const [currentDisplayChars, setCurrentDisplayChars] = useState<string[]>([]);
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (!isOpen || !item) {
      setPhase('spinning');
      setLockedChars([]);
      setCurrentDisplayChars([]);
      timerRefs.current.forEach(t => clearTimeout(t));
      timerRefs.current = [];
      return;
    }

    const nameLen = item.name.length;
    const targetChars = item.name.toUpperCase().split('');

    if (fastOpen) {
      setLockedChars(targetChars);
      setCurrentDisplayChars(targetChars);
      setPhase('revealed');
      triggerCelebration();
      return;
    }

    // Initialize reels
    setPhase('spinning');
    setLockedChars(new Array(nameLen).fill(null));
    setCurrentDisplayChars(new Array(nameLen).fill('A'));

    // Audio start
    audio?.playScan();
    haptics?.impact('medium');

    // Rapid shuffle interval for spinning reels
    const interval = setInterval(() => {
      setCurrentDisplayChars(prev => {
        return prev.map((ch, idx) => {
          if (lockedChars[idx] !== null && lockedChars[idx] !== undefined) {
            return targetChars[idx];
          }
          return CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
        });
      });
    }, 45);

    // Stop reels sequentially
    const baseDelay = 900;
    const stepDelay = Math.max(180, Math.floor(1600 / nameLen));

    for (let i = 0; i < nameLen; i++) {
      const lockTimer = setTimeout(() => {
        setLockedChars(prev => {
          const next = [...prev];
          next[i] = targetChars[i];
          return next;
        });
        audio?.playClick();
        haptics?.impact('light');
      }, baseDelay + i * stepDelay);
      timerRefs.current.push(lockTimer);
    }

    // Complete reel spin
    const finishTimer = setTimeout(() => {
      clearInterval(interval);
      setLockedChars(targetChars);
      setCurrentDisplayChars(targetChars);
      setPhase('revealed');
      triggerCelebration();
    }, baseDelay + nameLen * stepDelay + 250);
    timerRefs.current.push(finishTimer);

    return () => {
      clearInterval(interval);
      timerRefs.current.forEach(t => clearTimeout(t));
      timerRefs.current = [];
    };
  }, [isOpen, item, fastOpen]);

  const triggerCelebration = () => {
    audio?.playReveal();
    haptics?.notification('success');

    if (item?.rarity === 'Legendary' || item?.rarity === 'Secret' || item?.isUnique) {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#38bdf8', '#a855f7', '#10b981', '#ec4899']
      });
    } else {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#60a5fa', '#94a3b8']
      });
    }
  };

  const handleSkip = () => {
    if (!item) return;
    const targetChars = item.name.toUpperCase().split('');
    timerRefs.current.forEach(t => clearTimeout(t));
    setLockedChars(targetChars);
    setCurrentDisplayChars(targetChars);
    setPhase('revealed');
    triggerCelebration();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-sm bg-app-surface border border-app-border rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Glow ambient */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: pack?.accentColor || '#38bdf8' }}
        />

        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{pack?.icon || '📦'}</span>
            <span className="text-xs font-semibold text-app-muted">
              {pack?.name || 'Открытие набора'}
            </span>
          </div>

          {phase === 'spinning' && (
            <button
              onClick={handleSkip}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium px-2 py-1 rounded-md bg-app-bg border border-app-border/40"
            >
              Пропустить ⏩
            </button>
          )}
        </div>

        {/* Dynamic Reel Drum */}
        {phase === 'spinning' ? (
          <div className="w-full py-8 flex flex-col items-center justify-center">
            <div className="text-[11px] font-mono text-app-muted uppercase tracking-widest mb-3">
              Генерация символов ({item.length} позиций)
            </div>

            {/* Reel Character Typography - Bare letters, no rounded border boxes */}
            <div className="flex items-center justify-center gap-0.5 sm:gap-1 max-w-full py-4 px-2 select-none">
              <div className="flex items-center font-mono font-black text-3xl sm:text-4xl tracking-widest uppercase">
                {currentDisplayChars.map((char, idx) => {
                  const isLocked = lockedChars[idx] !== null && lockedChars[idx] !== undefined;
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center justify-center w-7 sm:w-8 h-12 overflow-hidden"
                    >
                      <span
                        className={`transition-all duration-150 ${
                          isLocked
                            ? 'text-sky-300 scale-105 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]'
                            : 'text-app-muted/60 reel-cascade-down'
                        }`}
                      >
                        {isLocked ? lockedChars[idx] : char}
                      </span>
                    </span>
                  );
                })}
              </div>
              <span className="font-mono font-bold text-xl sm:text-2xl text-rose-400 uppercase tracking-wider ml-1.5 drop-shadow-sm">
                .{item.zone}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-app-muted">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>Расшифровка сигнатуры блокчейна...</span>
            </div>
          </div>
        ) : (
          /* Revealed Card View */
          <div className="w-full flex flex-col items-center animate-scale-up">
            <div className="w-full max-w-[280px] my-3">
              <DomainCard item={item} />
            </div>

            {/* Unique / Rarity Notification */}
            <div className="w-full text-center mt-2 mb-4">
              {item.isUnique ? (
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs tracking-wider uppercase shadow-sm">
                  👑 ВСЕМИРНЫЙ ЭКЗЕМПЛЯР #1/1
                </div>
              ) : (
                <div className="text-xs text-app-muted">
                  Добавлен в ваш инвентарь (#{item.instanceId})
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="w-full grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs transition-all active:scale-95 shadow-md"
              >
                В коллекцию
              </button>

              <button
                onClick={() => {
                  onClose();
                  onGoToMarket?.(item);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-app-surface-subtle hover:bg-app-border border border-app-border text-app-text font-semibold text-xs transition-all active:scale-95"
              >
                На биржу ⚖️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
