import React from 'react';
import { DomainItem, Rarity } from '../types/domain';

interface DomainCardProps {
  item: DomainItem;
  onClick?: () => void;
  selected?: boolean;
  selectable?: boolean;
  compact?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showRecycleValue?: boolean;
}

const RARITY_THEMES: Record<Rarity, {
  border: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
  zoneColor: string;
}> = {
  Common: {
    border: 'border-slate-700/60 hover:border-slate-600',
    badgeBg: 'bg-slate-800 text-slate-300',
    badgeText: 'text-slate-300',
    accent: '#94a3b8',
    zoneColor: 'bg-slate-800/80 text-slate-300'
  },
  Uncommon: {
    border: 'border-emerald-600/40 hover:border-emerald-500/60',
    badgeBg: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40',
    badgeText: 'text-emerald-400',
    accent: '#10b981',
    zoneColor: 'bg-emerald-950/60 text-emerald-300'
  },
  Rare: {
    border: 'border-blue-600/40 hover:border-blue-500/60',
    badgeBg: 'bg-blue-950/80 text-blue-400 border border-blue-800/40',
    badgeText: 'text-blue-400',
    accent: '#3b82f6',
    zoneColor: 'bg-blue-950/60 text-blue-300'
  },
  Epic: {
    border: 'border-purple-600/40 hover:border-purple-500/60',
    badgeBg: 'bg-purple-950/80 text-purple-300 border border-purple-800/40',
    badgeText: 'text-purple-300',
    accent: '#a855f7',
    zoneColor: 'bg-purple-950/60 text-purple-300'
  },
  Legendary: {
    border: 'border-amber-500/50 hover:border-amber-400/70',
    badgeBg: 'bg-amber-950/80 text-amber-300 border border-amber-800/40',
    badgeText: 'text-amber-300',
    accent: '#f59e0b',
    zoneColor: 'bg-amber-950/60 text-amber-200'
  },
  Secret: {
    border: 'border-rose-500/50 hover:border-rose-400/80',
    badgeBg: 'bg-rose-950/80 text-rose-300 border border-rose-800/40',
    badgeText: 'text-rose-300',
    accent: '#f43f5e',
    zoneColor: 'bg-rose-950/60 text-rose-200'
  }
};

export const DomainCard: React.FC<DomainCardProps> = ({
  item,
  onClick,
  selected,
  selectable,
  compact,
  showRecycleValue
}) => {
  const theme = RARITY_THEMES[item.rarity] || RARITY_THEMES.Common;
  const isUnique = item.isUnique;

  // Procedural SVG pattern based on visual seed
  const renderPattern = () => {
    const seed = item.visualSeed || 42;
    const color = theme.accent;

    if (item.patternType === 'symmetric') {
      return (
        <svg className="w-full h-full opacity-20" viewBox="0 0 100 60">
          <line x1="50" y1="0" x2="50" y2="60" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
          <polygon points="50,15 75,30 50,45 25,30" fill="none" stroke={color} strokeWidth="1.2" />
          <circle cx="25" cy="30" r="3" fill={color} />
          <circle cx="75" cy="30" r="3" fill={color} />
          <line x1="10" y1="30" x2="90" y2="30" stroke={color} strokeWidth="0.8" />
        </svg>
      );
    }

    if (item.patternType === 'circuit') {
      return (
        <svg className="w-full h-full opacity-20" viewBox="0 0 100 60">
          <path d="M 10,20 L 35,20 L 50,40 L 90,40" fill="none" stroke={color} strokeWidth="1.2" />
          <circle cx="10" cy="20" r="2.5" fill={color} />
          <circle cx="90" cy="40" r="2.5" fill={color} />
          <path d="M 20,45 L 45,45 L 60,15 L 85,15" fill="none" stroke={color} strokeWidth="0.8" />
        </svg>
      );
    }

    if (item.patternType === 'matrix') {
      return (
        <svg className="w-full h-full opacity-15" viewBox="0 0 100 60">
          <text x="15" y="20" fill={color} fontSize="8" fontFamily="monospace">0 1 0 1</text>
          <text x="35" y="35" fill={color} fontSize="8" fontFamily="monospace">1 0 1 0</text>
          <text x="20" y="50" fill={color} fontSize="8" fontFamily="monospace">0 0 1 1</text>
        </svg>
      );
    }

    // Default minimal geometric
    return (
      <svg className="w-full h-full opacity-20" viewBox="0 0 100 60">
        <circle cx="50" cy="30" r="18" fill="none" stroke={color} strokeWidth="1" />
        <rect x="36" y="16" width="28" height="28" fill="none" stroke={color} strokeWidth="0.8" />
        <line x1="20" y1="30" x2="80" y2="30" stroke={color} strokeWidth="0.8" />
      </svg>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl p-3.5 transition-all duration-200 cursor-pointer overflow-hidden border ${
        theme.border
      } ${
        selected ? 'ring-2 ring-sky-400 bg-app-surface scale-[1.02]' : 'bg-app-surface hover:bg-app-surface-subtle'
      } ${isUnique ? 'unique-foil' : ''}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {renderPattern()}
      </div>

      {/* Unique Tag or Selection checkbox */}
      <div className="relative flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5">
          {selectable && (
            <div
              className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                selected ? 'bg-sky-500 border-sky-400 text-white' : 'border-app-border bg-app-bg'
              }`}
            >
              {selected && '✓'}
            </div>
          )}

          {isUnique ? (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm flex items-center gap-1">
              ★ UNIQUE #1/1
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold uppercase ${theme.badgeBg}`}>
              {item.rarity}
            </span>
          )}
        </div>

        {/* Length badge */}
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-app-bg/80 text-app-muted border border-app-border/40">
          {item.length}C
        </span>
      </div>

      {/* Domain Name & Zone Banner */}
      <div className="relative py-2.5 text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-app-text font-mono uppercase group-hover:scale-105 transition-transform">
            {item.name}
          </span>
          <span className={`text-xs sm:text-sm font-mono font-bold px-1.5 py-0.5 rounded-md ${theme.zoneColor}`}>
            .{item.zone}
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative mt-2 pt-2 border-t border-app-border/50 flex items-center justify-between text-[10px] font-mono text-app-muted">
        <span>#{item.instanceId}</span>
        {showRecycleValue ? (
          <span className="text-amber-400 font-bold">
            +{item.recycleValueBC || 5} BC
          </span>
        ) : (
          <span className="truncate max-w-[80px]">
            {item.categories?.[0] || 'Domain'}
          </span>
        )}
      </div>
    </div>
  );
};
