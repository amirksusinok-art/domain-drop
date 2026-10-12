import React, { useState } from 'react';
import { ScannerTask, DomainItem, UserProfile } from '../types/domain';
import { Compass, Sparkles, CheckCircle2, XCircle, HelpCircle, ArrowRight, Radio, Search } from 'lucide-react';

interface ScannerViewProps {
  tasks: ScannerTask[];
  profile: UserProfile;
  onSolveTask: (taskId: string, chosenIndex: number) => void;
  onQuickRadarScan: () => void;
  onHaptic?: (type: 'light' | 'medium' | 'heavy') => void;
  onPlaySound?: (type: 'click' | 'correct' | 'wrong') => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  tasks,
  profile,
  onSolveTask,
  onQuickRadarScan,
  onHaptic,
  onPlaySound
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [chosenOption, setChosenOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);

  const activeTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  const handleSelectOption = (index: number) => {
    onPlaySound?.('click');
    onHaptic?.('light');
    setChosenOption(index);
    setFeedback('idle');
  };

  const handleSubmit = () => {
    if (chosenOption === null || !activeTask) return;

    if (chosenOption === activeTask.correctIndex) {
      setFeedback('correct');
      onPlaySound?.('correct');
      onHaptic?.('heavy');
      setTimeout(() => {
        onSolveTask(activeTask.id, chosenOption);
        setChosenOption(null);
        setFeedback('idle');
        setShowHint(false);
      }, 700);
    } else {
      setFeedback('wrong');
      onPlaySound?.('wrong');
      onHaptic?.('medium');
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/30">
        <div className="flex items-center gap-2 mb-1">
          <Compass className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">
            Domain Scanner
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Интеллектуальные задания на исследование комбинаций, симметрии и редких последовательностей имён.
        </p>
      </div>

      {/* Task Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tasks.map((task, idx) => {
          const isCurrent = task.id === selectedTaskId;
          return (
            <button
              key={task.id}
              onClick={() => {
                onPlaySound?.('click');
                onHaptic?.('light');
                setSelectedTaskId(task.id);
                setChosenOption(null);
                setFeedback('idle');
                setShowHint(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
                isCurrent
                  ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              №{idx + 1} {task.title}
            </button>
          );
        })}
      </div>

      {/* Active Challenge Card */}
      {activeTask && (
        <div className="rounded-3xl p-5 bg-gradient-to-b from-[#151d2d] to-[#0f141f] border border-slate-700/80 shadow-xl relative overflow-hidden">
          {/* Difficulty & reward badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-cyan-900/60 text-cyan-300 border border-cyan-700/40">
                {activeTask.difficulty}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Тип: {activeTask.type}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                +{activeTask.rewardCoins} DC
              </span>
              <span className="text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-bold">
                +{activeTask.rewardXp} XP
              </span>
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-100 font-sans">
            {activeTask.title}
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            {activeTask.description}
          </p>

          {/* Options List */}
          <div className="mt-4 space-y-2">
            {activeTask.options.map((opt, idx) => {
              const isSelected = chosenOption === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-3.5 rounded-xl border font-mono text-sm cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)] scale-[1.01]'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-bold tracking-wider">{opt}</span>
                  </div>
                  {isSelected && (
                    <Radio className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Feedback & Hint Row */}
          {feedback === 'wrong' && (
            <div className="mt-3 p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Неверно! Попробуйте другой вариант или посмотрите подсказку.</span>
            </div>
          )}

          {feedback === 'correct' && (
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Верно! Инициализация синтеза предмета...</span>
            </div>
          )}

          {showHint && (
            <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{activeTask.hint}</span>
            </div>
          )}

          {/* Actions Button */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => {
                onPlaySound?.('click');
                onHaptic?.('light');
                setShowHint(!showHint);
              }}
              className="px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium"
              title="Подсказка"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={handleSubmit}
              disabled={chosenOption === null || feedback === 'correct'}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                chosenOption !== null && feedback !== 'correct'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Подтвердить решение</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Deep Radar Scan */}
      <div className="rounded-2xl p-4 bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">Глубокое сканирование</h4>
            <p className="text-[11px] text-slate-400">
              Поиск свободного доменного узора (15 DC)
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            onPlaySound?.('click');
            onHaptic?.('medium');
            onQuickRadarScan();
          }}
          disabled={profile.coins < 15}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            profile.coins >= 15
              ? 'bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-600/50 active:scale-95'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          Сканировать
        </button>
      </div>
    </div>
  );
};
