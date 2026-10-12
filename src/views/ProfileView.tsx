import React, { useState } from 'react';
import { UserProfile, DomainItem, Achievement } from '../types/domain';
import { DomainCard } from '../components/DomainCard';
import { User, Trophy, Settings, ShieldCheck, Volume2, Smartphone, Sparkles, HelpCircle, FileText } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  achievements: Achievement[];
  onClaimAchievement: (id: string) => void;
  onUpdateSettings: (settings: Partial<UserProfile['settings']>) => void;
  onSelectCard: (item: DomainItem) => void;
  onHaptic?: (type: 'light' | 'medium' | 'heavy') => void;
  onPlaySound?: (type: 'click' | 'claim') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  achievements,
  onClaimAchievement,
  onUpdateSettings,
  onSelectCard,
  onHaptic,
  onPlaySound
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'settings'>('achievements');
  const [showLegal, setShowLegal] = useState<boolean>(false);

  const showcasedItems = profile.items.filter((i) => i.showcased);

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Profile Header Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#151d2d] to-[#0e131d] border border-slate-800 flex items-center gap-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          {profile.firstName?.[0] || 'D'}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100 font-sans">
              {profile.firstName || profile.username || 'Коллекционер'}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
              Lvl {profile.level}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            @{profile.username || 'domain_user'}
          </p>

          <div className="mt-2 text-[11px] font-mono text-amber-400 flex items-center gap-1">
            <span>Баланс:</span>
            <strong className="text-amber-300 font-bold">{profile.coins} DC</strong>
          </div>
        </div>
      </div>

      {/* Showcase Shelf if any */}
      {showcasedItems.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono px-1">
            Персональная витрина
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {showcasedItems.map((item) => (
              <DomainCard
                key={item.instanceId}
                item={item}
                size="sm"
                onClick={() => {
                  onPlaySound?.('click');
                  onHaptic?.('light');
                  onSelectCard(item);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Profile Nav Bar */}
      <div className="flex rounded-2xl bg-slate-900 p-1 border border-slate-800">
        <button
          onClick={() => {
            onPlaySound?.('click');
            onHaptic?.('light');
            setActiveTab('achievements');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'achievements'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Достижения</span>
        </button>

        <button
          onClick={() => {
            onPlaySound?.('click');
            onHaptic?.('light');
            setActiveTab('settings');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Настройки</span>
        </button>
      </div>

      {/* Tab: Achievements */}
      {activeTab === 'achievements' && (
        <div className="space-y-2.5">
          {achievements.map((ach) => {
            const isDone = ach.progress >= ach.maxProgress;
            return (
              <div
                key={ach.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl">
                    {ach.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{ach.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      {ach.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-500">
                      <span>{ach.progress}/{ach.maxProgress}</span>
                      <span className="text-amber-400 font-semibold">+{ach.rewardCoins} DC</span>
                    </div>
                  </div>
                </div>

                {isDone && !ach.unlocked && (
                  <button
                    onClick={() => {
                      onPlaySound?.('claim');
                      onHaptic?.('heavy');
                      onClaimAchievement(ach.id);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 shadow-md active:scale-95 transition-all"
                  >
                    Забрать
                  </button>
                )}

                {ach.unlocked && (
                  <span className="text-[11px] font-mono font-bold text-emerald-400">
                    Получено
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Параметры приложения
            </h4>

            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-200">Звуковые эффекты</span>
              </div>
              <input
                type="checkbox"
                checked={profile.settings.sound}
                onChange={(e) => {
                  onHaptic?.('light');
                  onUpdateSettings({ sound: e.target.checked });
                }}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            {/* Haptics Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-200">Виброотклик (Haptic)</span>
              </div>
              <input
                type="checkbox"
                checked={profile.settings.haptics}
                onChange={(e) => {
                  onHaptic?.('light');
                  onUpdateSettings({ haptics: e.target.checked });
                }}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            {/* Animations Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-200">Плавные анимации</span>
              </div>
              <input
                type="checkbox"
                checked={profile.settings.animations}
                onChange={(e) => {
                  onHaptic?.('light');
                  onUpdateSettings({ animations: e.target.checked });
                }}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Legal and Terms trigger */}
          <button
            onClick={() => {
              onPlaySound?.('click');
              setShowLegal(!showLegal);
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Правила проекта и безопасность</span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">
              {showLegal ? 'Скрыть' : 'Подробнее'}
            </span>
          </button>

          {showLegal && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-2 font-mono">
              <p>
                <strong>DomainDrop / Domain Empire</strong> — интеллектуальная коллекционная игра внутри Telegram.
              </p>
              <p>
                Все предметы и монеты Domain Coins (DC) являются исключительно игровыми сущностями, не имеют денежной стоимости и не предоставляют прав на регистрацию реальных доменных имён в Интернете.
              </p>
              <p>
                Защита экономики: валидация initData по HMAC-SHA256, детерминированные рецепты крафта, защита от накруток.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
