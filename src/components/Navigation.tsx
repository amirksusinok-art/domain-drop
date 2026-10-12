import React from 'react';

export type TabType = 'hub' | 'packs' | 'inventory' | 'market' | 'profile';

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
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'hub', label: 'Главная', icon: '🏛️' },
    { id: 'packs', label: 'Наборы', icon: '📦' },
    { id: 'inventory', label: 'Инвентарь', icon: '🗃️' },
    { id: 'market', label: 'Биржа', icon: '⚖️' },
    { id: 'profile', label: 'Профиль', icon: '👤' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-app-surface/90 backdrop-blur-lg border-t border-app-border pb-[calc(0.5rem+var(--tg-content-safe-area-inset-bottom,env(safe-area-inset-bottom,0px)))] pt-2 px-2">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-sky-400 font-semibold scale-105'
                  : 'text-app-muted hover:text-app-text active:scale-95'
              }`}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-3 h-0.5 rounded-full bg-sky-400 shadow-sm" />
              )}
              {tab.id === 'inventory' && inventoryCount !== undefined && inventoryCount > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] font-mono font-bold flex items-center justify-center">
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
