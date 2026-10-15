import React, { useState } from 'react';
import { X, Sparkles, Volume2, Plus, Trash2, Play, CheckCircle2, Shuffle } from 'lucide-react';
import { CategoryId, SentenceData, SentencePart } from '../types';
import { CATEGORY_LIST, CATEGORIES } from '../data/categories';
import { speakDutch } from '../utils/audio';

interface SentenceBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayCustomSentence: (sentence: SentenceData) => void;
}

const PRESET_EXAMPLES = [
  'De astronaut vliegt met een raket naar de maan.',
  'Mijn zusje zingt vanavond een mooi liedje in het theater.',
  'De grote beer vist behendig naar zalm in de wilde rivier.',
  'Elke zondag bakt opa verse wafels in de keuken.',
];

export const SentenceBuilderModal: React.FC<SentenceBuilderModalProps> = ({
  isOpen,
  onClose,
  onPlayCustomSentence,
}) => {
  const [inputText, setInputText] = useState('De astronaut vliegt met een raket naar de maan.');
  const [parts, setParts] = useState<SentencePart[]>([
    { id: 'custom-1', text: 'De astronaut', category: 'wie' },
    { id: 'custom-2', text: 'vliegt', category: 'doet' },
    { id: 'custom-3', text: 'met een raket', category: 'hoe' },
    { id: 'custom-4', text: 'naar de maan', category: 'waar' },
  ]);

  if (!isOpen) return null;

  const handleAddPart = () => {
    const newId = `custom-${Date.now()}`;
    setParts([...parts, { id: newId, text: 'nieuw zinsdeel', category: 'wie' }]);
  };

  const handleRemovePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  const handleUpdatePartText = (id: string, text: string) => {
    setParts(parts.map((p) => (p.id === id ? { ...p, text } : p)));
  };

  const handleUpdatePartCategory = (id: string, category: CategoryId) => {
    setParts(parts.map((p) => (p.id === id ? { ...p, category } : p)));
  };

  const handleApplyPreset = () => {
    const randomPreset = PRESET_EXAMPLES[Math.floor(Math.random() * PRESET_EXAMPLES.length)];
    setInputText(randomPreset);
    if (randomPreset.includes('astronaut')) {
      setParts([
        { id: 'c-1', text: 'De astronaut', category: 'wie' },
        { id: 'c-2', text: 'vliegt', category: 'doet' },
        { id: 'c-3', text: 'met een raket', category: 'hoe' },
        { id: 'c-4', text: 'naar de maan', category: 'waar' },
      ]);
    } else if (randomPreset.includes('zusje')) {
      setParts([
        { id: 'c-1', text: 'Mijn zusje', category: 'wie' },
        { id: 'c-2', text: 'zingt', category: 'doet' },
        { id: 'c-3', text: 'vanavond', category: 'wanneer' },
        { id: 'c-4', text: 'een mooi liedje', category: 'wat' },
        { id: 'c-5', text: 'in het theater', category: 'waar' },
      ]);
    } else if (randomPreset.includes('beer')) {
      setParts([
        { id: 'c-1', text: 'De grote beer', category: 'wat' },
        { id: 'c-2', text: 'vist', category: 'doet' },
        { id: 'c-3', text: 'behendig', category: 'hoe' },
        { id: 'c-4', text: 'naar zalm', category: 'wat' },
        { id: 'c-5', text: 'in de wilde rivier', category: 'waar' },
      ]);
    } else {
      setParts([
        { id: 'c-1', text: 'Elke zondag', category: 'wanneer' },
        { id: 'c-2', text: 'bakt', category: 'doet' },
        { id: 'c-3', text: 'opa', category: 'wie' },
        { id: 'c-4', text: 'verse wafels', category: 'wat' },
        { id: 'c-5', text: 'in de keuken', category: 'waar' },
      ]);
    }
  };

  const fullSentenceCalculated = parts.map((p) => p.text).join(' ');

  const handleStartPlaying = () => {
    if (parts.length === 0) return;
    const customSentence: SentenceData = {
      id: 9999,
      fullSentence: fullSentenceCalculated,
      parts,
      level: 'moeilijk',
      tip: 'Deze zin is zelfgemaakt door een creatieve ontleder!',
    };
    onPlayCustomSentence(customSentence);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-purple-300 p-6 md:p-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Sluiten"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Zelf een zin vormen &amp; ontleden
            </h2>
            <p className="text-xs font-semibold text-slate-600">
              Verzin een zin, kies de zinsdelen en test je klasgenoot of leerkracht!
            </p>
          </div>
        </div>

        {/* Example generator */}
        <div className="flex justify-between items-center mb-4 p-3 bg-purple-50 rounded-2xl border border-purple-200">
          <div className="text-xs font-bold text-purple-900">
            Geen inspiratie? Neem een leuk voorbeeld:
          </div>
          <button
            onClick={handleApplyPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Kies voorbeeldzin</span>
          </button>
        </div>

        {/* Sentence Parts Builder List */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500">
            Zinsdelen en hun kleur volgens Zien is snappen:
          </div>

          <div className="space-y-2.5 max-h-[40vh] overflow-y-auto p-1">
            {parts.map((part, index) => {
              const currentCat = CATEGORIES[part.category];
              return (
                <div
                  key={part.id}
                  className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col sm:flex-row items-center gap-2.5"
                >
                  <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>

                  {/* Part text input */}
                  <input
                    type="text"
                    value={part.text}
                    onChange={(e) => handleUpdatePartText(part.id, e.target.value)}
                    placeholder="Woord(en)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-900 focus:outline-indigo-500 w-full"
                  />

                  {/* Category color selector */}
                  <select
                    value={part.category}
                    onChange={(e) => handleUpdatePartCategory(part.id, e.target.value as CategoryId)}
                    className="px-3 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer w-full sm:w-auto"
                    style={{
                      backgroundColor: currentCat.lightHex,
                      borderColor: currentCat.accentHex,
                      color: '#0f172a',
                    }}
                  >
                    {CATEGORY_LIST.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.colorName}: {cat.questionLabel} ({cat.shortGrammar})
                      </option>
                    ))}
                  </select>

                  {/* Remove part button */}
                  {parts.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePart(part.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Verwijder zinsdeel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAddPart}
            className="w-full py-2.5 rounded-2xl border-2 border-dashed border-purple-300 text-purple-700 hover:bg-purple-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Extra zinsdeel toevoegen</span>
          </button>
        </div>

        {/* Live Preview */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider">
              Zo ziet jouw zin eruit:
            </span>
            <button
              onClick={() => speakDutch(fullSentenceCalculated)}
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Luister</span>
            </button>
          </div>
          <div className="text-base sm:text-lg font-black tracking-tight text-white">
            &ldquo;{fullSentenceCalculated}&rdquo;
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
          >
            Annuleren
          </button>

          <button
            onClick={handleStartPlaying}
            disabled={parts.length < 2 || parts.some((p) => !p.text.trim())}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Speel deze zelfgemaakte zin!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
