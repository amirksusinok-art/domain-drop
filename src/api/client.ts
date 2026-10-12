import { UserProfile, DomainItem, ScannerTask, CraftRecipe } from '../types/domain';
import { INITIAL_CATALOG, createInstanceItem, TRADEMARK_BLOCKLIST } from '../data/initialCatalog';
import { INITIAL_ALBUMS } from '../data/albums';
import { SCANNER_TASKS } from '../data/tasks';
import { CRAFT_RECIPES } from '../data/recipes';

const API_BASE = '/api';

export const apiClient = {
  async getProfile(initData: string, user: any): Promise<UserProfile> {
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, user })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback to local storage for dev
    }

    const localSaved = localStorage.getItem('domain_drop_profile');
    if (localSaved) {
      try {
        return JSON.parse(localSaved);
      } catch (e) {}
    }

    // Default starter profile
    const starterItem = createInstanceItem(INITIAL_CATALOG[0], 101);
    const starterProfile: UserProfile = {
      id: user?.id || 10842099,
      username: user?.username || 'domain_master',
      firstName: user?.first_name || 'Коллекционер',
      level: 1,
      xp: 40,
      xpToNextLevel: 100,
      coins: 50,
      items: [starterItem],
      completedAlbumIds: [],
      claimedDailyStreak: 1,
      lastDailyClaim: new Date().toISOString(),
      stats: {
        totalScans: 1,
        tasksSolved: 0,
        craftedCount: 0,
        mirrorCount: 0,
        shortCount: 1
      },
      settings: {
        haptics: true,
        sound: true,
        animations: true,
        lang: 'ru'
      }
    };

    localStorage.setItem('domain_drop_profile', JSON.stringify(starterProfile));
    return starterProfile;
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await fetch(`${API_BASE}/user/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
    } catch (e) {}
    localStorage.setItem('domain_drop_profile', JSON.stringify(profile));
  }
};
