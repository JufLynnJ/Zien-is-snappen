import React from 'react';
import { GripVertical, MousePointerClick, CheckCircle, RotateCcw } from 'lucide-react';
import { SentencePart } from '../types';
import { soundEffects } from '../utils/audio';

interface SentenceTrayProps {
  unassignedParts: SentencePart[];
  selectedPartId: string | null;
  onSelectPart: (partId: string | null) => void;
  onCheckAnswer: () => void;
  onResetPlacements: () => void;
  allAssigned: boolean;
  isChecking: boolean;
  hasErrors: boolean;
}

export const SentenceTray: React.FC<SentenceTrayProps> = ({
  unassignedParts,
  selectedPartId,
  onSelectPart,
  onCheckAnswer,
  onResetPlacements,
  allAssigned,
  isChecking,
  hasErrors,
}) => {
  const handlePartClick = (partId: string) => {
    soundEffects.playPop();
    if (selectedPartId === partId) {
      onSelectPart(null);
    } else {
      onSelectPart(partId);
    }
  };

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl p-5 md:p-6 shadow-xl border-2 border-slate-800 transition-all">
      {/* Header of the tray */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="text-base font-black tracking-tight text-white">
              Zinsdelen om te plaatsen:
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sleep naar een kleur, of <span className="text-amber-300 font-bold">klik eerst op een zinsdeel</span> en dan op een vak.
          </p>
        </div>

        {/* Action button: Reset current attempt if needed */}
        {!allAssigned && unassignedParts.length < 4 && (
          <button
            type="button"
            onClick={onResetPlacements}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer self-start sm:self-center"
            title="Zet alle niet-vastgezette delen terug"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Opnieuw ordenen</span>
          </button>
        )}
      </div>

      {/* Parts chips */}
      <div className="flex flex-wrap items-center gap-3 min-h-[56px] mb-5">
        {unassignedParts.length === 0 ? (
          <div className="w-full py-2.5 text-center text-sm font-bold text-emerald-400 flex items-center justify-center gap-2 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Alle zinsdelen zijn geplaatst! Klik nu op &ldquo;Controleer&rdquo;.</span>
          </div>
        ) : (
          unassignedParts.map((part) => {
            const isSelected = selectedPartId === part.id;
            return (
              <div
                key={part.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', part.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onClick={() => handlePartClick(part.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm md:text-base select-none transition-all cursor-grab active:cursor-grabbing active:scale-95 ${
                  hasErrors ? 'animate-bounce' : ''
                } ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/60 shadow-lg scale-105'
                    : 'bg-white text-slate-900 hover:bg-amber-50 hover:border-amber-300 shadow-md border-2 border-slate-200'
                }`}
              >
                <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{part.text}</span>
                {isSelected && (
                  <span className="flex items-center text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-900 text-amber-300">
                    Gekozen
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom control bar with big Check Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MousePointerClick className="w-4 h-4 text-amber-400" />
          <span>
            {unassignedParts.length === 0
              ? 'Klaar om na te kijken!'
              : `Nog ${unassignedParts.length} zinsdeel/zinsdelen te plaatsen`}
          </span>
        </div>

        <button
          type="button"
          onClick={onCheckAnswer}
          disabled={!allAssigned || isChecking}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-base transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
            allAssigned && !isChecking
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/25 ring-2 ring-emerald-400/40'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          <span>Controleer mijn antwoord</span>
        </button>
      </div>
    </div>
  );
};
