import React, { useState } from 'react';
import { UserProfile, DomainItem } from '../types/domain';
import { DomainCard } from '../components/DomainCard';

interface HubViewProps {
  profile: UserProfile;
  onSelectCard: (item: DomainItem) => void;
  onClaimDaily: () => void;
  onNavigateTab: (tab: 'hub' | 'sites' | 'inventory' | 'market' | 'profile') => void;
}

export const HubView: React.FC<HubViewProps> = ({
  profile,
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

  const recentItems = (profile.items || []).slice(0, 4);

  return (
    <div className="space-y-4 pb-28 pt-1">
      {/* 1. Sleek Daily Reward Row */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl flex-shrink-0">
            🎁
          </div>
          <div>
            <div className="text-xs font-bold text-app-text">Ежедневный доход</div>
            <div className="text-[11px] text-app-muted">
              Серия: <span className="text-amber-400 font-bold">{profile.claimedDailyStreak || 1} дн.</span> (+50 BC)
            </div>
          </div>
        </div>

        <button
          onClick={handleClaim}
          disabled={isToday || dailyClaimed}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            isToday || dailyClaimed
              ? 'bg-app-surface-subtle text-app-muted border border-app-border cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 text-black font-bold active:scale-95 shadow-md shadow-emerald-500/20'
          }`}
        >
          {isToday || dailyClaimed ? 'Получено ✓' : '+50 BC'}
        </button>
      </div>

      {/* 2. Fast Banner to "Сайты" (Center Screen) */}
      <div
        onClick={() => onNavigateTab('sites')}
        className="card-carbon border border-white/[0.08] hover:border-emerald-500/40 rounded-3xl p-4.5 cursor-pointer transition-all active:scale-[0.99] shadow-lg flex items-center justify-between group"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold font-mono tracking-wider text-emerald-400 uppercase">
              ЦЕНТР ВЫПУСКА
            </span>
          </div>
          <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
            Регистрация новых сайтов
          </h3>
          <p className="text-[11px] text-app-muted">
            Выбирайте тариф от 0 до 1 500 BC и вращайте барабан
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
          ➔
        </div>
      </div>

      {/* 3. Daily Quests (Clean Minimalist List) */}
      <div className="bg-app-surface border border-app-border rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-app-muted">
            Задания дня (+100 BC бонус)
          </span>
          <span className="text-xs font-mono text-emerald-400 font-bold">1/3</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-app-border/40">
            <div>
              <div className="font-medium text-app-text">Выпустить бесплатный сайт</div>
              <div className="text-[10px] text-app-muted">+20 BC</div>
            </div>
            <span className="text-emerald-400 font-bold">✓</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-app-border/40">
            <div>
              <div className="font-medium text-app-text">Выставить домен на биржу</div>
              <div className="text-[10px] text-app-muted">+25 BC</div>
            </div>
            <button
              onClick={() => onNavigateTab('market')}
              className="px-2.5 py-1 rounded-lg bg-app-surface-subtle border border-app-border text-app-text text-[11px] hover:text-emerald-300 font-medium"
            >
              Перейти
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-app-text">Совершить сделку на бирже</div>
              <div className="text-[10px] text-app-muted">+40 BC</div>
            </div>
            <button
              onClick={() => onNavigateTab('market')}
              className="px-2.5 py-1 rounded-lg bg-app-surface-subtle border border-app-border text-app-text text-[11px] hover:text-emerald-300 font-medium"
            >
              Купить
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Collection Showcase */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-app-muted">
            Ваша коллекция ({profile.items.length})
          </span>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium"
          >
            Все домены →
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
            Коллекция пуста. Перейдите во вкладку Сайты!
          </div>
        )}
      </div>
    </div>
  );
};
