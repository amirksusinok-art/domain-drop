import React from 'react';
import { DomainItem } from '../types/domain';
import { DomainCard } from './DomainCard';
import { X, Calendar, Layers, Hash, Sparkles, Shield, Share2 } from 'lucide-react';

interface CardDetailsModalProps {
  item: DomainItem;
  onClose: () => void;
  onToggleShowcase?: (item: DomainItem) => void;
  onShare?: (item: DomainItem) => void;
  onHaptic?: (type: 'light' | 'medium') => void;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  item,
  onClose,
  onToggleShowcase,
  onShare,
  onHaptic
}) => {
  const formattedDate = new Date(item.obtainedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => {
            onHaptic?.('light');
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Card Component */}
        <div className="mt-2 mb-4">
          <DomainCard item={item} size="lg" />
        </div>

        {/* Details list */}
        <div className="space-y-2.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              Экземпляр ID:
            </span>
            <span className="text-slate-200 font-semibold">{item.instanceId}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Категории:
            </span>
            <span className="text-slate-200">{item.categories.join(', ')}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              Тип узора:
            </span>
            <span className="text-cyan-400 capitalize">{item.patternType}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Дата получения:
            </span>
            <span className="text-slate-200">{formattedDate}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              onHaptic?.('medium');
              onToggleShowcase?.(item);
            }}
            className={`py-2.5 px-3 rounded-xl font-medium text-xs border flex items-center justify-center gap-1.5 transition-all ${
              item.showcased
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{item.showcased ? 'В витрине' : 'На витрину'}</span>
          </button>

          <button
            onClick={() => {
              onHaptic?.('light');
              onShare?.(item);
            }}
            className="py-2.5 px-3 rounded-xl font-medium text-xs bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Поделиться</span>
          </button>
        </div>
      </div>
    </div>
  );
};
