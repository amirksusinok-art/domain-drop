import React from 'react';
import { UserProfile } from '../types/domain';
import { Coins, Volume2, VolumeX, Smartphone, Award } from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onHaptic?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
  onHaptic
}) => {
  const xpPercentage = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <header className="sticky top-0 z-30 bg-[#0b0e14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 max-w-md mx-auto">
      <div className="flex items-center justify-between gap-3">
        {/* User & Level */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              {profile.firstName?.[0] || 'D'}
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-mono font-bold text-[9px] px-1 rounded-full border border-slate-900">
              L{profile.level}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-100 truncate max-w-[110px]">
                {profile.firstName || profile.username || 'Коллекционер'}
              </span>
            </div>
            {/* XP mini bar */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-400">
                {profile.xp}/{profile.xpToNextLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Currency & Quick Settings */}
        <div className="flex items-center gap-2">
          {/* DC Coins balance */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-amber-400/30 px-2.5 py-1.5 rounded-xl shadow-[0_0_10px_rgba(245,158,11,0.15)]">
            <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center font-bold text-[9px] text-slate-950">
              Ð
            </div>
            <span className="font-mono font-bold text-xs text-amber-300">
              {profile.coins}
            </span>
            <span className="text-[10px] text-amber-400/70 font-mono">DC</span>
          </div>

          {/* Quick Sound Toggle */}
          <button
            onClick={() => {
              onHaptic?.();
              onToggleSound();
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white"
            title="Звук"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
