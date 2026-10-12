import React, { useState } from 'react';
import { UserProfile, Pack, DomainItem } from '../types/domain';
import { PACKS_CATALOG } from '../data/initialCatalog';
import { DomainCard } from '../components/DomainCard';

interface HubViewProps {
  profile: UserProfile;
  onOpenPack: (pack: Pack) => void;
  onSelectCard: (item: DomainItem) => void;
  onClaimDaily: () => void;
  onNavigateTab: (tab: 'packs' | 'inventory' | 'market' | 'profile') => void;
}

export const HubView: React.FC<HubViewProps> = ({
  profile,
  onOpenPack,
  onSelectCard,
  onClaimDaily,
  onNavigateTab
}) => {
  const [dailyClaimed, setDailyClaimed] = useState(false);

  // Check if daily was claimed today
  const lastClaim = profile.lastDailyClaim ? new Date(profile.lastDailyClaim) : null;
  const isToday = lastClaim && new Date().toDateString() === lastClaim.toDateString();

  const handleClaim = () => {
    if (isToday || dailyClaimed) return;
    setDailyClaimed(true);
    onClaimDaily();
  };

  const freePack = PACKS_CATALOG.find(p => p.id === 'pack_free') || PACKS_CATALOG[0];
  const basicPack = PACKS_CATALOG.find(p => p.id === 'pack_basic') || PACKS_CATALOG[1];
  const themedPack = PACKS_CATALOG.find(p => p.id === 'pack_themed') || PACKS_CATALOG[2];

  const recentItems = (profile.items || []).slice(0, 4);

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Welcome / Daily Rewards */}
      <div className="bg-app-surface border border-app-border rounded-3xl p-4.5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/30 border border-amber-500/30 flex items-center justify-center text-2xl">
              🎁
            </div>
            <div>
              <h2 className="text-sm font-bold text-app-text">Ежедневный доход</h2>
              <p className="text-xs text-app-muted">
                Серия: <span className="text-amber-400 font-bold">{profile.claimedDailyStreak || 1} дн.</span> (+50 BC)
              </p>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={isToday || dailyClaimed}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isToday || dailyClaimed
                ? 'bg-app-surface-subtle text-app-muted border border-app-border cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold active:scale-95 shadow-md shadow-amber-500/20'
            }`}
          >
            {isToday || dailyClaimed ? 'Получено ✓' : 'Забрать 50 BC'}
          </button>
        </div>
      </div>

      {/* Free Pack & Quick Open Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Free Pack Tile */}
        <div className="bg-app-surface border border-sky-500/30 rounded-3xl p-4 flex items-center justify-between gap-3 relative overflow-hidden group">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                0 BC
              </span>
              <span className="text-xs font-bold text-app-text">Бесплатный набор</span>
            </div>
            <p className="text-[11px] text-app-muted">
              Шанс получить домены .com, .org, .net
            </p>
          </div>

          <button
            onClick={() => onOpenPack(freePack)}
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs active:scale-95 transition-all shadow-md flex-shrink-0"
          >
            Открыть 🎁
          </button>
        </div>

        {/* Basic Pack Tile */}
        <div className="bg-app-surface border border-app-border rounded-3xl p-4 flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                100 BC
              </span>
              <span className="text-xs font-bold text-app-text">Basic Pack</span>
            </div>
            <p className="text-[11px] text-app-muted">
              Шанс на nova.com (Unique) и telegram.com
            </p>
          </div>

          <button
            onClick={() => onOpenPack(basicPack)}
            className="px-3.5 py-2 rounded-xl bg-app-surface-subtle hover:bg-app-border border border-app-border text-app-text font-bold text-xs active:scale-95 transition-all flex-shrink-0"
          >
            100 BC 📦
          </button>
        </div>
      </div>

      {/* Featured Packs Quick View */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-app-muted">
            Популярные наборы
          </h3>
          <button
            onClick={() => onNavigateTab('packs')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            Все наборы →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={() => onOpenPack(themedPack)}
            className="bg-app-surface border border-purple-500/30 hover:border-purple-400/50 rounded-2xl p-3.5 cursor-pointer transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">⚡</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                300 BC
              </span>
            </div>
            <div className="text-xs font-bold text-app-text group-hover:text-purple-300 transition-colors">
              Themed Pack
            </div>
            <div className="text-[10px] text-app-muted mt-0.5">
              Зоны .io, .dev, .gg, .app
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('market')}
            className="bg-app-surface border border-app-border hover:border-sky-500/50 rounded-2xl p-3.5 cursor-pointer transition-all active:scale-95 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">⚖️</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">
                Биржа
              </span>
            </div>
            <div className="text-xs font-bold text-app-text group-hover:text-sky-300 transition-colors">
              Рынок & Аукционы
            </div>
            <div className="text-[10px] text-app-muted mt-0.5">
              Торгуйте редкими лотами за BC
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quests */}
      <div className="bg-app-surface border border-app-border rounded-3xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-app-muted">
            Ежедневные задания (+100 BC бонус)
          </h3>
          <span className="text-[11px] font-mono text-amber-400 font-bold">
            1/3 готово
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-app-surface-subtle border border-app-border/60">
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-app-text">Открыть бесплатный набор</div>
              <div className="text-[10px] text-app-muted">+20 BC</div>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">✓ Готово</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-app-surface-subtle border border-app-border/60">
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-app-text">Выставить домен на биржу</div>
              <div className="text-[10px] text-app-muted">+25 BC</div>
            </div>
            <button
              onClick={() => onNavigateTab('market')}
              className="text-xs px-2.5 py-1 rounded-lg bg-app-border text-app-text hover:bg-sky-500/20 hover:text-sky-300 font-medium transition-colors"
            >
              Перейти
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-app-surface-subtle border border-app-border/60">
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-app-text">Совершить сделку на рынке</div>
              <div className="text-[10px] text-app-muted">+40 BC</div>
            </div>
            <button
              onClick={() => onNavigateTab('market')}
              className="text-xs px-2.5 py-1 rounded-lg bg-app-border text-app-text hover:bg-sky-500/20 hover:text-sky-300 font-medium transition-colors"
            >
              Купить
            </button>
          </div>
        </div>
      </div>

      {/* Recent Items in Inventory */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-app-muted">
            Ваша коллекция ({profile.items.length})
          </h3>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            Смотреть все →
          </button>
        </div>

        {recentItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {recentItems.map((item) => (
              <DomainCard
                key={item.id}
                item={item}
                onClick={() => onSelectCard(item)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-app-surface border border-app-border rounded-2xl text-app-muted text-xs">
            У вас пока нет доменов. Откройте бесплатный набор!
          </div>
        )}
      </div>
    </div>
  );
};
