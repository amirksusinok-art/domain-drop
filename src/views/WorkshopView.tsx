import React, { useState } from 'react';
import { CraftRecipe, DomainItem, UserProfile } from '../types/domain';
import { Wrench, Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface WorkshopViewProps {
  recipes: CraftRecipe[];
  profile: UserProfile;
  onCraft: (recipeId: string, itemIds: string[]) => void;
  onHaptic?: (type: 'light' | 'medium' | 'heavy') => void;
  onPlaySound?: (type: 'click' | 'claim') => void;
}

export const WorkshopView: React.FC<WorkshopViewProps> = ({
  recipes,
  profile,
  onCraft,
  onHaptic,
  onPlaySound
}) => {
  const [activeRecipeId, setActiveRecipeId] = useState<string>(recipes[0]?.id || '');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const activeRecipe = recipes.find((r) => r.id === activeRecipeId) || recipes[0];

  // Eligible items for the recipe
  const eligibleItems = profile.items.filter((item) => {
    if (!activeRecipe) return false;
    const crit = activeRecipe.inputCriteria;
    if (crit.category && !item.categories.includes(crit.category)) return false;
    if (crit.rarity && item.rarity !== crit.rarity) return false;
    return true;
  });

  const toggleItemSelection = (id: string) => {
    onPlaySound?.('click');
    onHaptic?.('light');
    setSelectedItemIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (activeRecipe && prev.length >= activeRecipe.inputCriteria.count) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleExecuteCraft = () => {
    if (!activeRecipe) return;
    if (selectedItemIds.length !== activeRecipe.inputCriteria.count) return;
    if (profile.coins < activeRecipe.costCoins) return;

    onPlaySound?.('claim');
    onHaptic?.('heavy');
    onCraft(activeRecipe.id, selectedItemIds);
    setSelectedItemIds([]);
  };

  const canCraft =
    activeRecipe &&
    selectedItemIds.length === activeRecipe.inputCriteria.count &&
    profile.coins >= activeRecipe.costCoins;

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Workshop Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
            Domain Workshop
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Детерминированная мастерская: объединяйте дубликаты и создавайте предметы высшей редкости с известным результатом.
        </p>
      </div>

      {/* Recipe Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {recipes.map((recipe) => {
          const isSelected = recipe.id === activeRecipeId;
          return (
            <button
              key={recipe.id}
              onClick={() => {
                onPlaySound?.('click');
                onHaptic?.('light');
                setActiveRecipeId(recipe.id);
                setSelectedItemIds([]);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-purple-500/20 border-purple-400/60 text-purple-300 font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {recipe.title}
            </button>
          );
        })}
      </div>

      {/* Active Recipe Configuration */}
      {activeRecipe && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold uppercase">
                {activeRecipe.title}
              </span>
              <span className="text-amber-400 font-bold">
                Стоимость: {activeRecipe.costCoins} DC
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {activeRecipe.description}
            </p>
          </div>

          {/* Outcome Guaranteed Box */}
          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1 text-purple-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Гарантированный результат:
              </span>
              <span className="text-amber-300 font-bold">{activeRecipe.outputPreview.rarity}</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Зона: <span className="text-slate-200 font-semibold">{activeRecipe.outputPreview.zone}</span> | 
              Категория: <span className="text-slate-200 font-semibold">{activeRecipe.outputPreview.category}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Возможные имена: {activeRecipe.outputPreview.possibleNames.join(', ')}
            </div>
          </div>

          {/* Input Slot Selection */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-slate-300 font-medium">
                Выберите ингредиенты ({selectedItemIds.length}/{activeRecipe.inputCriteria.count}):
              </span>
              <span className="text-slate-500 text-[10px]">
                {activeRecipe.inputCriteria.description}
              </span>
            </div>

            {eligibleItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-none">
                {eligibleItems.map((item) => {
                  const isPicked = selectedItemIds.includes(item.instanceId);
                  return (
                    <div
                      key={item.instanceId}
                      onClick={() => toggleItemSelection(item.instanceId)}
                      className={`p-2 rounded-xl border text-center font-mono cursor-pointer transition-all ${
                        isPicked
                          ? 'bg-purple-500/30 border-purple-400 text-purple-200 shadow-sm scale-105'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs truncate">{item.name}</div>
                      <div className="text-[9px] text-slate-500">{item.instanceId}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                Нет доступных предметов для этого рецепта. Соберите их в Domain Scanner!
              </div>
            )}
          </div>

          {/* Craft Execute Button */}
          <button
            onClick={handleExecuteCraft}
            disabled={!canCraft}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              canCraft
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Создать предмет ({activeRecipe.costCoins} DC)</span>
          </button>
        </div>
      )}
    </div>
  );
};
