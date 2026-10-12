import React, { useState } from 'react';
import { DomainItem, UserProfile, Rarity } from '../types/domain';
import { DomainCard } from '../components/DomainCard';
import { ALBUMS } from '../data/albums';

interface InventoryViewProps {
  profile: UserProfile;
  onSelectCard: (item: DomainItem) => void;
  onRecycle: (itemIds: string[]) => void;
  onClaimAlbum: (albumId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  profile,
  onSelectCard,
  onRecycle,
  onClaimAlbum
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'albums'>('items');
  const [lengthFilter, setLengthFilter] = useState<'all' | '1-3' | '4-5' | '6-8'>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [recycleMode, setRecycleMode] = useState(false);
  const [selectedForRecycle, setSelectedForRecycle] = useState<string[]>([]);

  // Filter items
  const filteredItems = (profile.items || []).filter(item => {
    // Length filter
    if (lengthFilter === '1-3' && item.length > 3) return false;
    if (lengthFilter === '4-5' && (item.length < 4 || item.length > 5)) return false;
    if (lengthFilter === '6-8' && item.length < 6) return false;

    // Rarity filter
    if (rarityFilter === 'unique' && !item.isUnique) return false;
    if (rarityFilter !== 'all' && rarityFilter !== 'unique' && item.rarity !== rarityFilter) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.name.toLowerCase().includes(q) && !item.zone.toLowerCase().includes(q)) {
        return false;
      }
    }

    return true;
  });

  const toggleRecycleSelect = (item: DomainItem) => {
    if (item.isUnique) return; // Cannot recycle unique!
    setSelectedForRecycle(prev => 
      prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
    );
  };

  const calculateTotalRecycleValue = () => {
    return selectedForRecycle.reduce((sum, id) => {
      const item = profile.items.find(it => it.id === id);
      return sum + (item?.recycleValueBC || 5);
    }, 0);
  };

  const handleExecuteRecycle = () => {
    if (selectedForRecycle.length === 0) return;
    onRecycle(selectedForRecycle);
    setSelectedForRecycle([]);
    setRecycleMode(false);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Tab Switcher */}
      <div className="flex rounded-2xl bg-app-surface p-1 border border-app-border">
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'items'
              ? 'bg-app-surface-subtle text-sky-400 shadow-sm border border-app-border'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          Инвентарь ({profile.items?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('albums')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'albums'
              ? 'bg-app-surface-subtle text-sky-400 shadow-sm border border-app-border'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          Альбомы (6)
        </button>
      </div>

      {activeTab === 'items' ? (
        <div className="space-y-3">
          {/* Top Controls: Search & Recycle Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Поиск по имени или зоне..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-8 pr-3 rounded-xl bg-app-surface border border-app-border text-xs text-app-text placeholder-app-muted focus:outline-none focus:border-sky-500"
              />
              <span className="absolute left-2.5 top-2.5 text-xs text-app-muted">🔍</span>
            </div>

            <button
              onClick={() => {
                setRecycleMode(!recycleMode);
                setSelectedForRecycle([]);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 flex-shrink-0 ${
                recycleMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-app-surface text-app-muted hover:text-app-text border-app-border'
              }`}
            >
              <span>♻️</span>
              <span>{recycleMode ? 'Отмена' : 'Утиль (BC)'}</span>
            </button>
          </div>

          {/* Length Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setLengthFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                lengthFilter === 'all'
                  ? 'bg-app-surface-subtle text-app-text border-sky-500/60 font-semibold'
                  : 'bg-app-surface text-app-muted border-app-border'
              }`}
            >
              Все длины
            </button>
            <button
              onClick={() => setLengthFilter('1-3')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                lengthFilter === '1-3'
                  ? 'bg-app-surface-subtle text-app-text border-sky-500/60 font-semibold'
                  : 'bg-app-surface text-app-muted border-app-border'
              }`}
            >
              1-3C (Short)
            </button>
            <button
              onClick={() => setLengthFilter('4-5')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                lengthFilter === '4-5'
                  ? 'bg-app-surface-subtle text-app-text border-sky-500/60 font-semibold'
                  : 'bg-app-surface text-app-muted border-app-border'
              }`}
            >
              4-5C (Med)
            </button>
            <button
              onClick={() => setLengthFilter('6-8')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                lengthFilter === '6-8'
                  ? 'bg-app-surface-subtle text-app-text border-sky-500/60 font-semibold'
                  : 'bg-app-surface text-app-muted border-app-border'
              }`}
            >
              6-8C (Long)
            </button>
          </div>

          {/* Rarity & Unique Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {['all', 'unique', 'Secret', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'].map(r => (
              <button
                key={r}
                onClick={() => setRarityFilter(r)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase whitespace-nowrap border transition-all ${
                  rarityFilter === r
                    ? 'bg-app-surface-subtle text-sky-300 border-sky-500/60 font-bold'
                    : 'bg-app-surface text-app-muted border-app-border'
                }`}
              >
                {r === 'all' ? 'Все редкости' : r === 'unique' ? '★ Unique' : r}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredItems.map(item => {
                const isSelected = selectedForRecycle.includes(item.id);
                return (
                  <div key={item.id} className="relative">
                    <DomainCard
                      item={item}
                      selectable={recycleMode}
                      selected={isSelected}
                      showRecycleValue={recycleMode}
                      onClick={() => {
                        if (recycleMode) {
                          toggleRecycleSelect(item);
                        } else {
                          onSelectCard(item);
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center bg-app-surface border border-app-border rounded-2xl p-6 space-y-2">
              <span className="text-3xl">📭</span>
              <div className="text-xs font-semibold text-app-text">Предметы не найдены</div>
              <p className="text-[11px] text-app-muted">
                Попробуйте изменить параметры фильтров или открыть новый набор.
              </p>
            </div>
          )}

          {/* Sticky Recycle Bottom Bar */}
          {recycleMode && (
            <div className="fixed bottom-20 left-4 right-4 z-40 bg-app-surface/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 animate-slide-up">
              <div>
                <div className="text-xs font-bold text-app-text">
                  Выбрано: {selectedForRecycle.length} шт.
                </div>
                <div className="text-[11px] font-mono text-amber-300 font-bold">
                  +{calculateTotalRecycleValue()} BC на баланс
                </div>
              </div>

              <button
                onClick={handleExecuteRecycle}
                disabled={selectedForRecycle.length === 0}
                className={`py-2 px-4 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                  selectedForRecycle.length > 0
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-md'
                    : 'bg-app-surface-subtle text-app-muted border border-app-border cursor-not-allowed'
                }`}
              >
                Сдать в утиль ♻️
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Albums Subtab */
        <div className="space-y-3">
          {ALBUMS.map(album => {
            const userNames = new Set(profile.items.map(it => it.name.toUpperCase()));
            const completedCount = album.requiredNames.filter(name => userNames.has(name.toUpperCase())).length;
            const isCompleted = profile.completedAlbumIds?.includes(album.id);
            const canClaim = completedCount >= album.targetCount && !isCompleted;

            return (
              <div
                key={album.id}
                className="bg-app-surface border border-app-border rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-app-text">{album.title}</h3>
                    <p className="text-[11px] text-app-muted mt-0.5">{album.description}</p>
                  </div>
                  <span className="text-xl">{album.rewardBadge}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-app-muted">Прогресс серии</span>
                    <span className="text-sky-400 font-bold">
                      {completedCount}/{album.targetCount}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-app-bg rounded-full overflow-hidden border border-app-border">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (completedCount / album.targetCount) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs font-mono text-amber-300 font-bold">
                    Награда: +{album.rewardCoins} BC
                  </div>

                  {isCompleted ? (
                    <span className="text-xs text-emerald-400 font-bold">Получено ✓</span>
                  ) : canClaim ? (
                    <button
                      onClick={() => onClaimAlbum(album.id)}
                      className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md active:scale-95 transition-all"
                    >
                      Забрать награду
                    </button>
                  ) : (
                    <span className="text-[11px] text-app-muted">В процессе</span>
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
