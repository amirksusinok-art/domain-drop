import React from 'react';
import { UserProfile } from '../types/domain';

interface HeaderProps {
  profile: UserProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  soundEnabled,
  onToggleSound,
  onOpenSettings
}) => {
  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <header className="sticky top-0 z-30 px-4 py-3 bg-app-surface/90 backdrop-blur-md border-b border-app-border">
      <div className="flex items-center justify-between gap-3">
        {/* User Badge & XP */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm ring-1 ring-white/10">
              {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : 'D'}
            </div>
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.2 bg-app-bg text-[10px] font-mono font-bold text-sky-400 rounded-md border border-app-border">
              L{profile.level}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs tracking-tight text-app-text truncate">
                {profile.firstName}
              </span>
              <span className="text-[10px] font-mono text-app-muted">
                @{profile.username}
              </span>
            </div>

            {/* XP Bar */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-20 sm:w-28 h-1.5 bg-app-bg rounded-full overflow-hidden border border-app-border/60">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all duration-300 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-app-muted">
                {profile.xp}/{profile.xpToNextLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Quick Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* BC Coins Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-app-surface-subtle border border-app-border text-app-text font-mono text-xs shadow-inner">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-[10px] font-bold text-black shadow-sm">
              ₿
            </div>
            <span className="font-bold text-amber-300 tracking-tight">
              {profile.coins.toLocaleString()}
            </span>
            <span className="text-[10px] text-app-muted font-sans font-semibold">
              BC
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Звук включен' : 'Звук выключен'}
            className="w-8 h-8 rounded-xl bg-app-surface-subtle border border-app-border flex items-center justify-center text-app-muted hover:text-app-text active:scale-95 transition-all text-xs"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
    </header>
  );
};
