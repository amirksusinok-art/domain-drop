import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Pack, UserProfile, DomainItem } from '../types/domain';
import { PACKS_CATALOG } from '../data/initialCatalog';

interface SitesViewProps {
  profile: UserProfile;
  onOpenPack: (pack: Pack) => Promise<DomainItem | null | void>;
  audio?: {
    playScan: () => void;
    playReveal: () => void;
    playClick: () => void;
    playCorrect: () => void;
    playClaim: () => void;
  };
  haptics?: {
    impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notification: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const SitesView: React.FC<SitesViewProps> = ({
  profile,
  onOpenPack,
  audio,
  haptics
}) => {
  const [selectedPackIndex, setSelectedPackIndex] = useState(1); // default Basic Pack
  const selectedPack = PACKS_CATALOG[selectedPackIndex] || PACKS_CATALOG[1];

  // Rolling State
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeItem, setActiveItem] = useState<DomainItem | null>(() => {
    return profile.items?.[0] || null;
  });

  // Downward cascade slot characters
  const [slotColumns, setSlotColumns] = useState<string[]>([]);
  const [lockedChars, setLockedChars] = useState<(string | null)[]>([]);
  const [showOddsModal, setShowOddsModal] = useState(false);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Update activeItem if profile items change and not spinning
  useEffect(() => {
    if (!isSpinning && profile.items?.length > 0 && !activeItem) {
      setActiveItem(profile.items[0]);
    }
  }, [profile.items, isSpinning]);

  const displayedName = activeItem?.name ? activeItem.name.toUpperCase() : 'EMPIRE';
  const displayedZone = activeItem?.zone ? activeItem.zone.toUpperCase() : 'COM';
  const currentLen = activeItem?.length || displayedName.length;

  const handleSelectPack = (idx: number) => {
    if (isSpinning) return;
    haptics?.selectionChanged();
    audio?.playClick();
    setSelectedPackIndex(idx);
  };

  const handleLaunchSite = async () => {
    if (isSpinning) return;
    if (profile.coins < selectedPack.priceBC) {
      haptics?.notification('error');
      alert('Недостаточно BC монет для выпуска этого сайта!');
      return;
    }

    try {
      setIsSpinning(true);
      haptics?.impact('medium');
      audio?.playScan();

      // Trigger server/atomic roll
      const newItem = await onOpenPack(selectedPack);
      const targetItem = (newItem as DomainItem) || profile.items[0];

      if (!targetItem) {
        setIsSpinning(false);
        return;
      }

      setActiveItem(targetItem);
      const targetName = targetItem.name.toUpperCase();
      const len = targetName.length;
      const targetChars = targetName.split('');

      // Initialize cascade downward slots
      setLockedChars(new Array(len).fill(null));
      setSlotColumns(new Array(len).fill('A'));

      // Downward letter cascading interval
      const cascadeInterval = setInterval(() => {
        setSlotColumns(prev => {
          return prev.map((_, i) => {
            return CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
          });
        });
      }, 50);

      // Sequentially lock letters from left to right
      const baseDelay = 1100;
      const stepDelay = Math.max(160, Math.floor(1800 / len));

      for (let i = 0; i < len; i++) {
        const t = setTimeout(() => {
          setLockedChars(prev => {
            const next = [...prev];
            next[i] = targetChars[i];
            return next;
          });
          audio?.playClick();
          haptics?.impact('light');
        }, baseDelay + i * stepDelay);
        timersRef.current.push(t);
      }

      // Finish spin
      const endTimer = setTimeout(() => {
        clearInterval(cascadeInterval);
        setLockedChars(targetChars);
        setSlotColumns(targetChars);
        setIsSpinning(false);

        audio?.playReveal();
        haptics?.notification('success');

        confetti({
          particleCount: targetItem.isUnique || targetItem.rarity === 'Legendary' || targetItem.rarity === 'Secret' ? 80 : 35,
          spread: 80,
          origin: { y: 0.65 },
          colors: ['#00d07e', '#38bdf8', '#f59e0b', '#ec4899', '#ffffff']
        });
      }, baseDelay + len * stepDelay + 250);
      timersRef.current.push(endTimer);

    } catch (e) {
      setIsSpinning(false);
      haptics?.notification('error');
    }
  };

  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const canAfford = profile.coins >= selectedPack.priceBC;

  return (
    <div className="space-y-4 pb-28 pt-1 max-w-sm mx-auto">
      {/* 1. TOP PACK SELECTOR (Segmented Pills Control) */}
      <div className="bg-app-surface/80 p-1.5 rounded-2xl border border-app-border backdrop-blur-md">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {PACKS_CATALOG.map((pack, idx) => {
            const isSelected = selectedPackIndex === idx;
            return (
              <button
                key={pack.id}
                onClick={() => handleSelectPack(idx)}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all duration-200 flex-1 text-center ${
                  isSelected
                    ? 'bg-app-surface-subtle text-emerald-400 border border-emerald-500/40 shadow-sm scale-[1.02]'
                    : 'text-app-muted hover:text-app-text border border-transparent'
                }`}
              >
                <div className="truncate text-[11px]">{pack.name.split(' ')[0]}</div>
                <div className="text-[10px] text-app-muted font-normal">
                  {pack.priceBC === 0 ? '0 BC' : `${pack.priceBC} BC`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. THE SIGNATURE CARBON BLACK CARD (Inspired by Image 1) */}
      <div className="relative card-carbon rounded-3xl p-5 border border-white/[0.08] shadow-2xl overflow-hidden transition-all duration-300">
        {/* Subtle ambient card highlight */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        {/* Card Header: Brand & Contactless Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
              А
            </div>
            <span className="font-mono font-black text-xs tracking-wider text-rose-500 uppercase">
              {activeItem?.isUnique ? 'UNIQUE' : 'DOMAIN'}
            </span>
          </div>

          {/* Contactless waves SVG */}
          <div className="text-app-muted opacity-60">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 16.5a5 5 0 0 1 0-7" />
              <path d="M12 19a8.5 8.5 0 0 1 0-12" />
              <path d="M15.5 21.5a12 12 0 0 1 0-17" />
            </svg>
          </div>
        </div>

        {/* Gold Microchip Graphic */}
        <div className="mb-6">
          <div className="w-11 h-9 rounded-lg bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 p-0.5 shadow-md flex flex-col justify-between">
            <div className="h-full w-full rounded border border-amber-700/40 grid grid-cols-2 gap-0.5 p-0.5 opacity-90">
              <div className="border-r border-b border-amber-800/40" />
              <div className="border-b border-amber-800/40" />
              <div className="border-r border-amber-800/40" />
              <div />
            </div>
          </div>
        </div>

        {/* Center: Large Spaced Domain Characters / Waterfall Cascade */}
        <div className="my-6 text-center">
          {isSpinning ? (
            /* Streaming Downward Waterfall Slot Reel */
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {slotColumns.map((char, idx) => {
                const isLocked = lockedChars[idx] !== null && lockedChars[idx] !== undefined;
                return (
                  <div
                    key={idx}
                    className={`w-9 sm:w-11 h-13 sm:h-15 rounded-xl border flex items-center justify-center font-mono font-black text-2xl transition-all overflow-hidden ${
                      isLocked
                        ? 'bg-app-surface border-emerald-400 text-emerald-300 scale-105 shadow-md'
                        : 'bg-black/60 border-white/[0.08] text-app-muted'
                    }`}
                  >
                    <span className={isLocked ? '' : 'reel-cascade-down'}>
                      {isLocked ? lockedChars[idx] : char}
                    </span>
                  </div>
                );
              })}
              <div className="h-13 sm:h-15 px-2 rounded-xl bg-black/60 border border-white/[0.08] flex items-center justify-center font-mono font-bold text-xs text-app-muted">
                .{displayedZone}
              </div>
            </div>
          ) : (
            /* Idle / Revealed Big Spaced Typography */
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="font-mono font-black text-2xl sm:text-3xl tracking-widest text-white uppercase drop-shadow-md">
                {displayedName}
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                .{displayedZone}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer Metadata (Serial, Valid Thru, Code, Material) */}
        <div className="mt-8 pt-3 border-t border-white/[0.06] grid grid-cols-4 gap-2 text-[9px] font-mono">
          <div>
            <div className="text-amber-400/70 font-semibold">SERIAL</div>
            <div className="text-amber-300 font-bold mt-0.5">
              {activeItem?.instanceId || 'CD-008421'}
            </div>
          </div>
          <div>
            <div className="text-app-muted">VALID THRU</div>
            <div className="text-app-text font-bold mt-0.5">FOREVER</div>
          </div>
          <div>
            <div className="text-app-muted">CODE</div>
            <div className="text-app-text font-bold mt-0.5">{String(currentLen).padStart(3, '0')}</div>
          </div>
          <div>
            <div className="text-cyan-400/70 font-semibold">STATUS</div>
            <div className="text-cyan-300 font-bold mt-0.5 truncate uppercase">
              {activeItem?.isUnique ? 'UNIQUE' : activeItem?.rarity || 'STANDARD'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. VALUATION & DEMAND ROW (Directly below the Card) */}
      <div className="text-center space-y-1.5 py-2">
        <div className="text-xs font-mono text-app-muted">
          {activeItem?.rarity || 'Обычный'} • оценка
        </div>
        <div className="text-3xl font-black font-mono text-white tracking-tight">
          {activeItem ? `${(activeItem.recycleValueBC || 5) * 8} BC` : '0 BC'}
        </div>
        <div className="inline-block px-2.5 py-0.5 rounded-full bg-app-surface border border-app-border text-[10px] font-mono text-app-muted">
          ×1,15 спрос GLOBAL
        </div>
      </div>

      {/* 4. ACTIONS: HUGE VIBRANT GREEN BUTTON + FILTER/ODDS BUTTON */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleLaunchSite}
          disabled={isSpinning || !canAfford}
          className={`flex-1 py-4 px-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-150 flex items-center justify-center gap-2 shadow-xl ${
            isSpinning
              ? 'bg-emerald-600/50 text-emerald-200 cursor-wait'
              : canAfford
              ? 'bg-[#00d07e] hover:bg-[#00e88c] text-black active:scale-[0.98] shadow-emerald-500/20'
              : 'bg-app-surface text-app-muted border border-app-border cursor-not-allowed'
          }`}
        >
          {isSpinning ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
              <span>РЕГИСТРАЦИЯ ДОМЕНА...</span>
            </>
          ) : canAfford ? (
            <>
              <span className="text-xs">▶</span>
              <span>
                {selectedPack.priceBC === 0
                  ? 'ВЫПУСТИТЬ БЕСПЛАТНО'
                  : `ВЫПУСТИТЬ САЙТ (${selectedPack.priceBC} BC)`}
              </span>
            </>
          ) : (
            <span>НЕДОСТАТОЧНО BC МОНЕТ</span>
          )}
        </button>

        {/* Filter / Odds modal trigger */}
        <button
          onClick={() => setShowOddsModal(true)}
          className="w-14 h-14 rounded-2xl bg-app-surface hover:bg-app-surface-subtle border border-app-border flex items-center justify-center text-app-muted hover:text-app-text active:scale-95 transition-all flex-shrink-0 shadow-md"
          title="Вероятности набора"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>
      </div>

      {/* 5. ODDS BREAKDOWN MODAL */}
      {showOddsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-app-surface border border-app-border rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-app-text">
                Шансы: {selectedPack.name}
              </h3>
              <button
                onClick={() => setShowOddsModal(false)}
                className="w-7 h-7 rounded-full bg-app-surface-subtle border border-app-border text-app-muted hover:text-app-text flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-300">
                <span>Common</span>
                <span className="font-mono font-bold">{selectedPack.odds.Common}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-emerald-950/40 border border-emerald-900/40 text-emerald-400">
                <span>Uncommon</span>
                <span className="font-mono font-bold">{selectedPack.odds.Uncommon}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-blue-950/40 border border-blue-900/40 text-blue-400">
                <span>Rare (nova.com Unique)</span>
                <span className="font-mono font-bold">{selectedPack.odds.Rare}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-purple-950/40 border border-purple-900/40 text-purple-300">
                <span>Epic</span>
                <span className="font-mono font-bold">{selectedPack.odds.Epic}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-amber-950/40 border border-amber-900/40 text-amber-300">
                <span>Legendary (x7.io Unique)</span>
                <span className="font-mono font-bold">{selectedPack.odds.Legendary}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl bg-rose-950/40 border border-rose-900/40 text-rose-300">
                <span>Secret (telegram.com Unique)</span>
                <span className="font-mono font-bold">{selectedPack.odds.Secret}%</span>
              </div>
            </div>

            <button
              onClick={() => setShowOddsModal(false)}
              className="w-full py-2.5 rounded-xl bg-app-surface-subtle hover:bg-app-border border border-app-border text-app-text font-semibold text-xs"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
