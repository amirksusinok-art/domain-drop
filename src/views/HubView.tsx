import React from 'react';
import { UserProfile, DomainItem, ScannerTask } from '../types/domain';
import { DomainCard } from '../components/DomainCard';
import { Compass, Gift, Sparkles, Trophy, ArrowRight, Zap, Layers, CheckCircle2 } from 'lucide-react';

interface HubViewProps {
  profile: UserProfile;
  activeTask?: ScannerTask;
  onNavigateTab: (tab: 'scanner' | 'collection' | 'workshop') => void;
  onSelectCard: (item: DomainItem) => void;
  onClaimDaily: () => void;
  canClaimDaily: boolean;
  onHaptic?: (type: 'light' | 'medium') => void;
}

export const HubView: React.FC<HubViewProps> = ({
  profile,
  activeTask,
  onNavigateTab,
  onSelectCard,
  onClaimDaily,
  canClaimDaily,
  onHaptic
}) => {
  const recentItems = [...profile.items].reverse().slice(0, 3);
  const totalCatalogNames = 35;
  const collectionPercentage = Math.min(100, Math.round((profile.items.length / totalCatalogNames) * 100));

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Daily Bonus Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-slate-900 to-slate-850 border border-slate-800 flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Ежедневный вход</h4>
            <p className="text-[11px] text-slate-400">
              Серия: <span className="text-amber-400 font-mono font-bold">{profile.claimedDailyStreak} дн.</span> (+10 DC)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onHaptic?.('medium');
            onClaimDaily();
          }}
          disabled={!canClaimDaily}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            canClaimDaily
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-[0_0_12px_rgba(245,158,11,0.3)] active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {canClaimDaily ? 'Забрать 10 DC' : 'Получено'}
        </button>
      </div>

      {/* Main Scanner Hero Action */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-b from-[#141b2a] to-[#0d121c] border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">
            Domain Scanner
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Активное испытание
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-100 font-sans">
          {activeTask ? activeTask.title : 'Исследование редких имён'}
        </h3>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {activeTask
            ? activeTask.description
            : 'Решайте логические задания, ищите палиндромы и открывайте редкие доменные имена.'}
        </p>

        {activeTask && (
          <div className="mt-3 flex items-center gap-3 text-xs font-mono">
            <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              +{activeTask.rewardCoins} DC
            </span>
            <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              +{activeTask.rewardXp} XP
            </span>
            <span className="text-slate-400">
              Награда: <strong className="text-slate-200">{activeTask.rewardItemPreview.name}</strong>
            </span>
          </div>
        )}

        <button
          onClick={() => {
            onHaptic?.('medium');
            onNavigateTab('scanner');
          }}
          className="mt-4 w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-[0.98] transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Перейти к сканеру имён</span>
          <ArrowRight className="w-3.5 h-3.5 ml-auto" />
        </button>
      </div>

      {/* Progress & Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Collection Progress */}
        <div
          onClick={() => {
            onHaptic?.('light');
            onNavigateTab('collection');
          }}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Коллекция</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-100">
            {profile.items.length} <span className="text-xs text-slate-500 font-normal">/ {totalCatalogNames}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              style={{ width: `${collectionPercentage}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
            {collectionPercentage}% собрано
          </span>
        </div>

        {/* Solved Tasks Counter */}
        <div
          onClick={() => {
            onHaptic?.('light');
            onNavigateTab('scanner');
          }}
          className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Заданий решено</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-bold text-slate-100">
            {profile.stats.tasksSolved}
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono mt-2 block">
            +{profile.stats.tasksSolved * 10} DC заработано
          </span>
        </div>
      </div>

      {/* Recent Discovered Items */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Последние находки ({profile.items.length})
          </h4>
          <button
            onClick={() => {
              onHaptic?.('light');
              onNavigateTab('collection');
            }}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Все</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {recentItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {recentItems.map((item) => (
              <DomainCard
                key={item.instanceId}
                item={item}
                size="sm"
                onClick={() => {
                  onHaptic?.('light');
                  onSelectCard(item);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center">
            <Sparkles className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              Ваша коллекция пока пуста.
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Пройдите первое логическое задание в сканере!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
