import React, { useState } from 'react';
import { X, Check, HelpCircle, User, Zap, Package, MapPin, Clock, Sparkles } from 'lucide-react';
import { CategoryConfig, CategoryId, DisplayMode, SentencePart } from '../types';
import { CATEGORY_LIST } from '../data/categories';
import { soundEffects } from '../utils/audio';

interface DropZoneBoardProps {
  // Map of partId -> CategoryId
  placements: Record<string, CategoryId>;
  sentenceParts: SentencePart[];
  // Parts that were verified as correct and are locked
  verifiedCorrectPartIds: Set<string>;
  displayMode: DisplayMode;
  selectedPartId: string | null;
  onAssignPart: (partId: string, targetCategory: CategoryId) => void;
  onRemovePart: (partId: string) => void;
}

const ICONS = {
  user: User,
  zap: Zap,
  package: Package,
  'map-pin': MapPin,
  clock: Clock,
  sparkles: Sparkles,
};

export const DropZoneBoard: React.FC<DropZoneBoardProps> = ({
  placements,
  sentenceParts,
  verifiedCorrectPartIds,
  displayMode,
  selectedPartId,
  onAssignPart,
  onRemovePart,
}) => {
  const [dragOverCategory, setDragOverCategory] = useState<CategoryId | null>(null);

  // Group parts by placed category
  const getPlacedParts = (catId: CategoryId): SentencePart[] => {
    return sentenceParts.filter((part) => placements[part.id] === catId);
  };

  const handleDragOver = (e: React.DragEvent, catId: CategoryId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCategory !== catId) {
      setDragOverCategory(catId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverCategory(null);
  };

  const handleDrop = (e: React.DragEvent, catId: CategoryId) => {
    e.preventDefault();
    setDragOverCategory(null);
    const partId = e.dataTransfer.getData('text/plain');
    if (partId) {
      soundEffects.playPop();
      onAssignPart(partId, catId);
    }
  };

  const handleBoxClick = (catId: CategoryId) => {
    if (selectedPartId) {
      soundEffects.playPop();
      onAssignPart(selectedPartId, catId);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {CATEGORY_LIST.map((cat: CategoryConfig) => {
          const placedInThisCategory = getPlacedParts(cat.id);
          const isOver = dragOverCategory === cat.id;
          const IconComp = ICONS[cat.iconName] || HelpCircle;
          const isClickTarget = Boolean(selectedPartId);

          return (
            <div
              key={cat.id}
              onDragOver={(e) => handleDragOver(e, cat.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, cat.id)}
              onClick={() => handleBoxClick(cat.id)}
              className={`relative flex flex-col justify-between min-h-[145px] p-4 rounded-3xl border-3 transition-all duration-200 select-none ${
                cat.bgClass
              } ${
                isOver
                  ? 'border-indigo-600 scale-[1.02] shadow-lg ring-4 ring-indigo-300/50'
                  : isClickTarget
                  ? `${cat.borderClass} hover:border-indigo-400 hover:shadow-md cursor-pointer ring-2 ring-indigo-200/40`
                  : `${cat.borderClass} shadow-xs`
              }`}
            >
              {/* Category Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: cat.accentHex }}
                    />
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {(displayMode === 'both' || displayMode === 'questions') && (
                        <h3 className="font-black text-base md:text-lg text-slate-900 tracking-tight">
                          {cat.questionLabel}
                        </h3>
                      )}
                      {(displayMode === 'both' || displayMode === 'grammatical') && (
                        <span className={`text-xs font-bold ${cat.badgeTextClass}`}>
                          {displayMode === 'grammatical' ? cat.grammaticalLabel : `(${cat.shortGrammar})`}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full text-white shadow-2xs"
                    style={{ backgroundColor: cat.accentHex }}
                  >
                    {cat.colorName}
                  </span>
                </div>

                {/* Subtitle / Helper question */}
                <p className="text-[11px] font-semibold text-slate-500 mb-3 flex items-center gap-1">
                  <IconComp className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{cat.helperQuestion}</span>
                </p>
              </div>

              {/* Dropped chips container */}
              <div className="flex flex-wrap gap-2 items-center min-h-[46px] p-1.5 rounded-2xl bg-white/70 border border-slate-200/60 shadow-inner">
                {placedInThisCategory.length === 0 ? (
                  <div className="w-full text-center text-xs font-medium text-slate-400 py-2 italic flex items-center justify-center gap-1">
                    {isOver ? (
                      <span className="text-indigo-600 font-bold not-italic">Laat hier los!</span>
                    ) : isClickTarget ? (
                      <span className="text-indigo-600 font-semibold not-italic">Klik om hier te plaatsen</span>
                    ) : (
                      <span>Sleep hierheen...</span>
                    )}
                  </div>
                ) : (
                  placedInThisCategory.map((part) => {
                    const isLocked = verifiedCorrectPartIds.has(part.id);
                    return (
                      <div
                        key={part.id}
                        draggable={!isLocked}
                        onDragStart={(e) => {
                          if (isLocked) {
                            e.preventDefault();
                            return;
                          }
                          e.dataTransfer.setData('text/plain', part.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all ${
                          isLocked
                            ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-500 ring-2 ring-emerald-300/40'
                            : 'bg-white text-slate-800 border-2 border-slate-300 hover:border-slate-400 cursor-grab active:cursor-grabbing'
                        }`}
                      >
                        {isLocked ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: cat.accentHex }}
                          />
                        )}

                        <span className="select-none">{part.text}</span>

                        {/* Remove button if not verified locked */}
                        {!isLocked && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundEffects.playPop();
                              onRemovePart(part.id);
                            }}
                            className="ml-1 p-0.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Terug naar onderkant"
                            aria-label={`Verwijder ${part.text}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
