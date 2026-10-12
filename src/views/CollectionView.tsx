import React, { useState } from 'react';
import { DomainItem, Album, Category, Rarity } from '../types/domain';
import { DomainCard } from '../components/DomainCard';
import { Layers, BookOpen, Filter, CheckCircle, Award, Sparkles } from 'lucide-react';

interface CollectionViewProps {
  items: DomainItem[];
  albums: Album[];
  completedAlbumIds: string[];
  onSelectCard: (item: DomainItem) => void;
  onClaimAlbumReward: (albumId: string) => void;
  onHaptic?: (type: 'light' | 'medium' | 'heavy') => void;
  onPlaySound?: (type: 'click' | 'claim') => void;
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  items,
  albums,
  completedAlbumIds,
  onSelectCard,
  onClaimAlbumReward,
  onHaptic,
  onPlaySound
}) => {
  const [subTab, setSubTab] = useState<'inventory' | 'albums'>('inventory');
  const [lengthFilter, setLengthFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'all'>('all');

  // Filter items
  const filteredItems = items.filter((item) => {
    if (lengthFilter === 'short' && item.length > 3) return false;
    if (lengthFilter === 'medium' && (item.length < 4 || item.length > 5)) return false;
    if (lengthFilter === 'long' && item.length < 6) return false;
    if (rarityFilter !== 'all' && item.rarity !== rarityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Subtab navigation */}
      <div className="flex rounded-2xl bg-slate-900 p-1 border border-slate-800">
        <button
          onClick={() => {
            onPlaySound?.('click');
            onHaptic?.('light');
            setSubTab('inventory');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'inventory'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Инвентарь ({items.length})</span>
        </button>

        <button
          onClick={() => {
            onPlaySound?.('click');
            onHaptic?.('light');
            setSubTab('albums');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'albums'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Альбомы ({albums.length})</span>
        </button>
      </div>

      {subTab === 'inventory' && (
        <div className="space-y-3">
          {/* Filters Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {/* Length Filter */}
            <button
              onClick={() => {
                onPlaySound?.('click');
                setLengthFilter('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border whitespace-nowrap ${
                lengthFilter === 'all'
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}
            >
              Все длины
            </button>
            <button
              onClick={() => {
                onPlaySound?.('click');
                setLengthFilter('short');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border whitespace-nowrap ${
                lengthFilter === 'short'
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}
            >
              1-3C (Short)
            </button>
            <button
              onClick={() => {
                onPlaySound?.('click');
                setLengthFilter('medium');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border whitespace-nowrap ${
                lengthFilter === 'medium'
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}
            >
              4-5C (Med)
            </button>
            <button
              onClick={() => {
                onPlaySound?.('click');
                setLengthFilter('long');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border whitespace-nowrap ${
                lengthFilter === 'long'
                  ? 'bg-slate-800 text-white border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}
            >
              6-8C (Long)
            </button>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredItems.map((item) => (
                <DomainCard
                  key={item.instanceId}
                  item={item}
                  onClick={() => {
                    onPlaySound?.('click');
                    onHaptic?.('light');
                    onSelectCard(item);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Нет предметов, соответствующих выбранным фильтрам.
              </p>
            </div>
          )}
        </div>
      )}

      {subTab === 'albums' && (
        <div className="space-y-3">
          {albums.map((album) => {
            const ownedNames = new Set(items.map((i) => i.name));
            const matchedCount = album.requiredNames.filter((name) => ownedNames.has(name)).length;
            const isCompleted = matchedCount >= album.requiredNames.length;
            const isClaimed = completedAlbumIds.includes(album.id);
            const progressPct = Math.round((matchedCount / album.requiredNames.length) * 100);

            return (
              <div
                key={album.id}
                className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                      <span>{album.title}</span>
                      {isClaimed && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 inline" />
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {album.description}
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/60">
                    {matchedCount}/{album.requiredNames.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                          : 'bg-gradient-to-r from-cyan-400 to-blue-500'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Badges preview */}
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span className="text-amber-400/90 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>+{album.rewardCoins} DC, +{album.rewardXp} XP</span>
                  </span>

                  {isCompleted && !isClaimed && (
                    <button
                      onClick={() => {
                        onPlaySound?.('claim');
                        onHaptic?.('heavy');
                        onClaimAlbumReward(album.id);
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
                    >
                      Забрать награду
                    </button>
                  )}

                  {isClaimed && (
                    <span className="text-emerald-400 text-[11px] font-semibold">
                      Награда получена
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
