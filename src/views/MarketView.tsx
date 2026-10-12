import React, { useState, useEffect } from 'react';
import { MarketListing, AuctionLot, UserProfile, DomainItem } from '../types/domain';
import { apiClient } from '../api/client';
import { DomainCard } from '../components/DomainCard';
import { AvitaView } from './AvitaView';

interface MarketViewProps {
  profile: UserProfile;
  onBuyListing: (listing: MarketListing) => void;
  onPlaceBid: (auctionId: string, amount: number) => void;
  onListItem: (itemId: string, priceBC: number) => void;
  onSellToAvita?: (items: DomainItem[], totalPayoutBC: number) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({
  profile,
  onBuyListing,
  onPlaceBid,
  onListItem,
  onSellToAvita
}) => {
  const [activeTab, setActiveTab] = useState<'market' | 'auctions' | 'avita'>('market');
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [auctions, setAuctions] = useState<AuctionLot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');

  // List Item Modal
  const [showListModal, setShowListModal] = useState(false);
  const [selectedItemToList, setSelectedItemToList] = useState<DomainItem | null>(null);
  const [listPriceInput, setListPriceInput] = useState('100');

  useEffect(() => {
    apiClient.getMarketListings().then(setListings);
    apiClient.getAuctions().then(setAuctions);
  }, []);

  const filteredListings = listings.filter(l => {
    if (rarityFilter !== 'all' && l.item.rarity !== rarityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!l.item.name.toLowerCase().includes(q) && !l.item.zone.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleCreateListing = () => {
    if (!selectedItemToList) return;
    const price = parseInt(listPriceInput, 10);
    if (isNaN(price) || price < 1) return;

    onListItem(selectedItemToList.id, price);
    setShowListModal(false);
    setSelectedItemToList(null);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Tab Switcher */}
      <div className="flex rounded-2xl bg-app-surface p-1 border border-app-border">
        <button
          onClick={() => setActiveTab('market')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'market'
              ? 'bg-app-surface-subtle text-sky-400 shadow-sm border border-app-border'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          Рынок 🛒
        </button>

        <button
          onClick={() => setActiveTab('auctions')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'auctions'
              ? 'bg-app-surface-subtle text-sky-400 shadow-sm border border-app-border'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          Аукционы 🔨
        </button>

        <button
          onClick={() => setActiveTab('avita')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'avita'
              ? 'bg-app-surface-subtle text-amber-400 shadow-sm border border-app-border'
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          🏪 «Авита»
        </button>
      </div>

      {activeTab === 'avita' ? (
        <AvitaView
          profile={profile}
          onSellToAvita={onSellToAvita || (() => {})}
        />
      ) : activeTab === 'market' ? (
        <div className="space-y-3">
          {/* Top Bar: Search & "List Item" Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Поиск по рынку..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-8 pr-3 rounded-xl bg-app-surface border border-app-border text-xs text-app-text placeholder-app-muted focus:outline-none focus:border-sky-500"
              />
              <span className="absolute left-2.5 top-2.5 text-xs text-app-muted">🔍</span>
            </div>

            <button
              onClick={() => setShowListModal(true)}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs transition-all active:scale-95 shadow-md flex-shrink-0"
            >
              + Продать
            </button>
          </div>

          {/* Rarity Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {['all', 'Rare', 'Epic', 'Legendary', 'Secret', 'Uncommon'].map(r => (
              <button
                key={r}
                onClick={() => setRarityFilter(r)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase whitespace-nowrap border transition-all ${
                  rarityFilter === r
                    ? 'bg-app-surface-subtle text-sky-300 border-sky-500/60 font-bold'
                    : 'bg-app-surface text-app-muted border-app-border'
                }`}
              >
                {r === 'all' ? 'Все лоты' : r}
              </button>
            ))}
          </div>

          {/* Listings List */}
          {filteredListings.length > 0 ? (
            <div className="space-y-2.5">
              {filteredListings.map(listing => {
                const canBuy = profile.coins >= listing.priceBC;
                const isMyListing = listing.seller === profile.username;

                return (
                  <div
                    key={listing.id}
                    className="bg-app-surface border border-app-border rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm hover:border-app-border-highlight transition-all"
                  >
                    <div className="w-28 flex-shrink-0">
                      <DomainCard item={listing.item} compact />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-app-text truncate">
                          {listing.item.fullName || `${listing.item.name}.${listing.item.zone}`}
                        </span>
                      </div>
                      <div className="text-[10px] text-app-muted">
                        Продавец: <span className="font-mono text-sky-400">@{listing.seller}</span>
                      </div>
                      <div className="text-xs font-mono font-black text-amber-300">
                        {listing.priceBC.toLocaleString()} BC
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {isMyListing ? (
                        <span className="text-[11px] font-semibold text-app-muted px-3 py-1.5 rounded-xl bg-app-surface-subtle border border-app-border">
                          Ваш лот
                        </span>
                      ) : (
                        <button
                          onClick={() => onBuyListing(listing)}
                          disabled={!canBuy}
                          className={`py-2 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                            canBuy
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-md'
                              : 'bg-app-surface-subtle text-app-muted border border-app-border cursor-not-allowed'
                          }`}
                        >
                          {canBuy ? 'Купить' : 'Мало BC'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center bg-app-surface border border-app-border rounded-2xl p-6 text-app-muted text-xs">
              На рынке пока нет таких предметов. Станьте первым продавцом!
            </div>
          )}
        </div>
      ) : (
        /* Auctions Tab */
        <div className="space-y-3">
          <div className="bg-app-surface border border-amber-500/30 rounded-2xl p-3 text-xs text-app-muted flex items-center gap-2">
            <span>🔥</span>
            <span>Ставки резервируются на балансе. При перебитии ставки средства возвращаются мгновенно.</span>
          </div>

          <div className="space-y-3">
            {auctions.map(auc => {
              const nextMinBid = auc.currentBidBC + auc.minStepBC;
              const canBid = profile.coins >= nextMinBid;

              return (
                <div
                  key={auc.id}
                  className="bg-app-surface border border-app-border rounded-3xl p-4 space-y-3 shadow-md relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-32 flex-shrink-0">
                      <DomainCard item={auc.item} />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">
                          ИДУТ ТОРГИ
                        </span>
                      </div>

                      <div>
                        <div className="text-xs text-app-muted">Текущая ставка:</div>
                        <div className="text-base font-black font-mono text-amber-300">
                          {auc.currentBidBC.toLocaleString()} BC
                        </div>
                      </div>

                      <div className="text-[11px] text-app-muted">
                        Лидер: <span className="font-mono text-sky-400">@{auc.highestBidder}</span>
                      </div>
                      <div className="text-[10px] font-mono text-app-muted">
                        Ставок: {auc.bidsCount}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-app-border flex items-center justify-between gap-2">
                    <button
                      onClick={() => onPlaceBid(auc.id, nextMinBid)}
                      disabled={!canBid}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md ${
                        canBid
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black'
                          : 'bg-app-surface-subtle text-app-muted border border-app-border cursor-not-allowed'
                      }`}
                    >
                      {canBid ? `Повысить до ${nextMinBid} BC 🔨` : 'Недостаточно BC'}
                    </button>

                    {auc.buyNowPriceBC && (
                      <button
                        onClick={() => onPlaceBid(auc.id, auc.buyNowPriceBC!)}
                        disabled={profile.coins < auc.buyNowPriceBC}
                        className="py-2.5 px-3 rounded-xl bg-app-surface-subtle hover:bg-app-border border border-app-border text-sky-300 font-semibold text-xs active:scale-95 transition-all"
                      >
                        Купить сейчас ({auc.buyNowPriceBC} BC)
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List Item Modal */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-app-surface border border-app-border rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-app-text">Выставить домен на биржу</h3>
              <button
                onClick={() => setShowListModal(false)}
                className="w-7 h-7 rounded-full bg-app-surface-subtle border border-app-border text-app-muted hover:text-app-text flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-app-muted">1. Выберите домен из инвентаря:</label>
              <div className="max-h-40 overflow-y-auto space-y-1.5 p-1 bg-app-bg rounded-xl border border-app-border">
                {profile.items.map(it => (
                  <div
                    key={it.id}
                    onClick={() => setSelectedItemToList(it)}
                    className={`p-2 rounded-lg text-xs font-mono flex items-center justify-between cursor-pointer border transition-colors ${
                      selectedItemToList?.id === it.id
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-app-surface border-app-border text-app-text hover:bg-app-surface-subtle'
                    }`}
                  >
                    <span>{it.fullName || `${it.name}.${it.zone}`}</span>
                    <span className="text-[10px] text-app-muted uppercase">{it.rarity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-app-muted">2. Укажите цену в BC:</label>
              <input
                type="number"
                min="1"
                value={listPriceInput}
                onChange={e => setListPriceInput(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-app-bg border border-app-border font-mono text-sm font-bold text-amber-300 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowListModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-app-surface-subtle hover:bg-app-border border border-app-border text-app-muted text-xs font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateListing}
                disabled={!selectedItemToList}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  selectedItemToList
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md active:scale-95'
                    : 'bg-app-surface-subtle text-app-muted border border-app-border cursor-not-allowed'
                }`}
              >
                Опубликовать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
