import React, { useState, useEffect } from 'react';
import { UserProfile, ThemeId, UniqueRegistryEntry } from '../types/domain';
import { apiClient } from '../api/client';
import { ACHIEVEMENTS } from '../data/albums';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateSettings: (settings: Partial<UserProfile['settings']>) => void;
  onResetData?: () => void;
}

const THEMES: { id: ThemeId; name: string; bg: string; accent: string; desc: string }[] = [
  { id: 'obsidian', name: 'Obsidian (Графит)', bg: '#090c12', accent: '#38bdf8', desc: 'Темный графит с акцентами ледяной платины' },
  { id: 'midnight', name: 'Midnight (Полночь)', bg: '#060b18', accent: '#60a5fa', desc: 'Глубокий сапфировый океан и синий неон' },
  { id: 'oled', name: 'OLED Matrix (Матрица)', bg: '#000000', accent: '#10b981', desc: 'Абсолютный черный с изумрудным кибер-свечением' },
  { id: 'amber', name: 'Cyber Amber (Янтарь)', bg: '#0c0a06', accent: '#f59e0b', desc: 'Теплый углерод и благородное золото' },
  { id: 'amethyst', name: 'Amethyst (Аметист)', bg: '#0d0818', accent: '#c084fc', desc: 'Королевский пурпур и обсидиан' },
  { id: 'studio', name: 'Studio Light (Светлая)', bg: '#f8fafc', accent: '#4f46e5', desc: 'Минималистичный светлый интерфейс' }
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateSettings,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'unique' | 'achievements'>('settings');
  const [registry, setRegistry] = useState<UniqueRegistryEntry[]>([]);

  useEffect(() => {
    apiClient.getUniqueRegistry().then(setRegistry);
  }, []);

  return (
    <div className="space-y-4 pb-24">
      {/* Profile Overview Card */}
      <div className="bg-app-surface border border-app-border rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-md ring-2 ring-white/10 flex-shrink-0">
            {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'E'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-app-text truncate">{profile.firstName}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30">
                Lvl {profile.level}
              </span>
            </div>
            <div className="text-xs font-mono text-app-muted mt-0.5">
              @{profile.username}
            </div>
            <div className="text-xs font-mono font-bold text-amber-300 mt-1">
              Баланс: {profile.coins.toLocaleString()} BC
            </div>
          </div>
        </div>

        {/* Financial & Collection Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-app-border/60 text-center">
          <div className="p-2.5 rounded-xl bg-app-surface-subtle border border-app-border/40">
            <div className="text-[10px] text-app-muted uppercase font-mono">Доменов</div>
            <div className="text-sm font-bold font-mono text-app-text mt-0.5">
              {profile.items?.length || 0}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-app-surface-subtle border border-app-border/40">
            <div className="text-[10px] text-app-muted uppercase font-mono">Unique</div>
            <div className="text-sm font-bold font-mono text-amber-400 mt-0.5">
              {profile.items?.filter(it => it.isUnique).length || 0}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-app-surface-subtle border border-app-border/40">
            <div className="text-[10px] text-app-muted uppercase font-mono">Открыто</div>
            <div className="text-sm font-bold font-mono text-sky-400 mt-0.5">
              {profile.stats?.totalPacksOpened || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex rounded-2xl bg-app-surface p-1 border border-app-border">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-app-surface-subtle text-sky-400 shadow-sm border border-app-border'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          Настройки ⚙️
        </button>

        <button
          onClick={() => setActiveTab('unique')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'unique'
              ? 'bg-app-surface-subtle text-sky-400 shadow-sm border border-app-border'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          Реестр Unique 👑
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'achievements'
              ? 'bg-app-surface-subtle text-sky-400 shadow-sm border border-app-border'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          Достижения 🏆
        </button>
      </div>

      {/* TAB 1: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-fade-in">
          {/* Themes Section */}
          <div className="bg-app-surface border border-app-border rounded-3xl p-4.5 space-y-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-app-muted">
                Тема оформления (6 стилей)
              </h3>
              <p className="text-[11px] text-app-muted mt-0.5">
                Мгновенное переключение всей цветовой палитры интерфейса
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {THEMES.map(th => {
                const isSelected = profile.settings.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => onUpdateSettings({ theme: th.id })}
                    className={`p-3 rounded-2xl border text-left transition-all active:scale-95 relative overflow-hidden ${
                      isSelected
                        ? 'border-sky-400 ring-2 ring-sky-400/40 bg-app-surface-subtle shadow-md'
                        : 'border-app-border bg-app-bg hover:border-app-border-highlight'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm flex-shrink-0"
                        style={{ backgroundColor: th.bg }}
                      />
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: th.accent }}
                      />
                      <span className="text-xs font-bold text-app-text truncate">
                        {th.name.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[10px] text-app-muted leading-tight line-clamp-2">
                      {th.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Toggles */}
          <div className="bg-app-surface border border-app-border rounded-3xl p-4.5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-app-muted">
              Управление и эффекты
            </h3>

            <div className="space-y-2.5">
              {/* Fast Open / Skip Roll */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-app-surface-subtle border border-app-border/60">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-app-text">Быстрое открытие наборов</div>
                  <div className="text-[10px] text-app-muted">Пропуск барабанной анимации прокрутки</div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ fastOpen: !profile.settings.fastOpen })}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    profile.settings.fastOpen ? 'bg-sky-500' : 'bg-app-border'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      profile.settings.fastOpen ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-app-surface-subtle border border-app-border/60">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-app-text">Звуковые эффекты (Web Audio)</div>
                  <div className="text-[10px] text-app-muted">Щелчки барабана, открытие карт, выигрыш</div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ sound: !profile.settings.sound })}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    profile.settings.sound ? 'bg-sky-500' : 'bg-app-border'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      profile.settings.sound ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Haptics Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-app-surface-subtle border border-app-border/60">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-app-text">Тактильная отдача (Telegram Haptics)</div>
                  <div className="text-[10px] text-app-muted">Вибрация при вращении барабана и кликах</div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ haptics: !profile.settings.haptics })}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    profile.settings.haptics ? 'bg-sky-500' : 'bg-app-border'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      profile.settings.haptics ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Legal / Disclaimer Notice */}
          <div className="p-4 rounded-2xl bg-app-surface-subtle border border-app-border/60 text-[11px] text-app-muted leading-relaxed space-y-1">
            <div className="font-semibold text-app-text">⚖️ Правила и статус доменов:</div>
            <p>
              Все доменные имена и монеты BC в Domain Empire являются исключительно виртуальными игровыми коллекционными объектами. Получение игрового предмета не предоставляет прав на настоящий интернет-домен или товарный знак.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: UNIQUE REGISTRY */}
      {activeTab === 'unique' && (
        <div className="space-y-3 animate-fade-in">
          <div className="bg-app-surface border border-amber-500/30 rounded-2xl p-3.5 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">👑</span>
              <h3 className="text-sm font-bold text-app-text">Единый серверный реестр Unique</h3>
            </div>
            <p className="text-xs text-app-muted leading-relaxed">
              Каждый уникальный предмет существует строго в одном экземпляре на весь мир. После выпадения его шанс становится 0%, а вероятность перераспределяется.
            </p>
          </div>

          <div className="space-y-2">
            {registry.map(item => {
              const isOwned = item.status === 'owned';
              const isAuction = item.status === 'auction';

              return (
                <div
                  key={item.id}
                  className="bg-app-surface border border-app-border rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm hover:border-app-border-highlight transition-all"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-app-text uppercase">
                        {item.fullName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                        {item.rarity}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-app-muted">
                      ID: {item.id}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    {isOwned ? (
                      <div>
                        <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/40">
                          Владелец: @{item.owner || 'collector'}
                        </span>
                      </div>
                    ) : isAuction ? (
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/40">
                        На аукционе 🔨
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 animate-pulse">
                        В пуле наборов 🎁
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="space-y-2.5 animate-fade-in">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = ach.unlocked;

            return (
              <div
                key={ach.id}
                className="bg-app-surface border border-app-border rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-app-surface-subtle border border-app-border flex items-center justify-center text-xl">
                    {ach.icon}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-app-text">{ach.title}</h4>
                    <p className="text-[10px] text-app-muted">{ach.description}</p>
                    <div className="text-[10px] font-mono text-amber-400 font-bold mt-0.5">
                      Награда: +{ach.rewardCoins} BC
                    </div>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <span className="text-xs text-emerald-400 font-bold">Выполнено ✓</span>
                  ) : (
                    <span className="text-[11px] font-mono text-app-muted">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
