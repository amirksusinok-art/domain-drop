import React from 'react';
import { DomainItem, Rarity, PatternType } from '../types/domain';
import { Sparkles, Hash, Shield, Layers, Calendar } from 'lucide-react';

interface DomainCardProps {
  item: DomainItem;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const DomainCard: React.FC<DomainCardProps> = ({
  item,
  onClick,
  size = 'md',
  animated = true
}) => {
  const getRarityConfig = (rarity: Rarity) => {
    switch (rarity) {
      case 'Secret':
        return {
          border: 'border-rose-500/80 shadow-[0_0_20px_rgba(244,63,94,0.3)]',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          accent: '#f43f5e',
          accentGradient: 'from-rose-500 via-purple-500 to-indigo-500',
          textColor: 'text-rose-100',
          label: 'Secret'
        };
      case 'Legendary':
        return {
          border: 'border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
          badgeBg: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
          accent: '#f59e0b',
          accentGradient: 'from-amber-400 to-orange-500',
          textColor: 'text-amber-100',
          label: 'Legendary'
        };
      case 'Epic':
        return {
          border: 'border-purple-500/70 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          accent: '#a855f7',
          accentGradient: 'from-purple-500 to-indigo-600',
          textColor: 'text-purple-100',
          label: 'Epic'
        };
      case 'Rare':
        return {
          border: 'border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          accent: '#06b6d4',
          accentGradient: 'from-cyan-400 to-blue-600',
          textColor: 'text-cyan-100',
          label: 'Rare'
        };
      case 'Uncommon':
        return {
          border: 'border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.12)]',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          accent: '#10b981',
          accentGradient: 'from-emerald-400 to-teal-600',
          textColor: 'text-emerald-100',
          label: 'Uncommon'
        };
      default:
        return {
          border: 'border-slate-700/80',
          badgeBg: 'bg-slate-800 text-slate-300 border-slate-700',
          accent: '#64748b',
          accentGradient: 'from-slate-600 to-slate-800',
          textColor: 'text-slate-200',
          label: 'Common'
        };
    }
  };

  const config = getRarityConfig(item.rarity);

  // Dynamic font sizing based on length
  const getNameSize = () => {
    if (size === 'sm') {
      return item.length <= 3 ? 'text-lg' : item.length <= 5 ? 'text-sm' : 'text-xs';
    }
    if (size === 'lg') {
      return item.length <= 2 ? 'text-4xl' : item.length <= 4 ? 'text-3xl' : item.length <= 6 ? 'text-2xl' : 'text-xl';
    }
    return item.length <= 2 ? 'text-2xl' : item.length <= 4 ? 'text-xl' : item.length <= 6 ? 'text-lg' : 'text-base';
  };

  // Render procedural SVG geometry based on seed and pattern type
  const renderPattern = () => {
    const seed = item.visualSeed || 42;
    const color = config.accent;

    switch (item.patternType) {
      case 'symmetric':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100">
            <line x1="50" y1="0" x2="50" y2="100" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
            <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke={color} strokeWidth="1.5" />
            <polygon points="50,30 70,50 50,70 30,50" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="50" cy="50" r="12" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="20" cy="50" r="3" fill={color} />
            <circle cx="80" cy="50" r="3" fill={color} />
          </svg>
        );
      case 'circuit':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 100 100">
            <path d="M10,20 L40,20 L55,35 L90,35" fill="none" stroke={color} strokeWidth="1.2" />
            <path d="M10,80 L30,80 L45,65 L90,65" fill="none" stroke={color} strokeWidth="1.2" />
            <circle cx="40" cy="20" r="2.5" fill={color} />
            <circle cx="90" cy="35" r="2.5" fill={color} />
            <circle cx="30" cy="80" r="2.5" fill={color} />
            <circle cx="90" cy="65" r="2.5" fill={color} />
          </svg>
        );
      case 'matrix':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100">
            <rect x="15" y="15" width="20" height="20" fill="none" stroke={color} strokeWidth="1" />
            <rect x="65" y="15" width="20" height="20" fill="none" stroke={color} strokeWidth="1" />
            <rect x="15" y="65" width="20" height="20" fill="none" stroke={color} strokeWidth="1" />
            <rect x="65" y="65" width="20" height="20" fill="none" stroke={color} strokeWidth="1" />
            <line x1="35" y1="25" x2="65" y2="25" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" />
            <line x1="35" y1="75" x2="65" y2="75" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" />
          </svg>
        );
      case 'constellation':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="25" cy="30" r="2.5" fill={color} />
            <circle cx="75" cy="25" r="3" fill={color} />
            <circle cx="80" cy="70" r="2" fill={color} />
            <circle cx="30" cy="75" r="2.5" fill={color} />
            <line x1="25" y1="30" x2="75" y2="25" stroke={color} strokeWidth="0.8" />
            <line x1="75" y1="25" x2="80" y2="70" stroke={color} strokeWidth="0.8" />
            <line x1="80" y1="70" x2="30" y2="75" stroke={color} strokeWidth="0.8" />
          </svg>
        );
      default:
        return (
          <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="35" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="20" fill="none" stroke={color} strokeWidth="1" />
          </svg>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#161c28] to-[#0d121c] border transition-all duration-200 cursor-pointer ${
        config.border
      } ${
        onClick ? 'active:scale-[0.98] hover:border-opacity-100 hover:-translate-y-0.5' : ''
      } ${size === 'sm' ? 'p-3' : size === 'lg' ? 'p-6' : 'p-4'}`}
    >
      {/* Procedural Pattern Overlay */}
      {renderPattern()}

      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/60">
            {item.zone}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {item.length}C
          </span>
        </div>

        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-sm ${config.badgeBg}`}
        >
          {config.label}
        </span>
      </div>

      {/* Center Name Typography Showcase */}
      <div className="relative z-10 my-3 flex flex-col items-center justify-center text-center">
        <h3
          className={`font-mono font-bold tracking-wider ${getNameSize()} ${
            config.textColor
          } drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}
        >
          {item.name}
        </h3>
        <p className="text-[11px] font-mono text-slate-400 mt-1">
          {item.name} / {item.zone}
        </p>
      </div>

      {/* Bottom Metadata Info */}
      <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <div className="flex items-center gap-1">
          <Hash className="w-3 h-3 text-slate-500" />
          <span>{item.instanceId}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-500 truncate max-w-[90px]">
            {item.categories[0] || 'Rare Words'}
          </span>
        </div>
      </div>
    </div>
  );
};
