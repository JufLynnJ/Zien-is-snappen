import React from 'react';
import { Sparkles, ArrowRight, RotateCcw, Smile, Award } from 'lucide-react';

interface FeedbackBannerProps {
  status: 'idle' | 'correct' | 'incorrect';
  message: string;
  scoreGained: number;
  returnedPartsCount: number;
  onNext: () => void;
  isLastSentence: boolean;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  status,
  message,
  scoreGained,
  returnedPartsCount,
  onNext,
  isLastSentence,
}) => {
  if (status === 'idle') return null;

  if (status === 'correct') {
    return (
      <div className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white rounded-3xl p-5 md:p-6 shadow-xl border-3 border-emerald-300 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            {/* Animated Happy Smiley */}
            <div className="relative w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center text-4xl shadow-md shrink-0 animate-bounce">
              <span>😄</span>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-black shadow-xs">
                +10
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-xl md:text-2xl font-black tracking-tight">
                  Helemaal juist!
                </span>
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300 animate-spin" />
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                {message || 'Super knap! Alle zinsdelen staan in de juiste kleur.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 active:scale-95 text-emerald-800 font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-2 border-emerald-200"
            >
              <span>{isLastSentence ? 'Bekijk eindresultaat' : 'Volgende zin'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Incorrect state
  return (
    <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-5 md:p-6 shadow-xl border-3 border-amber-300 animate-in shake duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          {/* Friendly encouragement face */}
          <div className="w-16 h-16 rounded-full bg-white text-amber-600 flex items-center justify-center text-4xl shadow-md shrink-0">
            <span>🤔</span>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xl md:text-2xl font-black tracking-tight">
                Probeer het nog eens!
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 font-medium">
              {returnedPartsCount === 1
                ? 'Er stond 1 zinsdeel in de verkeerde kleur. Die is terug onderaan geplaatst.'
                : `Er stonden ${returnedPartsCount} zinsdelen in de verkeerde kleur. Die zijn terug onderaan geplaatst.`}
              <br className="hidden sm:inline" />
              <span className="text-white font-bold underline decoration-white/60">
                {' '}De juiste zinsdelen blijven netjes staan!
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-xs text-white">
          <RotateCcw className="w-4 h-4 animate-spin" />
          <span>Kijk goed naar de vraagwoorden!</span>
        </div>
      </div>
    </div>
  );
};
