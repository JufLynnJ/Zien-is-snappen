import React from 'react';
import { BookOpen, Settings, Trophy, Sparkles, Smile, Star, Flame } from 'lucide-react';
import { DisplayMode } from '../types';

interface HeaderProps {
  score: number;
  streak: number;
  currentSentenceNumber: number;
  totalSentences: number;
  onOpenCheatSheet: () => void;
  onOpenSettings: () => void;
  onOpenSentenceBuilder?: () => void;
  modeName: string;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  streak,
  currentSentenceNumber,
  totalSentences,
  onOpenCheatSheet,
  onOpenSettings,
  onOpenSentenceBuilder,
  modeName,
}) => {
  const progressPercent = Math.min(100, Math.round(((currentSentenceNumber - 1) / totalSentences) * 100));

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600 shadow-md shadow-amber-500/20 text-white font-black text-xl select-none">
              Z
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg md:text-xl text-slate-800 tracking-tight leading-none">
                  Zien is snappen
                </h1>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  {modeName}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Zinsontleding in kleur
              </p>
            </div>
          </div>

          {/* Quick buttons on mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenCheatSheet}
              className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
              title="Kleurencodes bekijken"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Instellingen"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Progress Bar */}
        <div className="w-full md:max-w-xs flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1">
              <span>Zin {currentSentenceNumber}</span>
              <span className="text-slate-400 font-normal">van {totalSentences}</span>
            </span>
            <span className="text-indigo-600 font-black">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right side: Score & Badges & Tools */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Streak indicator */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-100 border border-orange-200 text-orange-700 text-xs font-black animate-bounce">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{streak}x op rij!</span>
            </div>
          )}

          {/* Score counter */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-xs">
            <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-white shadow-xs">
              <Star className="w-3.5 h-3.5 fill-white" />
            </div>
            <div className="text-right leading-tight">
              <div className="text-[10px] uppercase font-bold text-amber-700">Score</div>
              <div className="text-base font-black text-amber-900">{score}</div>
            </div>
          </div>

          {/* Desktop utility buttons */}
          <div className="hidden md:flex items-center gap-2">
            {onOpenSentenceBuilder && (
              <button
                onClick={onOpenSentenceBuilder}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                title="Bouw je eigen zin"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Zelf zin maken</span>
              </button>
            )}

            <button
              onClick={onOpenCheatSheet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              title="Kleurencodes en vragenkaart"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Spiekbriefje</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all active:scale-95 cursor-pointer"
              title="Instellingen en opties"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
