import React, { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { useAudio } from './hooks/useAudio';
import { DomainItem, UserProfile, ScannerTask, Album, Achievement } from './types/domain';
import { INITIAL_CATALOG, createInstanceItem } from './data/initialCatalog';
import { INITIAL_ALBUMS } from './data/albums';
import { SCANNER_TASKS } from './data/tasks';
import { CRAFT_RECIPES } from './data/recipes';
import { apiClient } from './api/client';

import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { RevealModal } from './components/RevealModal';
import { CardDetailsModal } from './components/CardDetailsModal';

import { HubView } from './views/HubView';
import { ScannerView } from './views/ScannerView';
import { CollectionView } from './views/CollectionView';
import { WorkshopView } from './views/WorkshopView';
import { ProfileView } from './views/ProfileView';

export function App() {
  const { user, initData, impactOccurred, notificationOccurred, selectionChanged } = useTelegram();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('hub');
  const [tasks] = useState<ScannerTask[]>(SCANNER_TASKS);
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS);

  // Modals state
  const [revealingItem, setRevealingItem] = useState<DomainItem | null>(null);
  const [inspectingItem, setInspectingItem] = useState<DomainItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const audio = useAudio(profile?.settings.sound ?? true);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Initial Load Profile
  useEffect(() => {
    apiClient.getProfile(initData, user).then((p) => {
      setProfile(p);
    });
  }, [initData, user]);

  // Persist Profile changes
  const updateProfile = useCallback(
    (updater: (prev: UserProfile) => UserProfile) => {
      setProfile((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        apiClient.saveProfile(next);
        return next;
      });
    },
    []
  );

  // Check XP level up
  const addXpAndCoins = useCallback(
    (xpDelta: number, coinsDelta: number) => {
      updateProfile((prev) => {
        let newXp = prev.xp + xpDelta;
        let newLevel = prev.level;
        let nextReq = prev.xpToNextLevel;

        while (newXp >= nextReq) {
          newXp -= nextReq;
          newLevel += 1;
          nextReq = Math.round(nextReq * 1.35);
          showToast(`🎉 Поздравляем! Достигнут уровень ${newLevel}!`);
          notificationOccurred('success');
        }

        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          xpToNextLevel: nextReq,
          coins: prev.coins + coinsDelta
        };
      });
    },
    [updateProfile, showToast, notificationOccurred]
  );

  // Daily Bonus Claim
  const canClaimDaily = Boolean(
    profile &&
      (!profile.lastDailyClaim ||
        new Date().toDateString() !== new Date(profile.lastDailyClaim).toDateString())
  );

  const handleClaimDaily = () => {
    if (!canClaimDaily) return;
    audio.playClaim();
    notificationOccurred('success');
    updateProfile((prev) => ({
      ...prev,
      coins: prev.coins + 10,
      claimedDailyStreak: prev.claimedDailyStreak + 1,
      lastDailyClaim: new Date().toISOString()
    }));
    showToast('✨ Получено 10 DC за ежедневный вход!');
  };

  // Solve Logic Task in Scanner
  const handleSolveTask = (taskId: string, chosenIndex: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !profile) return;

    // Check if task reward already obtained or generate unique instance
    const seq = profile.items.length + 101;
    const template = INITIAL_CATALOG.find((c) => c.name === task.rewardItemPreview.name) || {
      name: task.rewardItemPreview.name,
      zone: task.rewardItemPreview.zone,
      rarity: task.rewardItemPreview.rarity,
      categories: [task.rewardItemPreview.category],
      patternType: 'symmetric' as const
    };

    const newItem = createInstanceItem(template, seq);

    // Update profile
    updateProfile((prev) => {
      const isMirror = newItem.categories.includes('Mirror');
      const isShort = newItem.length <= 3;
      return {
        ...prev,
        items: [...prev.items, newItem],
        stats: {
          ...prev.stats,
          tasksSolved: prev.stats.tasksSolved + 1,
          totalScans: prev.stats.totalScans + 1,
          mirrorCount: prev.stats.mirrorCount + (isMirror ? 1 : 0),
          shortCount: prev.stats.shortCount + (isShort ? 1 : 0)
        }
      };
    });

    addXpAndCoins(task.rewardXp, task.rewardCoins);
    setRevealingItem(newItem);
  };

  // Quick Radar Scan using 15 DC
  const handleQuickRadarScan = () => {
    if (!profile || profile.coins < 15) return;

    // Deduct coins
    updateProfile((prev) => ({
      ...prev,
      coins: prev.coins - 15,
      stats: { ...prev.stats, totalScans: prev.stats.totalScans + 1 }
    }));

    // Pick a template from catalog
    const randomTemplate = INITIAL_CATALOG[Math.floor(Math.random() * INITIAL_CATALOG.length)];
    const seq = profile.items.length + 101;
    const newItem = createInstanceItem(randomTemplate, seq);

    updateProfile((prev) => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    addXpAndCoins(25, 0);
    setRevealingItem(newItem);
  };

  // Crafting in Workshop
  const handleCraft = (recipeId: string, itemIds: string[]) => {
    const recipe = CRAFT_RECIPES.find((r) => r.id === recipeId);
    if (!recipe || !profile) return;

    // Deduct coins and remove consumed items
    updateProfile((prev) => ({
      ...prev,
      coins: prev.coins - recipe.costCoins,
      items: prev.items.filter((i) => !itemIds.includes(i.instanceId)),
      stats: { ...prev.stats, craftedCount: prev.stats.craftedCount + 1 }
    }));

    // Pick target template name
    const targetName = recipe.outputPreview.possibleNames[0];
    const template = INITIAL_CATALOG.find((c) => c.name === targetName) || {
      name: targetName,
      zone: recipe.outputPreview.zone,
      rarity: recipe.outputPreview.rarity,
      categories: [recipe.outputPreview.category],
      patternType: 'geometric' as const
    };

    const seq = profile.items.length + 101;
    const craftedItem = createInstanceItem(template, seq);

    updateProfile((prev) => ({
      ...prev,
      items: [...prev.items, craftedItem]
    }));

    addXpAndCoins(80, 0);
    showToast(`🛠️ Предмет ${craftedItem.name} успешно создан!`);
    setRevealingItem(craftedItem);
  };

  // Claim Album Reward
  const handleClaimAlbumReward = (albumId: string) => {
    const album = albums.find((a) => a.id === albumId);
    if (!album || !profile) return;

    updateProfile((prev) => ({
      ...prev,
      completedAlbumIds: [...prev.completedAlbumIds, albumId]
    }));

    addXpAndCoins(album.rewardXp, album.rewardCoins);
    showToast(`🏆 Альбом "${album.title}" завершён! +${album.rewardCoins} DC`);
  };

  // Achievements
  const achievements: Achievement[] = [
    {
      id: 'first-item',
      title: 'Первый Контакт',
      description: 'Получите свой первый коллекционный предмет.',
      icon: '💎',
      progress: profile ? Math.min(1, profile.items.length) : 0,
      maxProgress: 1,
      unlocked: Boolean(profile?.stats.tasksSolved && profile.stats.tasksSolved >= 1),
      rewardCoins: 20
    },
    {
      id: 'short-collector',
      title: 'Мастер Лаконичности',
      description: 'Соберите 5 имён длиной от 1 до 3 символов.',
      icon: '⚡',
      progress: profile ? Math.min(5, profile.items.filter((i) => i.length <= 3).length) : 0,
      maxProgress: 5,
      unlocked: false,
      rewardCoins: 35
    },
    {
      id: 'mirror-seeker',
      title: 'Симметричный Разум',
      description: 'Найдите 3 зеркальных палиндрома.',
      icon: '🪞',
      progress: profile ? Math.min(3, profile.items.filter((i) => i.categories.includes('Mirror')).length) : 0,
      maxProgress: 3,
      unlocked: false,
      rewardCoins: 40
    },
    {
      id: 'master-crafter',
      title: 'Инженер Матрицы',
      description: 'Создайте 2 предмета по детерминированным рецептам мастерской.',
      icon: '🛠️',
      progress: profile ? Math.min(2, profile.stats.craftedCount) : 0,
      maxProgress: 2,
      unlocked: false,
      rewardCoins: 50
    }
  ];

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0b0e14] text-slate-200 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center animate-spin mb-4">
          <div className="w-4 h-4 bg-cyan-400 rounded-sm" />
        </div>
        <p className="font-mono text-xs text-cyan-400 tracking-wider">
          ЗАГРУЗКА DOMAINDROP...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 font-sans flex flex-col max-w-md mx-auto relative selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 border border-cyan-500/60 text-cyan-200 px-4 py-2 rounded-2xl shadow-xl text-xs font-mono backdrop-blur-md animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <Header
        profile={profile}
        soundEnabled={profile.settings.sound}
        hapticsEnabled={profile.settings.haptics}
        onToggleSound={() =>
          updateProfile((prev) => ({
            ...prev,
            settings: { ...prev.settings, sound: !prev.settings.sound }
          }))
        }
        onToggleHaptics={() =>
          updateProfile((prev) => ({
            ...prev,
            settings: { ...prev.settings, haptics: !prev.settings.haptics }
          }))
        }
        onHaptic={() => impactOccurred('light')}
      />

      {/* Main View Body */}
      <main className="flex-1 px-4 pt-3">
        {currentTab === 'hub' && (
          <HubView
            profile={profile}
            activeTask={tasks[0]}
            onNavigateTab={(tab) => {
              selectionChanged();
              setCurrentTab(tab);
            }}
            onSelectCard={(item) => setInspectingItem(item)}
            onClaimDaily={handleClaimDaily}
            canClaimDaily={canClaimDaily}
            onHaptic={(type) => impactOccurred(type)}
          />
        )}

        {currentTab === 'scanner' && (
          <ScannerView
            tasks={tasks}
            profile={profile}
            onSolveTask={handleSolveTask}
            onQuickRadarScan={handleQuickRadarScan}
            onHaptic={(type) => impactOccurred(type)}
            onPlaySound={(type) => {
              if (type === 'click') audio.playClick();
              if (type === 'correct') audio.playCorrect();
              if (type === 'wrong') audio.playWrong();
            }}
          />
        )}

        {currentTab === 'collection' && (
          <CollectionView
            items={profile.items}
            albums={albums}
            completedAlbumIds={profile.completedAlbumIds}
            onSelectCard={(item) => setInspectingItem(item)}
            onClaimAlbumReward={handleClaimAlbumReward}
            onHaptic={(type) => impactOccurred(type)}
            onPlaySound={(type) => {
              if (type === 'click') audio.playClick();
              if (type === 'claim') audio.playClaim();
            }}
          />
        )}

        {currentTab === 'workshop' && (
          <WorkshopView
            recipes={CRAFT_RECIPES}
            profile={profile}
            onCraft={handleCraft}
            onHaptic={(type) => impactOccurred(type)}
            onPlaySound={(type) => {
              if (type === 'click') audio.playClick();
              if (type === 'claim') audio.playClaim();
            }}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            profile={profile}
            achievements={achievements}
            onClaimAchievement={(id) => {
              showToast('✨ Награда за достижение получена!');
              addXpAndCoins(50, 30);
            }}
            onUpdateSettings={(newSettings) =>
              updateProfile((prev) => ({
                ...prev,
                settings: { ...prev.settings, ...newSettings }
              }))
            }
            onSelectCard={(item) => setInspectingItem(item)}
            onHaptic={(type) => impactOccurred(type)}
            onPlaySound={(type) => {
              if (type === 'click') audio.playClick();
              if (type === 'claim') audio.playClaim();
            }}
          />
        )}
      </main>

      {/* Bottom Tab Navigation */}
      <Navigation
        currentTab={currentTab}
        onChangeTab={(tab) => setCurrentTab(tab)}
        onHaptic={() => selectionChanged()}
      />

      {/* Reveal Modal Animation */}
      {revealingItem && (
        <RevealModal
          item={revealingItem}
          onClose={() => setRevealingItem(null)}
          onPlaySound={(name) => {
            if (name === 'scan') audio.playScan();
            if (name === 'reveal') audio.playReveal();
            if (name === 'claim') audio.playClaim();
          }}
          onHaptic={(type) => impactOccurred(type)}
        />
      )}

      {/* Card Details Inspect Modal */}
      {inspectingItem && (
        <CardDetailsModal
          item={inspectingItem}
          onClose={() => setInspectingItem(null)}
          onToggleShowcase={(item) => {
            updateProfile((prev) => ({
              ...prev,
              items: prev.items.map((i) =>
                i.instanceId === item.instanceId ? { ...i, showcased: !i.showcased } : i
              )
            }));
            setInspectingItem((prev) => (prev ? { ...prev, showcased: !prev.showcased } : null));
            showToast(item.showcased ? 'Убрано с витрины' : 'Добавлено на витрину!');
          }}
          onShare={(item) => {
            if (navigator.share) {
              navigator.share({
                title: `DomainDrop — ${item.name}`,
                text: `Я открыл редкое имя ${item.name} (${item.zone}) в DomainDrop!`,
                url: window.location.href
              }).catch(() => {});
            } else {
              navigator.clipboard?.writeText(
                `Я открыл редкое имя ${item.name} (${item.zone}) в DomainDrop!`
              );
              showToast('Ссылка скопирована в буфер обмена!');
            }
          }}
          onHaptic={(type) => impactOccurred(type)}
        />
      )}
    </div>
  );
}
export default App;
