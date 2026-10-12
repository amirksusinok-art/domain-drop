import React from 'react';
import { DomainItem } from '../types/domain';
import { DomainCard } from './DomainCard';

interface CardDetailsModalProps {
  item: DomainItem;
  onClose: () => void;
  onToggleShowcase?: (item: DomainItem) => void;
  onGoToMarket?: (item: DomainItem) => void;
  onHaptic?: (type: 'light' | 'medium') => void;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  item,
  onClose,
  onToggleShowcase,
  onGoToMarket,
  onHaptic
}) => {
  const formattedDate = new Date(item.obtainedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-app-surface border border-app-border rounded-3xl p-5 relative overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            onHaptic?.('light');
            onClose();
          }}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-app-surface-subtle border border-app-border text-app-muted hover:text-app-text flex items-center justify-center text-xs z-20"
        >
          ✕
        </button>

        {/* Card Component */}
        <div className="mt-2 mb-4">
          <DomainCard item={item} />
        </div>

        {/* Details list */}
        <div className="space-y-2 bg-app-surface-subtle p-3.5 rounded-2xl border border-app-border text-xs font-mono">
          <div className="flex items-center justify-between text-app-muted">
            <span>Экземпляр ID:</span>
            <span className="text-app-text font-bold">{item.instanceId}</span>
          </div>

          <div className="flex items-center justify-between text-app-muted">
            <span>Длина имени:</span>
            <span className="text-app-text font-bold">{item.length} символов</span>
          </div>

          <div className="flex items-center justify-between text-app-muted">
            <span>Доменная зона:</span>
            <span className="text-sky-400 font-bold">.{item.zone}</span>
          </div>

          <div className="flex items-center justify-between text-app-muted">
            <span>Категории:</span>
            <span className="text-app-text">{item.categories.join(', ')}</span>
          </div>

          <div className="flex items-center justify-between text-app-muted">
            <span>Стоимость в утиле:</span>
            <span className="text-amber-400 font-bold">
              {item.isUnique ? 'Нельзя утилизировать' : `+${item.recycleValueBC || 5} BC`}
            </span>
          </div>

          <div className="flex items-center justify-between text-app-muted">
            <span>Дата получения:</span>
            <span className="text-app-text">{formattedDate}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onHaptic?.('medium');
              onToggleShowcase?.(item);
            }}
            className={`py-2.5 px-3 rounded-xl font-semibold text-xs border flex items-center justify-center gap-1.5 transition-all ${
              item.showcased
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-app-surface-subtle border-app-border text-app-muted hover:text-app-text'
            }`}
          >
            <span>{item.showcased ? '★ В витрине' : '☆ На витрину'}</span>
          </button>

          <button
            onClick={() => {
              onHaptic?.('light');
              onClose();
              onGoToMarket?.(item);
            }}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <span>Продать на бирже ⚖️</span>
          </button>
        </div>
      </div>
    </div>
  );
};
