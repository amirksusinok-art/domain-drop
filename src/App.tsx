import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, DomainItem, Pack, MarketListing, ThemeId } from './types/domain';
import { apiClient } from './api/client';
import { useTelegram } from './hooks/useTelegram';
import { useAudio } from './hooks/useAudio';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { ReelModal } from './components/ReelModal';
import { CardDetailsModal } from './components/CardDetailsModal';
import { HubView } from './views/HubView';
import { PacksView } from './views/PacksView';
import { InventoryView } from './views/InventoryView';
import { MarketView } from './views/MarketView';
import { ProfileView } from './views/ProfileView';

export function App() {
  const { initData, impactOccurred, notificationOccurred, selectionChanged } = useTelegram();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const audio = useAudio(profile?.settings?.sound ?? true);

  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabType>('hub');

  // Pack Opening Reel state
  const [reelModalOpen, setReelModalOpen] = useState(false);
  const [activePack, setActivePack] = useState<Pack | null>(null);
  const [openedItem, setOpenedItem] = useState<DomainItem | null>(null);

  // Card Inspection state
  const [inspectedItem, setInspectedItem] = useState<DomainItem | null>(null);

  // Load user profile on mount
  useEffect(() => {
    apiClient.getProfile().then((data) => {
      setProfile(data);
      // Apply theme
      const currentTheme = data.settings?.theme || 'obsidian';
      document.documentElement.setAttribute('data-theme', currentTheme);
      setLoading(false);
    });
  }, []);

  // Update profile and persist
  const updateProfile = useCallback(
    (updater: (prev: UserProfile) => UserProfile) => {
      setProfile((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        apiClient.saveProfile(next, initData);
        return next;
      });
    },
    [initData]
  );

  // Handle Pack Opening
  const handleOpenPack = async (pack: Pack) => {
    if (!profile) return;
    if (profile.coins < pack.priceBC) {
      notificationOccurred('error');
      alert('Недостаточно BC монет для открытия этого набора!');
      return;
    }

    try {
      impactOccurred('medium');
      const { item, profile: updatedProfile } = await apiClient.openPack(pack.id, profile);
      setProfile(updatedProfile);
      setActivePack(pack);
      setOpenedItem(item);
      setReelModalOpen(true);
    } catch (err: any) {
      notificationOccurred('error');
      alert(err.message || 'Ошибка открытия набора');
    }
  };

  // Handle Daily Claim
  const handleClaimDaily = () => {
    updateProfile((prev) => ({
      ...prev,
      coins: prev.coins + 50,
      claimedDailyStreak: (prev.claimedDailyStreak || 0) + 1,
      lastDailyClaim: new Date().toISOString(),
      stats: {
        ...prev.stats,
        totalBCEarned: (prev.stats?.totalBCEarned || 0) + 50
      }
    }));
    audio.playClaim();
    notificationOccurred('success');
  };

  // Handle Recycle Items into BC
  const handleRecycle = async (itemIds: string[]) => {
    if (!profile || itemIds.length === 0) return;
    try {
      const { success, earnedBC, profile: updatedProfile } = await apiClient.recycleItems(profile.id, itemIds);
      if (success && updatedProfile) {
        setProfile(updatedProfile);
      } else {
        // Local calculation fallback
        updateProfile((prev) => {
          let gained = 0;
          const remaining = prev.items.filter((it) => {
            if (itemIds.includes(it.id)) {
              gained += it.recycleValueBC || 5;
              return false;
            }
            return true;
          });
          return {
            ...prev,
            coins: prev.coins + gained,
            items: remaining,
            stats: {
              ...prev.stats,
              itemsRecycled: (prev.stats?.itemsRecycled || 0) + itemIds.length,
              totalBCEarned: (prev.stats?.totalBCEarned || 0) + gained
            }
          };
        });
      }
      audio.playClaim();
      notificationOccurred('success');
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Buy from Market
  const handleBuyListing = async (listing: MarketListing) => {
    if (!profile) return;
    if (profile.coins < listing.priceBC) {
      notificationOccurred('error');
      alert('Недостаточно BC монет!');
      return;
    }

    try {
      const res = await apiClient.buyMarketItem(profile.id, listing.id);
      if (res.success && res.profile) {
        setProfile(res.profile);
      } else {
        updateProfile((prev) => ({
          ...prev,
          coins: prev.coins - listing.priceBC,
          items: [listing.item, ...prev.items],
          stats: {
            ...prev.stats,
            marketPurchases: (prev.stats?.marketPurchases || 0) + 1,
            totalBCSpent: (prev.stats?.totalBCSpent || 0) + listing.priceBC
          }
        }));
      }
      audio.playReveal();
      notificationOccurred('success');
      alert(`Домен ${listing.item.fullName || listing.item.name} успешно куплен!`);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle List Item on Market
  const handleListItem = async (itemId: string, priceBC: number) => {
    if (!profile) return;
    try {
      const res = await apiClient.listMarketItem(profile.id, itemId, priceBC);
      if (res.success && res.profile) {
        setProfile(res.profile);
      } else {
        updateProfile((prev) => ({
          ...prev,
          items: prev.items.filter((it) => it.id !== itemId),
          stats: {
            ...prev.stats,
            marketSales: (prev.stats?.marketSales || 0) + 1
          }
        }));
      }
      audio.playClick();
      notificationOccurred('success');
      alert('Домен успешно выставлен на биржу!');
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Auction Bid
  const handlePlaceBid = async (auctionId: string, amount: number) => {
    if (!profile) return;
    if (profile.coins < amount) {
      notificationOccurred('error');
      alert('Недостаточно BC монет!');
      return;
    }

    try {
      const res = await apiClient.bidAuction(profile.id, auctionId, amount);
      if (res.success) {
        audio.playClick();
        notificationOccurred('success');
        alert(`Ваша ставка ${amount} BC принята!`);
      } else {
        alert('Не удалось сделать ставку');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Album Claim
  const handleClaimAlbum = (albumId: string) => {
    updateProfile((prev) => ({
      ...prev,
      coins: prev.coins + 150,
      xp: prev.xp + 80,
      completedAlbumIds: [...(prev.completedAlbumIds || []), albumId]
    }));
    audio.playReveal();
    notificationOccurred('success');
  };

  // Handle Settings Update
  const handleUpdateSettings = (newSettings: Partial<UserProfile['settings']>) => {
    if (newSettings.theme) {
      document.documentElement.setAttribute('data-theme', newSettings.theme);
    }
    updateProfile((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));
    selectionChanged();
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-app-bg text-app-text flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl animate-pulse">
          👑
        </div>
        <div className="text-sm font-bold text-app-text tracking-wide">
          DOMAIN EMPIRE
        </div>
        <div className="text-xs text-app-muted">Загрузка реестра доменов...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg text-app-text flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Header */}
      <Header
        profile={profile}
        soundEnabled={profile.settings.sound}
        onToggleSound={() => handleUpdateSettings({ sound: !profile.settings.sound })}
      />

      {/* Main Views Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3">
        {currentTab === 'hub' && (
          <HubView
            profile={profile}
            onOpenPack={handleOpenPack}
            onSelectCard={setInspectedItem}
            onClaimDaily={handleClaimDaily}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'packs' && (
          <PacksView
            profile={profile}
            onOpenPack={handleOpenPack}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryView
            profile={profile}
            onSelectCard={setInspectedItem}
            onRecycle={handleRecycle}
            onClaimAlbum={handleClaimAlbum}
          />
        )}

        {currentTab === 'market' && (
          <MarketView
            profile={profile}
            onBuyListing={handleBuyListing}
            onPlaceBid={handlePlaceBid}
            onListItem={handleListItem}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      {/* Dynamic Reel Scroll Modal */}
      <ReelModal
        isOpen={reelModalOpen}
        pack={activePack}
        item={openedItem}
        fastOpen={profile.settings.fastOpen}
        onClose={() => setReelModalOpen(false)}
        onGoToMarket={(item) => {
          setReelModalOpen(false);
          setCurrentTab('market');
        }}
        audio={audio}
        haptics={{
          impact: (s) => impactOccurred(s),
          notification: (n) => notificationOccurred(n)
        }}
      />

      {/* Card Details Inspection Modal */}
      {inspectedItem && (
        <CardDetailsModal
          item={inspectedItem}
          onClose={() => setInspectedItem(null)}
          onToggleShowcase={(item) => {
            updateProfile((prev) => ({
              ...prev,
              items: prev.items.map((it) =>
                it.id === item.id ? { ...it, showcased: !it.showcased } : it
              )
            }));
          }}
          onGoToMarket={(item) => {
            setInspectedItem(null);
            setCurrentTab('market');
          }}
          onHaptic={(s) => impactOccurred(s)}
        />
      )}

      {/* Bottom Navigation Tab Bar */}
      <Navigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          selectionChanged();
          setCurrentTab(tab);
        }}
        inventoryCount={profile.items?.length || 0}
      />
    </div>
  );
}

export default App;
