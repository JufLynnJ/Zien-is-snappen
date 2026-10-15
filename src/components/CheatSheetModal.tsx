import React from 'react';
import { X, HelpCircle, CheckCircle2, Volume2 } from 'lucide-react';
import { CATEGORY_LIST } from '../data/categories';
import { speakDutch } from '../utils/audio';

interface CheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Sluiten"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 id="modal-title" className="text-2xl font-black text-slate-800 tracking-tight">
              Spiekbriefje: Zien is snappen!
            </h2>
            <p className="text-sm font-medium text-slate-600">
              Elke kleur heeft een eigen vraag en betekenis in de zin
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {CATEGORY_LIST.map((cat) => (
            <div
              key={cat.id}
              className={`p-4 rounded-2xl border-2 transition-all ${cat.bgClass} ${cat.borderClass} shadow-sm`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: cat.accentHex }}
                  />
                  <span className="font-black text-lg text-slate-900">
                    {cat.questionLabel}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 shadow-xs border border-slate-200 text-slate-700">
                    {cat.colorName}
                  </span>
                </div>
                <button
                  onClick={() => speakDutch(`${cat.questionLabel}. ${cat.subtitle}. ${cat.example}`)}
                  className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
                  title="Luister uitleg"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-bold text-slate-700 mb-1">
                Grammatica: <span className="font-normal text-slate-800">{cat.grammaticalLabel}</span>
              </div>

              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                {cat.explanation}
              </p>

              <div className="text-xs bg-white/70 rounded-xl p-2 border border-slate-200/60 font-medium text-slate-800">
                <span className="text-slate-500 font-bold">Voorbeeld: </span>
                {cat.example}
              </div>
            </div>
          ))}
        </div>

        {/* Tip section */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-amber-900 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm font-medium">
            <p className="font-bold mb-1">Gouden regel voor zinsontleding:</p>
            Zoek altijd eerst de persoonsvorm (rood - wat doen ze of wat gebeurt er?). Vraag daarna: <em>Wie doet het?</em> (geel). Vraag daarna: <em>Wat?</em> (bruin), <em>Waar?</em> (paars), <em>Wanneer?</em> (oranje) en <em>Hoe?</em> (groen)!
          </div>
        </div>

        {/* Close action */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold shadow-md transition-all cursor-pointer"
          >
            Ik snap het! Laten we oefenen
          </button>
        </div>
      </div>
    </div>
  );
};
