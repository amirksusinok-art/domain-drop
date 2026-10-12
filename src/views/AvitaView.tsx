import React, { useState } from 'react';
import { DomainItem, UserProfile, AvitaDeal } from '../types/domain';

interface AvitaViewProps {
  profile: UserProfile;
  onSellToAvita: (items: DomainItem[], totalPayoutBC: number) => void;
  onNavigateToSites?: () => void;
  onSelectCard?: (item: DomainItem) => void;
}

export const AvitaView: React.FC<AvitaViewProps> = ({
  profile,
  onSellToAvita,
  onNavigateToSites,
  onSelectCard
}) => {
  const [subTab, setSubTab] = useState<'buyback' | 'history'>('buyback');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Items eligible for buyback (Unique items are strictly protected)
  const eligibleItems = (profile.items || []).filter(item => !item.isUnique);

  const filteredItems = eligibleItems.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.name.toLowerCase().includes(q) || item.zone.toLowerCase().includes(q);
  });

  // Calculate payout for an individual item
  const getItemPayout = (item: DomainItem): number => {
    let base = item.recycleValueBC || 5;
    // Bonuses for rare patterns or short names
    if (item.length <= 3) base += 5;
    if (item.categories.includes('Mirror') || item.categories.includes('Numeric Mix')) base += 5;
    return base;
  };

  // Calculate total payout for selected items
  const totalSelectedPayout = selectedIds.reduce((sum, id) => {
    const it = eligibleItems.find(item => item.id === id);
    return sum + (it ? getItemPayout(it) : 0);
  }, 0);

  const handleToggleSelect = (item: DomainItem) => {
    if (item.isUnique) return;
    setSelectedIds(prev =>
      prev.includes(item.id) ? prev.filter(id => id !== item.id) : [...prev, item.id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.slice(0, 200).map(it => it.id));
    }
  };

  const handleExecuteSale = () => {
    if (selectedIds.length === 0) return;
    const itemsToSell = eligibleItems.filter(it => selectedIds.includes(it.id));
    onSellToAvita(itemsToSell, totalSelectedPayout);
    setSelectedIds([]);
  };

  // Mock initial deals if empty for realism
  const deals: AvitaDeal[] = profile.avitaDeals || [];

  return (
    <div className="space-y-4 pb-28 pt-1 max-w-md mx-auto">
      {/* 1. STORE HEADER: Exact match to reference screenshot */}
      <div className="bg-app-surface/90 rounded-3xl p-4 sm:p-5 border border-app-border backdrop-blur-md shadow-lg relative overflow-hidden">
        {/* Subtle orange ambient glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5 relative">
          {/* Store Icon in rounded squircle with live status dot */}
          <div className="relative flex-shrink-0">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-2xl sm:text-3xl shadow-md border border-amber-400/40">
              🏪
            </div>
            {/* Live Green Status Dot */}
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-app-surface ring-2 ring-emerald-500/20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          {/* Title, Badge & Subtitle */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-app-text tracking-tight font-sans">
                «Авита»
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                Скупщик сайтов
              </span>
            </div>
            <p className="text-xs text-app-muted leading-relaxed mt-1">
              Покупает сайты за монеты (BC) по рыночным ценам без задержек и комиссий аукциона.
            </p>
          </div>
        </div>
      </div>

      {/* 2. SUBTABS SWITCHER */}
      <div className="flex rounded-2xl bg-app-surface p-1 border border-app-border">
        <button
          onClick={() => setSubTab('buyback')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'buyback'
              ? 'bg-app-surface-subtle text-amber-400 shadow-sm border border-app-border'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          📈 Скупка и Торг
        </button>

        <button
          onClick={() => setSubTab('history')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === 'history'
              ? 'bg-app-surface-subtle text-amber-400 shadow-sm border border-app-border'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          🕒 История сделок ({deals.length})
        </button>
      </div>

      {/* 3. SUBTAB CONTENT */}
      {subTab === 'buyback' ? (
        <div className="space-y-3">
          {/* Header Controls: Count & Select All */}
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-semibold text-app-muted">
              Выберите сайты (до 200 шт.):{' '}
              <span className="font-mono text-app-text font-bold">
                {selectedIds.length > 0 ? `(${selectedIds.length} выбрано)` : ''}
              </span>
            </div>

            {filteredItems.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                {selectedIds.length === filteredItems.length ? 'Снять выбор' : 'Выбрать все'}
              </button>
            )}
          </div>

          {/* Search bar if many items */}
          {eligibleItems.length > 4 && (
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск сайта для скупки..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-8 pr-3 rounded-xl bg-app-surface border border-app-border text-xs text-app-text placeholder-app-muted focus:outline-none focus:border-amber-500"
              />
              <span className="absolute left-2.5 top-2.5 text-xs text-app-muted">🔍</span>
            </div>
          )}

          {/* Items List or Empty State */}
          {filteredItems.length > 0 ? (
            <div className="space-y-2">
              {filteredItems.map(item => {
                const isSelected = selectedIds.includes(item.id);
                const payout = getItemPayout(item);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleSelect(item)}
                    className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                        : 'bg-app-surface/80 border-app-border hover:border-app-border-highlight'
                    }`}
                  >
                    {/* Left: Checkbox & Domain Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox square */}
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-500 border-amber-400 text-black shadow-sm'
                            : 'bg-app-surface-subtle border-app-border text-transparent'
                        }`}
                      >
                        ✓
                      </div>

                      {/* Domain typography */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 font-mono font-black text-sm uppercase text-app-text truncate">
                          <span>{item.name}</span>
                          <span className="text-rose-500">.{item.zone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle text-app-muted border border-app-border">
                            {item.length}C
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-app-surface-subtle text-sky-400 border border-sky-500/20">
                            {item.rarity}
                          </span>
                          {item.categories?.[0] && (
                            <span className="text-[10px] text-app-muted truncate hidden sm:inline">
                              {item.categories[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Buyback Price Offer in BC */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono font-black text-xs text-amber-400">
                        +{payout} BC
                      </div>
                      <div className="text-[10px] text-app-muted font-normal">
                        выкуп
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State: Exact text from image 2 */
            <div className="py-12 px-6 rounded-3xl bg-app-surface/60 border border-app-border text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-app-surface-subtle border border-app-border flex items-center justify-center text-2xl">
                📦
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-app-text">
                  У вас пока нет сайтов для продажи.
                </h3>
                <p className="text-xs text-app-muted max-w-xs mx-auto">
                  Зарегистрируйте новые сайты на терминале «Сайты» или откройте наборы.
                </p>
              </div>

              {onNavigateToSites && (
                <button
                  onClick={onNavigateToSites}
                  className="py-2.5 px-5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-md active:scale-95 transition-all"
                >
                  🌐 Перейти к терминалу Сайты
                </button>
              )}
            </div>
          )}

          {/* 4. STICKY BOTTOM ACTION BAR */}
          <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto">
            {selectedIds.length > 0 ? (
              <div className="bg-app-surface/95 backdrop-blur-md border border-amber-500/50 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 animate-slide-up">
                <div>
                  <div className="text-xs font-bold text-app-text">
                    Выбрано: {selectedIds.length} шт.
                  </div>
                  <div className="text-xs font-mono font-black text-amber-400">
                    Итого: +{totalSelectedPayout} BC
                  </div>
                </div>

                <button
                  onClick={handleExecuteSale}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>🏪</span>
                  <span>СДАТЬ В СКУПКУ (+{totalSelectedPayout} BC)</span>
                </button>
              </div>
            ) : (
              <button
                disabled
                className="w-full py-3.5 px-4 rounded-2xl font-mono font-bold text-xs bg-app-surface/80 border border-app-border text-app-muted cursor-not-allowed shadow-md text-center"
              >
                🏪 ВЫБЕРИТЕ САЙТЫ ДЛЯ СКУПКИ
              </button>
            )}
          </div>
        </div>
      ) : (
        /* History Subtab */
        <div className="space-y-3">
          {deals.length > 0 ? (
            <div className="space-y-2.5">
              {deals.map(deal => (
                <div
                  key={deal.id}
                  className="bg-app-surface/80 border border-app-border rounded-2xl p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-app-text">
                      Сделка #{deal.id}
                    </span>
                    <span className="font-mono font-black text-amber-400">
                      +{deal.totalPayoutBC} BC
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {deal.itemNames.map((name, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-app-surface-subtle border border-app-border text-app-muted"
                      >
                        {name}
                      </span>
                    ))}
                  </div>

                  <div className="text-[10px] text-app-muted">
                    {deal.timestamp ? new Date(deal.timestamp).toLocaleString('ru-RU') : 'Недавно'} • Сдано {deal.itemCount} шт.
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-app-surface/60 border border-app-border rounded-3xl p-6 space-y-2">
              <span className="text-3xl">🕒</span>
              <div className="text-xs font-semibold text-app-text">Сделок пока нет</div>
              <p className="text-[11px] text-app-muted">
                Сдавайте неиспользуемые сайты в скупку «Авита» и получайте мгновенные BC!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
