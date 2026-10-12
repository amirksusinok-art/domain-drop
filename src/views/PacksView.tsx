import React, { useState } from 'react';
import { Pack, UserProfile } from '../types/domain';
import { PACKS_CATALOG } from '../data/initialCatalog';

interface PacksViewProps {
  profile: UserProfile;
  onOpenPack: (pack: Pack) => void;
}

export const PacksView: React.FC<PacksViewProps> = ({
  profile,
  onOpenPack
}) => {
  const [selectedPackForOdds, setSelectedPackForOdds] = useState<Pack | null>(null);

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-app-surface border border-app-border rounded-3xl p-4.5 space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-app-text">Магазин наборов</h2>
          <div className="text-xs font-mono font-bold text-amber-300 bg-app-surface-subtle px-2.5 py-1 rounded-lg border border-app-border">
            Баланс: {profile.coins} BC
          </div>
        </div>
        <p className="text-xs text-app-muted">
          Честная математика выпадения. Каждый набор имеет строго определенные вероятности и список доступных доменных зон.
        </p>
      </div>

      {/* Packs Grid / List */}
      <div className="space-y-3">
        {PACKS_CATALOG.map((pack) => {
          const canAfford = profile.coins >= pack.priceBC;
          const isFree = pack.priceBC === 0;

          return (
            <div
              key={pack.id}
              className="bg-app-surface border border-app-border hover:border-app-border-highlight rounded-3xl p-4.5 transition-all shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-inner"
                    style={{
                      backgroundColor: `${pack.accentColor}15`,
                      borderColor: `${pack.accentColor}40`
                    }}
                  >
                    {pack.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-app-text">{pack.name}</h3>
                      {pack.badge && (
                        <span
                          className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold tracking-wider uppercase border"
                          style={{
                            backgroundColor: `${pack.accentColor}20`,
                            color: pack.accentColor,
                            borderColor: `${pack.accentColor}40`
                          }}
                        >
                          {pack.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-app-muted mt-0.5">{pack.subtitle}</p>
                  </div>
                </div>

                {/* Price Pill */}
                <div className="text-right">
                  <div className="font-mono font-black text-sm text-app-text">
                    {isFree ? 'БЕСПЛАТНО' : `${pack.priceBC.toLocaleString()} BC`}
                  </div>
                  <div className="text-[10px] text-app-muted">
                    {pack.zones.join(', ')}
                  </div>
                </div>
              </div>

              {/* Pack Description */}
              <p className="text-xs text-app-muted leading-relaxed">
                {pack.description}
              </p>

              {/* Rarity Chance Micro Preview */}
              <div className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-app-surface-subtle border border-app-border/40 text-[10px] font-mono overflow-x-auto">
                <span className="text-slate-400">Com {pack.odds.Common}%</span>
                <span className="text-app-border">•</span>
                <span className="text-emerald-400">Uncom {pack.odds.Uncommon}%</span>
                <span className="text-app-border">•</span>
                <span className="text-blue-400">Rare {pack.odds.Rare}%</span>
                <span className="text-app-border">•</span>
                <span className="text-purple-400">Epic {pack.odds.Epic}%</span>
                <span className="text-app-border">•</span>
                <span className="text-amber-400 font-bold">Leg {pack.odds.Legendary}%</span>
                <span className="text-app-border">•</span>
                <span className="text-rose-400 font-bold">Sec {pack.odds.Secret}%</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setSelectedPackForOdds(pack)}
                  className="py-2.5 px-3 rounded-xl bg-app-surface-subtle hover:bg-app-border border border-app-border text-app-muted hover:text-app-text text-xs font-semibold transition-all active:scale-95"
                >
                  Таблица шансов 📊
                </button>

                <button
                  onClick={() => onOpenPack(pack)}
                  disabled={!canAfford}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md ${
                    canAfford
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white'
                      : 'bg-app-surface-subtle text-app-muted border border-app-border cursor-not-allowed'
                  }`}
                >
                  {canAfford ? (isFree ? 'Открыть подарок 🎁' : `Открыть за ${pack.priceBC} BC ⚡`) : 'Недостаточно BC'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Odds Details Modal */}
      {selectedPackForOdds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-app-surface border border-app-border rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedPackForOdds.icon}</span>
                <h3 className="font-bold text-sm text-app-text">
                  Шансы: {selectedPackForOdds.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPackForOdds(null)}
                className="w-7 h-7 rounded-full bg-app-surface-subtle border border-app-border text-app-muted hover:text-app-text flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-slate-900/40 border border-slate-800 text-slate-300">
                <span>Common (Обычный)</span>
                <span className="font-mono font-bold">{selectedPackForOdds.odds.Common}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-emerald-400">
                <span>Uncommon (Необычный)</span>
                <span className="font-mono font-bold">{selectedPackForOdds.odds.Uncommon}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-blue-950/30 border border-blue-900/40 text-blue-400">
                <span>Rare (Редкий, включая nova.com)</span>
                <span className="font-mono font-bold">{selectedPackForOdds.odds.Rare}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-purple-950/30 border border-purple-900/40 text-purple-300">
                <span>Epic (Эпический)</span>
                <span className="font-mono font-bold">{selectedPackForOdds.odds.Epic}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-amber-950/30 border border-amber-900/40 text-amber-300">
                <span>Legendary (x7.io, unigram.org, vk.com)</span>
                <span className="font-mono font-bold">{selectedPackForOdds.odds.Legendary}%</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-rose-950/30 border border-rose-900/40 text-rose-300">
                <span>Secret (telegram.com, google.com, openai.com)</span>
                <span className="font-mono font-bold">{selectedPackForOdds.odds.Secret}%</span>
              </div>
            </div>

            <p className="text-[11px] text-app-muted leading-relaxed">
              * Если уникальный экземпляр уже выбит другим игроком, его шанс автоматически перераспределяется между остальными предметами той же редкости.
            </p>

            <button
              onClick={() => setSelectedPackForOdds(null)}
              className="w-full py-2.5 rounded-xl bg-app-surface-subtle hover:bg-app-border border border-app-border text-app-text font-semibold text-xs transition-colors"
            >
              Понятно
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
