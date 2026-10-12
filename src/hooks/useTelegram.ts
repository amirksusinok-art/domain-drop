import { useEffect, useState, useCallback } from 'react';

// Declarations for window.Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
  }
}

export function useTelegram() {
  const [tg, setTg] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [colorScheme, setColorScheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const webApp = window.Telegram?.WebApp;
    if (webApp) {
      setTg(webApp);
      try {
        webApp.ready();
        webApp.expand();
        if (webApp.isVersionAtLeast && webApp.isVersionAtLeast('8.0')) {
          webApp.requestFullscreen?.();
        }
        webApp.enableClosingConfirmation?.();
      } catch (e) {
        console.warn('TMA init warning:', e);
      }

      if (webApp.initDataUnsafe?.user) {
        setUser(webApp.initDataUnsafe.user);
      } else {
        // Fallback for standalone/dev
        setUser({
          id: 10842099,
          first_name: 'Коллекционер',
          username: 'domain_master'
        });
      }

      setColorScheme(webApp.colorScheme || 'dark');

      const onThemeChanged = () => {
        setColorScheme(webApp.colorScheme || 'dark');
      };
      const updateSafeAreas = () => {
        if (webApp.contentSafeAreaInset) {
          document.documentElement.style.setProperty('--tg-content-safe-area-inset-top', `${webApp.contentSafeAreaInset.top}px`);
          document.documentElement.style.setProperty('--tg-content-safe-area-inset-bottom', `${webApp.contentSafeAreaInset.bottom}px`);
          document.documentElement.style.setProperty('--tg-content-safe-area-inset-left', `${webApp.contentSafeAreaInset.left}px`);
          document.documentElement.style.setProperty('--tg-content-safe-area-inset-right', `${webApp.contentSafeAreaInset.right}px`);
        }
      };
      updateSafeAreas();
      webApp.onEvent?.('contentSafeAreaChanged', updateSafeAreas);
      webApp.onEvent?.('safeAreaChanged', updateSafeAreas);

      return () => {
        webApp.offEvent?.('themeChanged', onThemeChanged);
        webApp.offEvent?.('contentSafeAreaChanged', updateSafeAreas);
        webApp.offEvent?.('safeAreaChanged', updateSafeAreas);
      };
    } else {
      // Dev mode fallback
      setUser({
        id: 10842099,
        first_name: 'Коллекционер',
        username: 'domain_master'
      });
    }
  }, []);

  const impactOccurred = useCallback((style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
    } catch (e) {}
  }, []);

  const notificationOccurred = useCallback((type: 'error' | 'success' | 'warning' = 'success') => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
    } catch (e) {}
  }, []);

  const selectionChanged = useCallback(() => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
    } catch (e) {}
  }, []);

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (window.Telegram?.WebApp?.MainButton) {
      const mb = window.Telegram.WebApp.MainButton;
      mb.setText(text);
      mb.show();
      mb.enable();
      mb.onClick(onClick);
    }
  }, []);

  const hideMainButton = useCallback(() => {
    if (window.Telegram?.WebApp?.MainButton) {
      window.Telegram.WebApp.MainButton.hide();
    }
  }, []);

  const showBackButton = useCallback((onClick: () => void) => {
    if (window.Telegram?.WebApp?.BackButton) {
      const bb = window.Telegram.WebApp.BackButton;
      bb.show();
      bb.onClick(onClick);
    }
  }, []);

  const hideBackButton = useCallback(() => {
    if (window.Telegram?.WebApp?.BackButton) {
      window.Telegram.WebApp.BackButton.hide();
    }
  }, []);

  return {
    tg,
    user,
    colorScheme,
    initData: window.Telegram?.WebApp?.initData || '',
    impactOccurred,
    notificationOccurred,
    selectionChanged,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton
  };
}
