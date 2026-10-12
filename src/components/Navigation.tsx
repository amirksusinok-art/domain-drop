import React from 'react';

export type TabType = 'hub' | 'inventory' | 'sites' | 'market' | 'profile';

interface NavigationProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  inventoryCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  inventoryCount
}) => {
  const tabs: { id: TabType; label: string; icon: string; isCenter?: boolean }[] = [
    { id: 'hub', label: 'Главная', icon: '🏛️' },
    { id: 'inventory', label: 'Инвентарь', icon: '🗃️' },
    { id: 'sites', label: 'Сайты', icon: '🌐', isCenter: true },
    { id: 'market', label: 'Биржа', icon: '⚖️' },
    { id: 'profile', label: 'Профиль', icon: '👤' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-app-surface/92 backdrop-blur-xl border-t border-app-border pb-[calc(0.5rem+var(--tg-content-safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))] pt-2 px-3 shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1 items-center">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center -mt-5 relative group"
              >
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 shadow-lg ${
                    isActive
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white scale-110 shadow-emerald-500/30 ring-2 ring-emerald-400/40'
                      : 'bg-gradient-to-tr from-sky-600 to-emerald-500 text-white hover:scale-105 shadow-sky-500/20'
                  }`}
                >
                  {tab.icon}
                </div>
                <span
                  className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-app-muted'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-sky-400 font-bold scale-105'
                  : 'text-app-muted hover:text-app-text active:scale-95'
              }`}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-sky-400 shadow-sm" />
              )}
              {tab.id === 'inventory' && inventoryCount !== undefined && inventoryCount > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-sm">
                  {inventoryCount > 99 ? '99+' : inventoryCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
