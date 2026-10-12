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
  const [contentSafeAreaInset, setContentSafeAreaInset] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
  const [safeAreaInset, setSafeAreaInset] = useState({ top: 0, bottom: 0, left: 0, right: 0 });

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

      const applyTheme = () => {
        const scheme = webApp.colorScheme || 'dark';
        setColorScheme(scheme);
        if (scheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        if (webApp.themeParams) {
          const tp = webApp.themeParams;
          if (tp.bg_color) document.documentElement.style.setProperty('--tg-theme-bg-color', tp.bg_color);
          if (tp.text_color) document.documentElement.style.setProperty('--tg-theme-text-color', tp.text_color);
          if (tp.hint_color) document.documentElement.style.setProperty('--tg-theme-hint-color', tp.hint_color);
          if (tp.link_color) document.documentElement.style.setProperty('--tg-theme-link-color', tp.link_color);
          if (tp.button_color) document.documentElement.style.setProperty('--tg-theme-button-color', tp.button_color);
          if (tp.button_text_color) document.documentElement.style.setProperty('--tg-theme-button-text-color', tp.button_text_color);
          if (tp.secondary_bg_color) document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tp.secondary_bg_color);
          if (tp.header_bg_color) document.documentElement.style.setProperty('--tg-theme-header-bg-color', tp.header_bg_color);
          if (tp.accent_text_color) document.documentElement.style.setProperty('--tg-theme-accent-text-color', tp.accent_text_color);
          if (tp.section_bg_color) document.documentElement.style.setProperty('--tg-theme-section-bg-color', tp.section_bg_color);
          if (tp.section_header_text_color) document.documentElement.style.setProperty('--tg-theme-section-header-text-color', tp.section_header_text_color);
          if (tp.subtitle_text_color) document.documentElement.style.setProperty('--tg-theme-subtitle-text-color', tp.subtitle_text_color);
          if (tp.destructive_text_color) document.documentElement.style.setProperty('--tg-theme-destructive-text-color', tp.destructive_text_color);
        }
      };
      applyTheme();
      webApp.onEvent?.('themeChanged', applyTheme);

      const updateSafeAreas = () => {
        if (webApp.contentSafeAreaInset) {
          setContentSafeAreaInset(webApp.contentSafeAreaInset);
          document.documentElement.style.setProperty('--tg-content-safe-area-inset-top', `${webApp.contentSafeAreaInset.top}px`);
          document.documentElement.style.setProperty('--tg-content-safe-area-inset-bottom', `${webApp.contentSafeAreaInset.bottom}px`);
          document.documentElement.style.setProperty('--tg-content-safe-area-inset-left', `${webApp.contentSafeAreaInset.left}px`);
          document.documentElement.style.setProperty('--tg-content-safe-area-inset-right', `${webApp.contentSafeAreaInset.right}px`);
        }
        if (webApp.safeAreaInset) {
          setSafeAreaInset(webApp.safeAreaInset);
          document.documentElement.style.setProperty('--tg-safe-area-inset-top', `${webApp.safeAreaInset.top}px`);
          document.documentElement.style.setProperty('--tg-safe-area-inset-bottom', `${webApp.safeAreaInset.bottom}px`);
          document.documentElement.style.setProperty('--tg-safe-area-inset-left', `${webApp.safeAreaInset.left}px`);
          document.documentElement.style.setProperty('--tg-safe-area-inset-right', `${webApp.safeAreaInset.right}px`);
        }
      };
      updateSafeAreas();
      webApp.onEvent?.('contentSafeAreaChanged', updateSafeAreas);
      webApp.onEvent?.('safeAreaChanged', updateSafeAreas);

      return () => {
        webApp.offEvent?.('themeChanged', applyTheme);
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
    contentSafeAreaInset,
    safeAreaInset,
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
