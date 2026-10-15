import React from 'react';
import { X, Settings as SettingsIcon, Volume2, Eye, Type, RotateCcw } from 'lucide-react';
import { DisplayMode } from '../types';
import { soundEffects } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  isDyslexicFont: boolean;
  setIsDyslexicFont: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  totalSentences: number;
  currentSentenceIdx: number;
  onJumpToSentence: (idx: number) => void;
  onResetSession: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  displayMode,
  setDisplayMode,
  speechRate,
  setSpeechRate,
  isDyslexicFont,
  setIsDyslexicFont,
  soundEnabled,
  setSoundEnabled,
  totalSentences,
  currentSentenceIdx,
  onJumpToSentence,
  onResetSession,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
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
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-inner">
            <SettingsIcon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Instellingen</h2>
            <p className="text-sm font-medium text-slate-600">
              Pas de weergave en het geluid aan voor jouw klas of leerling
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Weergave Modus */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-sm">
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>Tekst op de kleurenbakken</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDisplayMode('both')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                  displayMode === 'both'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Vraag + Grammatica (Aanbevolen)
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('questions')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                  displayMode === 'questions'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Alleen Vragen (Wie?, Wat?...)
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('grammatical')}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                  displayMode === 'grammatical'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Alleen Grammatica (Onderwerp...)
              </button>
            </div>
          </div>

          {/* Dyslexia / Toegankelijk Lettertype */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">Ruime letterafstand (Dyslexie-vriendelijk)</div>
                <div className="text-xs text-slate-500">Grotere letters en extra tussenruimte voor makkelijker lezen</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDyslexicFont}
                onChange={(e) => setIsDyslexicFont(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Sound & Speech */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Geluidseffecten</div>
                  <div className="text-xs text-slate-500">Beloningsbelletje en feedbackgeluidjes</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => {
                    setSoundEnabled(e.target.checked);
                    soundEffects.enabled = e.target.checked;
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Voorleessnelheid</span>
                <span>{speechRate === 0.8 ? 'Rustig (0.8x)' : speechRate === 1.0 ? 'Normaal (1.0x)' : `${speechRate}x`}</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Zeer rustig</span>
                <span>Normaal</span>
                <span>Vlot</span>
              </div>
            </div>
          </div>

          {/* Klas & Leraar besturing (Snel springen) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700 mb-2">
              Voor de leerkracht: Spring naar zin (1 - {totalSentences})
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
              {Array.from({ length: totalSentences }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onJumpToSentence(i);
                    onClose();
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentSentenceIdx === i
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="mt-3 flex justify-between items-center pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Wil je alle score en voortgang opnieuw beginnen?')) {
                    onResetSession();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 text-xs text-rose-600 font-bold hover:text-rose-700 p-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Score & Oefening resetten
              </button>
            </div>
          </div>
        </div>

        {/* Sluitknop */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Klaar
          </button>
        </div>
      </div>
    </div>
  );
};
