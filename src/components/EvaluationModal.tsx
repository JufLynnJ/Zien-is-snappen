import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Star,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  CheckCircle2,
  TrendingUp,
  Printer,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { AssessmentResult, CategoryId, SessionStats } from '../types';
import { CATEGORIES, CATEGORY_LIST } from '../data/categories';
import { soundEffects } from '../utils/audio';

interface EvaluationModalProps {
  stats: SessionStats;
  totalSentences: number;
  onRestart: () => void;
  onStartAdvanced: () => void;
  onStartRemediation: () => void;
  onStartSentenceBuilder: () => void;
  onOpenCheatSheet: () => void;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  stats,
  totalSentences,
  onRestart,
  onStartAdvanced,
  onStartRemediation,
  onStartSentenceBuilder,
  onOpenCheatSheet,
}) => {
  const [pupilName, setPupilName] = useState('');
  const [showDiploma, setShowDiploma] = useState(false);

  // Determine performance level based on first-try accuracy
  const firstTryRatio = stats.sentencesCompleted > 0
    ? stats.firstTryCorrectCount / stats.sentencesCompleted
    : 0;
  
  let assessment: AssessmentResult = 'laag';
  if (firstTryRatio >= 0.85) {
    assessment = 'heel_goed';
  } else if (firstTryRatio >= 0.70) {
    assessment = 'goed';
  } else if (firstTryRatio >= 0.45) {
    assessment = 'gemiddeld';
  } else {
    assessment = 'laag';
  }

  const isHighTier = assessment === 'heel_goed' || assessment === 'goed';
  const isNeedsPractice = assessment === 'gemiddeld' || assessment === 'laag';

  useEffect(() => {
    soundEffects.playFanfare();
    // Confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 md:p-8 my-8 max-h-[92vh] overflow-y-auto">
        {/* Certificate / Diploma view */}
        {showDiploma ? (
          <div className="diploma-container border-8 border-double border-amber-400 p-6 sm:p-10 rounded-2xl bg-amber-50/50 text-center relative print:border-8 print:p-8">
            <div className="flex justify-between items-center mb-4 print:hidden">
              <button
                onClick={() => setShowDiploma(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Terug naar overzicht
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Afdrukken</span>
              </button>
            </div>

            <Award className="w-16 h-16 text-amber-500 mx-auto mb-2" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-700">
              Officiële Bekroning
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1 mb-2">
              Diploma Zinsontleding
            </h2>
            <p className="text-sm font-semibold text-slate-600 mb-6">
              Methode: &ldquo;Zien is snappen&rdquo; met kleurencodes
            </p>

            <div className="my-6 py-4 border-y-2 border-amber-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Dit diploma wordt met trots uitgereikt aan:
              </p>
              <div className="text-2xl sm:text-3xl font-black text-indigo-700 underline decoration-amber-400 decoration-wavy decoration-2">
                {pupilName.trim() || 'Super Taalkampioen'}
              </div>
            </div>

            <p className="text-sm sm:text-base font-medium text-slate-700 max-w-lg mx-auto mb-6">
              Heeft met succes de 20 oefenzinnen voltooid en behaalde het resultaat:
            </p>

            <div className="inline-block px-6 py-3 rounded-2xl bg-amber-200/80 border-2 border-amber-400 font-black text-lg sm:text-xl text-amber-950 shadow-inner mb-6">
              {assessment === 'heel_goed' && '🌟 HEEL GOED - Echte Zinsontleder!'}
              {assessment === 'goed' && '🎉 GOED - Knap resultaat!'}
              {assessment === 'gemiddeld' && '💪 GEMIDDELD - Blijven oefenen!'}
              {assessment === 'laag' && '🌱 LAAG - Oefening baart kunst!'}
            </div>

            <div className="flex justify-around text-xs font-bold text-slate-600 max-w-sm mx-auto pt-4 border-t border-amber-200">
              <div>
                <span className="text-slate-400 block text-[10px]">Totaalscore</span>
                <span className="text-base text-slate-900 font-black">{stats.score} punten</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">In 1x goed</span>
                <span className="text-base text-emerald-700 font-black">{stats.firstTryCorrectCount} / 20</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header / Hero */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 shadow-xl shadow-amber-300/40 mb-3 animate-bounce">
                <Trophy className="w-10 h-10 text-amber-700" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
                20 Zinnen Voltooid!
              </div>

              {/* Assessment Message */}
              {assessment === 'heel_goed' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    🌟 Je kan de zinsdelen <span className="text-emerald-600 underline decoration-amber-400">heel goed</span>!
                  </h2>
                  <p className="text-sm font-semibold text-slate-600 mt-1 max-w-md mx-auto">
                    Geweldig gedaan! Je hebt bijna alle zinsdelen meteen in de juiste kleur geplaatst. Een echte taalkampioen!
                  </p>
                </div>
              )}

              {assessment === 'goed' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    🎉 Je kan de zinsdelen <span className="text-indigo-600 underline decoration-amber-400">goed</span>!
                  </h2>
                  <p className="text-sm font-semibold text-slate-600 mt-1 max-w-md mx-auto">
                    Knap werk! Je kent de kleurencodes en vraagwoorden al heel vlot.
                  </p>
                </div>
              )}

              {assessment === 'gemiddeld' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    💪 Je kan de zinsdelen <span className="text-amber-600 underline decoration-amber-400">gemiddeld (blijven oefenen)</span>!
                  </h2>
                  <p className="text-sm font-semibold text-slate-600 mt-1 max-w-md mx-auto">
                    Je bent goed op weg! Met een beetje extra gerichte oefening snap je het helemaal.
                  </p>
                </div>
              )}

              {assessment === 'laag' && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    🌱 Je niveau is <span className="text-rose-600 underline decoration-rose-300">laag (nog veel oefenen)</span>.
                  </h2>
                  <p className="text-sm font-semibold text-slate-600 mt-1 max-w-md mx-auto">
                    Geen zorgen, ontleden vraagt wat gewenning! We hebben een speciaal extra oefenmoment voor jou klaarstaan.
                  </p>
                </div>
              )}
            </div>

            {/* Score summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Eindscore</span>
                <span className="text-2xl font-black text-amber-900">{stats.score}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">In 1x Juist</span>
                <span className="text-2xl font-black text-emerald-900">{stats.firstTryCorrectCount} / 20</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
                <span className="text-[10px] uppercase font-bold text-indigo-700 block">Hoogste Reeks</span>
                <span className="text-2xl font-black text-indigo-900">{stats.bestStreak}x</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Nauwkeurigheid</span>
                <span className="text-2xl font-black text-purple-900">
                  {Math.round(firstTryRatio * 100)}%
                </span>
              </div>
            </div>

            {/* Category breakdown (Which colors went best?) */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 mb-3 flex items-center justify-between">
                <span>Hoe ging elk zinsdeel?</span>
                <span className="text-slate-400 font-normal">Op basis van gemaakte keuzes</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORY_LIST.map((cat) => {
                  const mistakes = stats.categoryMistakes[cat.id] || 0;
                  const correct = stats.categoryCorrect[cat.id] || 0;
                  const total = correct + mistakes;
                  const pct = total > 0 ? Math.round((correct / total) * 100) : 100;

                  return (
                    <div
                      key={cat.id}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.accentHex }}
                        />
                        <div className="text-xs font-bold text-slate-800">
                          {cat.questionLabel}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-black ${
                          pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-rose-600'
                        }`}
                      >
                        {total === 0 ? '✓' : `${pct}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ADAPTIVE NEXT ACTIONS ACCORDING TO PROMPT */}
            <div className="space-y-3 mb-6">
              {/* If Gemiddeld or Laag: Show targeted Extra Oefenmoment banner */}
              {isNeedsPractice && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-2 border-amber-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-200" />
                    <span className="text-sm font-black uppercase tracking-wide text-amber-100">
                      Extra oefenmoment aanbevolen
                    </span>
                  </div>
                  <h3 className="text-lg font-black mb-1">
                    Verhoog je voortgang met het Extra Oefenmoment!
                  </h3>
                  <p className="text-xs text-amber-100 mb-4 leading-relaxed">
                    We hebben 4 gerichte zinnen klaargezet met handige vraagstappen (Wie?, Wat?, Waar?, Wanneer?, Hoe?) om je score te boosten naar Goed of Heel Goed!
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={onStartRemediation}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-amber-50 active:scale-95 text-amber-900 font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Start Extra Oefenmoment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onOpenCheatSheet}
                      className="px-4 py-2.5 rounded-xl bg-amber-600/60 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs border border-amber-300/40 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Bekijk Spiekbriefje</span>
                    </button>
                  </div>
                </div>
              )}

              {/* If Goed or Heel Goed: Allow Harder exercises or Build own sentence */}
              {isHighTier && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg border-2 border-indigo-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
                    <span className="text-sm font-black uppercase tracking-wide text-indigo-200">
                      Klaar voor de volgende uitdaging!
                    </span>
                  </div>
                  <h3 className="text-lg font-black mb-1">
                    Je mag de oefeningen vermoeilijken of zelf een zin vormen!
                  </h3>
                  <p className="text-xs text-indigo-100 mb-4 leading-relaxed">
                    Omdat je niveau zo hoog is, kun je nu complexere zinnen aanpakken of zelf zinnen bouwen en je buur of leerkracht testen.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={onStartAdvanced}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-indigo-50 active:scale-95 text-indigo-900 font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Moeilijkere zinnen (Niveau 2)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onStartSentenceBuilder}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Zelf een zin vormen</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Diploma generator input */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
              <div className="w-full sm:w-auto text-center sm:text-left">
                <div className="text-xs font-black text-amber-900">Wil je een echt diploma?</div>
                <div className="text-[11px] text-amber-700">Vul je naam in en druk je certificaat af</div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Typ je voornaam..."
                  value={pupilName}
                  onChange={(e) => setPupilName(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-xs font-bold text-slate-800 placeholder-slate-400 w-full sm:w-44 focus:outline-indigo-500"
                />
                <button
                  onClick={() => setShowDiploma(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shrink-0 active:scale-95 shadow-xs cursor-pointer"
                >
                  Toon Diploma
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={onRestart}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>20 Zinnen Opnieuw Spelen</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {isNeedsPractice && (
                  <button
                    onClick={onStartRemediation}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer"
                  >
                    Naar Extra Oefenmoment
                  </button>
                )}
                {isHighTier && (
                  <button
                    onClick={onStartAdvanced}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
                  >
                    Naar Niveau 2
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
