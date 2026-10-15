import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Lightbulb, Sparkles, CheckCircle2 } from 'lucide-react';
import { SentencePart } from '../types';
import { CATEGORIES } from '../data/categories';
import { speakDutch, stopSpeaking } from '../utils/audio';

interface SentenceReaderProps {
  sentence: string;
  parts: SentencePart[];
  isCorrect: boolean;
  tip?: string;
  speechRate: number;
}

export const SentenceReader: React.FC<SentenceReaderProps> = ({
  sentence,
  parts,
  isCorrect,
  tip,
  speechRate,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [activePartIndex, setActivePartIndex] = useState<number | null>(null);
  const hasAutoSpokenRef = useRef<boolean>(false);

  // Automatically read aloud and illuminate when the sentence is correct!
  useEffect(() => {
    if (isCorrect && !hasAutoSpokenRef.current) {
      hasAutoSpokenRef.current = true;
      // Slight delay so the success chime plays first, then the voice reads the colored sentence
      const timer = setTimeout(() => {
        readFullSentence();
      }, 650);
      return () => clearTimeout(timer);
    }
    if (!isCorrect) {
      hasAutoSpokenRef.current = false;
      setActivePartIndex(null);
    }
  }, [isCorrect, sentence]);

  // Clean up on unmount or sentence change
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [sentence]);

  const readFullSentence = () => {
    stopSpeaking();
    setIsSpeaking(true);
    setActivePartIndex(0);

    // Calculate start character indices of each part within the sentence
    const partRanges: Array<{ index: number; start: number; end: number }> = [];
    let searchStart = 0;
    parts.forEach((part, idx) => {
      const start = sentence.indexOf(part.text, searchStart);
      if (start !== -1) {
        const end = start + part.text.length;
        partRanges.push({ index: idx, start, end });
        searchStart = end;
      } else {
        partRanges.push({ index: idx, start: 0, end: 0 });
      }
    });

    speakDutch(
      sentence,
      speechRate,
      () => {
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
        setActivePartIndex(null);
      },
      (charIndex: number) => {
        // Find which part contains this charIndex
        const matched = partRanges.find(
          (range) => charIndex >= range.start && charIndex < range.end
        );
        if (matched) {
          setActivePartIndex(matched.index);
        }
      }
    );
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setActivePartIndex(null);
    } else {
      readFullSentence();
    }
  };

  const handleSpeakIndividualPart = (part: SentencePart) => {
    const cat = CATEGORIES[part.category];
    stopSpeaking();
    speakDutch(`${part.text}. ${cat.questionLabel}`, speechRate);
  };

  return (
    <div
      className={`w-full rounded-3xl p-5 md:p-6 border-3 transition-all duration-300 relative overflow-hidden shadow-sm ${
        isCorrect
          ? 'bg-gradient-to-br from-amber-50/60 via-white to-emerald-50/60 border-emerald-400 ring-4 ring-emerald-300/40 shadow-xl'
          : 'bg-white border-slate-200/90'
      }`}
    >
      {/* Decorative top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 via-amber-800 via-purple-600 via-orange-500 to-emerald-500" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Sentence Text Display */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] uppercase font-black tracking-wider text-slate-400">
              De te ontleden zin:
            </span>

            {isCorrect && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black border border-emerald-300 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zinsdelen opgelicht in kleur!</span>
              </span>
            )}
          </div>

          {/* If the sentence is correct, illuminate the words in their Zien is snappen colors! */}
          {isCorrect ? (
            <div className="flex flex-wrap items-center gap-2.5 my-1">
              {parts.map((part, index) => {
                const cat = CATEGORIES[part.category];
                const isActive = activePartIndex === index;

                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => handleSpeakIndividualPart(part)}
                    title={`Klik om te horen: "${part.text}" (${cat.questionLabel})`}
                    className={`relative inline-flex flex-col items-center justify-center px-4 py-2 rounded-2xl border-3 transition-all duration-200 transform cursor-pointer text-left ${
                      cat.bgClass
                    } ${cat.borderClass} ${
                      isActive
                        ? 'scale-110 ring-4 ring-indigo-500/80 shadow-xl z-10 animate-pulse'
                        : 'shadow-md hover:scale-105'
                    }`}
                    style={{
                      boxShadow: isActive
                        ? `0 0 20px ${cat.accentHex}88`
                        : `0 4px 12px ${cat.accentHex}33`,
                    }}
                  >
                    {/* Small category tag on top of the word */}
                    <div className="flex items-center gap-1 mb-0.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat.accentHex }}
                      />
                      <span
                        className="text-[10px] font-black uppercase tracking-wider"
                        style={{ color: cat.accentHex }}
                      >
                        {cat.questionLabel}
                      </span>
                    </div>

                    {/* Word text */}
                    <span className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight select-none">
                      {part.text}
                    </span>

                    {/* Glowing bottom indicator */}
                    <div
                      className="w-full h-1 rounded-full mt-1"
                      style={{ backgroundColor: cat.accentHex }}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            /* Standard plain sentence view before completion */
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-relaxed select-text">
              &ldquo;{sentence}&rdquo;
            </div>
          )}
        </div>

        {/* Read Aloud Button & Tip */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          {tip && !isCorrect && (
            <button
              onClick={() => setShowTip(!showTip)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                showTip
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Toon leertip"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Tip</span>
            </button>
          )}

          <button
            onClick={handleToggleSpeak}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : isCorrect
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 ring-2 ring-emerald-400'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
            }`}
            title={isCorrect ? 'Luister opnieuw naar de ingekleurde zin' : 'Lees de hele zin voor'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span>Stoppen</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>{isCorrect ? 'Herhaal voorlezen' : 'Lees voor'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tip drawer */}
      {showTip && tip && !isCorrect && (
        <div className="mt-4 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs sm:text-sm animate-in slide-in-from-top-2 duration-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="font-medium">{tip}</p>
        </div>
      )}
    </div>
  );
};
