import React from 'react';
import { Home, Compass, Grid, Wrench, User } from 'lucide-react';

export type TabType = 'hub' | 'scanner' | 'collection' | 'workshop' | 'profile';

interface NavigationProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onHaptic?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onChangeTab,
  onHaptic
}) => {
  const tabs = [
    { id: 'hub', label: 'Главная', icon: Home },
    { id: 'scanner', label: 'Сканер', icon: Compass },
    { id: 'collection', label: 'Коллекция', icon: Grid },
    { id: 'workshop', label: 'Мастерская', icon: Wrench },
    { id: 'profile', label: 'Профиль', icon: User },
  ] as const;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 max-w-md mx-auto"
      style={{ paddingBottom: 'calc(0.375rem + var(--tg-content-safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                onHaptic?.();
                onChangeTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-cyan-400 font-semibold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
