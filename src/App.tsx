/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Volume2,
  Settings as SettingsIcon,
  HelpCircle,
  RotateCcw,
  Star,
  Award,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import {
  AssessmentResult,
  CategoryId,
  DisplayMode,
  SentenceData,
  SentencePart,
  SessionStats,
} from './types';
import { PRIMARY_SENTENCES, ADVANCED_SENTENCES, REMEDIATION_SENTENCES } from './data/sentences';
import { CATEGORIES } from './data/categories';
import { soundEffects, speakDutch } from './utils/audio';

import { Header } from './components/Header';
import { SentenceReader } from './components/SentenceReader';
import { DropZoneBoard } from './components/DropZoneBoard';
import { SentenceTray } from './components/SentenceTray';
import { FeedbackBanner } from './components/FeedbackBanner';
import { CheatSheetModal } from './components/CheatSheetModal';
import { SettingsModal } from './components/SettingsModal';
import { EvaluationModal } from './components/EvaluationModal';
import { SentenceBuilderModal } from './components/SentenceBuilderModal';

export default function App() {
  // Mode: 'basis' (the main 20 sentences), 'moeilijk' (advanced), 'extra_oefenen' (remediation), 'custom' (pupil-made)
  const [mode, setMode] = useState<'basis' | 'moeilijk' | 'extra_oefenen' | 'custom'>('basis');

  // Custom sentence built by pupil
  const [customSentenceData, setCustomSentenceData] = useState<SentenceData | null>(null);

  // Active sentence list
  const activeSentenceList: SentenceData[] = useMemo(() => {
    if (mode === 'moeilijk') return ADVANCED_SENTENCES;
    if (mode === 'extra_oefenen') return REMEDIATION_SENTENCES;
    if (mode === 'custom' && customSentenceData) return [customSentenceData];
    return PRIMARY_SENTENCES;
  }, [mode, customSentenceData]);

  // Current sentence index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Current active sentence object
  const currentSentence = activeSentenceList[currentIndex] || activeSentenceList[0];

  // Placements: map of partId -> CategoryId
  const [placements, setPlacements] = useState<Record<string, CategoryId>>({});

  // Verified correct part IDs that are locked in their boxes
  const [verifiedCorrectPartIds, setVerifiedCorrectPartIds] = useState<Set<string>>(new Set());

  // Tap-to-select for mobile / touch tablets
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  // Feedback banner state: 'idle' | 'correct' | 'incorrect'
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [returnedPartsCount, setReturnedPartsCount] = useState(0);
  const [attemptsOnCurrentSentence, setAttemptsOnCurrentSentence] = useState(0);

  // Session stats for evaluation after 20 sentences
  const [stats, setStats] = useState<SessionStats>({
    score: 0,
    streak: 0,
    bestStreak: 0,
    sentencesCompleted: 0,
    firstTryCorrectCount: 0,
    totalAttempts: 0,
    categoryMistakes: { wie: 0, doet: 0, wat: 0, waar: 0, wanneer: 0, hoe: 0 },
    categoryCorrect: { wie: 0, doet: 0, wat: 0, waar: 0, wanneer: 0, hoe: 0 },
    attemptsHistory: [],
  });

  // Settings
  const [displayMode, setDisplayMode] = useState<DisplayMode>('both');
  const [speechRate, setSpeechRate] = useState(0.9);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [isSentenceBuilderOpen, setIsSentenceBuilderOpen] = useState(false);

  // Read sentence on initial load or index change
  useEffect(() => {
    // Reset placements when sentence changes
    setPlacements({});
    setVerifiedCorrectPartIds(new Set());
    setSelectedPartId(null);
    setFeedbackStatus('idle');
    setReturnedPartsCount(0);
    setAttemptsOnCurrentSentence(0);
  }, [currentIndex, mode, customSentenceData]);

  // Derive unassigned parts
  const unassignedParts = useMemo(() => {
    return currentSentence.parts.filter((part) => !placements[part.id]);
  }, [currentSentence, placements]);

  const allAssigned = unassignedParts.length === 0;

  // Handle assigning a part to a category
  const handleAssignPart = useCallback(
    (partId: string, targetCategory: CategoryId) => {
      // If already verified correct, do not move
      if (verifiedCorrectPartIds.has(partId)) return;

      setPlacements((prev) => ({
        ...prev,
        [partId]: targetCategory,
      }));
      setSelectedPartId(null);
      // Clear incorrect status so user can retry cleanly
      if (feedbackStatus === 'incorrect') {
        setFeedbackStatus('idle');
      }
    },
    [verifiedCorrectPartIds, feedbackStatus]
  );

  // Handle removing a placed part back to the tray
  const handleRemovePart = useCallback(
    (partId: string) => {
      if (verifiedCorrectPartIds.has(partId)) return;

      setPlacements((prev) => {
        const next = { ...prev };
        delete next[partId];
        return next;
      });
      if (feedbackStatus === 'incorrect') {
        setFeedbackStatus('idle');
      }
    },
    [verifiedCorrectPartIds, feedbackStatus]
  );

  // Reset current unverified placements
  const handleResetPlacements = () => {
    soundEffects.playPop();
    setPlacements((prev) => {
      const next: Record<string, CategoryId> = {};
      // keep verified
      verifiedCorrectPartIds.forEach((id) => {
        if (prev[id]) next[id] = prev[id];
      });
      return next;
    });
    setSelectedPartId(null);
    setFeedbackStatus('idle');
  };

  // Check answer according to the user's strict pedagogical instruction:
  // "Bij elk juist antwoord geef je een smiley en een score.
  // Bij een foutief antwoord de zinsdeel terug onderaan plaatsen en zeggen probeer het nog eens (enkel diegene die fout zijn)."
  const handleCheckAnswer = () => {
    const nextAttempts = attemptsOnCurrentSentence + 1;
    setAttemptsOnCurrentSentence(nextAttempts);

    let incorrectCount = 0;
    const newVerified = new Set(verifiedCorrectPartIds);
    const updatedPlacements = { ...placements };

    const newCategoryMistakes = { ...stats.categoryMistakes };
    const newCategoryCorrect = { ...stats.categoryCorrect };

    currentSentence.parts.forEach((part) => {
      const placedCategory = updatedPlacements[part.id];
      if (placedCategory === part.category) {
        // Correctly placed! Lock this part in
        newVerified.add(part.id);
        newCategoryCorrect[part.category] += 1;
      } else {
        // Incorrect placement! Remove from box and place back in the bottom tray
        incorrectCount += 1;
        delete updatedPlacements[part.id];
        newCategoryMistakes[part.category] += 1;
      }
    });

    setPlacements(updatedPlacements);
    setVerifiedCorrectPartIds(newVerified);

    if (incorrectCount === 0) {
      // 100% Correct!
      soundEffects.playSuccess();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }

      const isFirstTry = nextAttempts === 1;
      const pointsToAdd = isFirstTry ? 10 : 5;
      const newStreak = stats.streak + 1;
      const newBestStreak = Math.max(stats.bestStreak, newStreak);
      const newFirstTryCount = isFirstTry
        ? stats.firstTryCorrectCount + 1
        : stats.firstTryCorrectCount;

      setStats((prev) => ({
        ...prev,
        score: prev.score + pointsToAdd,
        streak: newStreak,
        bestStreak: newBestStreak,
        sentencesCompleted: prev.sentencesCompleted + 1,
        firstTryCorrectCount: newFirstTryCount,
        totalAttempts: prev.totalAttempts + nextAttempts,
        categoryMistakes: newCategoryMistakes,
        categoryCorrect: newCategoryCorrect,
      }));

      setFeedbackStatus('correct');
    } else {
      // Some parts were wrong!
      soundEffects.playTryAgain();
      setReturnedPartsCount(incorrectCount);
      setFeedbackStatus('incorrect');

      setStats((prev) => ({
        ...prev,
        streak: 0,
        totalAttempts: prev.totalAttempts + 1,
        categoryMistakes: newCategoryMistakes,
        categoryCorrect: newCategoryCorrect,
      }));
    }
  };

  // Advance to next sentence or evaluation
  const handleNextSentence = () => {
    soundEffects.playPop();
    const nextIdx = currentIndex + 1;

    if (nextIdx < activeSentenceList.length) {
      setCurrentIndex(nextIdx);
    } else {
      // Completed all sentences in the current series!
      // If it's the main 20-sentence series or a round finish:
      setIsEvaluationOpen(true);
    }
  };

  // Restart full session (20 sentences)
  const handleRestartFull = () => {
    setMode('basis');
    setCustomSentenceData(null);
    setCurrentIndex(0);
    setPlacements({});
    setVerifiedCorrectPartIds(new Set());
    setFeedbackStatus('idle');
    setStats({
      score: 0,
      streak: 0,
      bestStreak: 0,
      sentencesCompleted: 0,
      firstTryCorrectCount: 0,
      totalAttempts: 0,
      categoryMistakes: { wie: 0, doet: 0, wat: 0, waar: 0, wanneer: 0, hoe: 0 },
      categoryCorrect: { wie: 0, doet: 0, wat: 0, waar: 0, wanneer: 0, hoe: 0 },
      attemptsHistory: [],
    });
    setIsEvaluationOpen(false);
  };

  // Start Advanced sentences (Niveau 2) for "Goed" & "Heel Goed"
  const handleStartAdvanced = () => {
    setMode('moeilijk');
    setCurrentIndex(0);
    setIsEvaluationOpen(false);
  };

  // Start Remediation / Extra booster for "Gemiddeld" & "Laag"
  const handleStartRemediation = () => {
    setMode('extra_oefenen');
    setCurrentIndex(0);
    setIsEvaluationOpen(false);
  };

  // Play custom sentence created in SentenceBuilderModal
  const handlePlayCustomSentence = (sentence: SentenceData) => {
    setCustomSentenceData(sentence);
    setMode('custom');
    setCurrentIndex(0);
  };

  const modeDisplayName = {
    basis: '20 Zinnen',
    moeilijk: 'Niveau 2: Uitdaging',
    extra_oefenen: 'Extra Oefenmoment',
    custom: 'Eigen Zin',
  }[mode];

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-amber-50/40 via-slate-50 to-indigo-50/30 text-slate-800 flex flex-col font-sans transition-all ${
        isDyslexicFont ? 'tracking-wider font-mono text-base' : ''
      }`}
    >
      {/* Header */}
      <Header
        score={stats.score}
        streak={stats.streak}
        currentSentenceNumber={currentIndex + 1}
        totalSentences={activeSentenceList.length}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSentenceBuilder={() => setIsSentenceBuilderOpen(true)}
        modeName={modeDisplayName}
      />

      {/* Mode Switcher Banner if in alternative mode */}
      {mode !== 'basis' && (
        <div className="bg-indigo-600 text-white py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-3">
          <span>Huidige reeks: <strong>{modeDisplayName}</strong></span>
          <button
            onClick={handleRestartFull}
            className="underline hover:text-amber-200 cursor-pointer font-extrabold"
          >
            Terug naar de 20 basiszinnen
          </button>
        </div>
      )}

      {/* Main Classroom Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
        {/* Sentence Reader with Text-to-speech & glowing illuminated colors */}
        <SentenceReader
          sentence={currentSentence.fullSentence}
          parts={currentSentence.parts}
          isCorrect={feedbackStatus === 'correct'}
          tip={currentSentence.tip}
          speechRate={speechRate}
        />

        {/* The 6 Zien is snappen category boxes */}
        <DropZoneBoard
          placements={placements}
          sentenceParts={currentSentence.parts}
          verifiedCorrectPartIds={verifiedCorrectPartIds}
          displayMode={displayMode}
          selectedPartId={selectedPartId}
          onAssignPart={handleAssignPart}
          onRemovePart={handleRemovePart}
        />

        {/* Feedback Banner (Smiley, Points, or Probeer het nog eens) */}
        <FeedbackBanner
          status={feedbackStatus}
          message="Super gedaan! Alle zinsdelen staan in de juiste kleur."
          scoreGained={10}
          returnedPartsCount={returnedPartsCount}
          onNext={handleNextSentence}
          isLastSentence={currentIndex + 1 >= activeSentenceList.length}
        />

        {/* Unassigned Sentence Parts Tray (Bottom) */}
        {feedbackStatus !== 'correct' && (
          <SentenceTray
            unassignedParts={unassignedParts}
            selectedPartId={selectedPartId}
            onSelectPart={setSelectedPartId}
            onCheckAnswer={handleCheckAnswer}
            onResetPlacements={handleResetPlacements}
            allAssigned={allAssigned}
            isChecking={false}
            hasErrors={feedbackStatus === 'incorrect'}
          />
        )}
      </main>

      {/* Footer with quick color reference bar */}
      <footer className="w-full bg-white border-t border-slate-200 py-3 px-4 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-bold text-slate-700">Zien is snappen:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Wie? (Geel)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-900 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Doet? (Rood)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#854d0e]" /> Wat? (Bruin)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-purple-600" /> Waar? (Paars)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Wanneer? (Oranje)
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-600" /> Hoe? (Groen)
            </span>
          </div>

          <div className="text-[11px] font-semibold text-slate-400">
            Ontworpen voor basisonderwijs • Juf Lynn
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        speechRate={speechRate}
        setSpeechRate={setSpeechRate}
        isDyslexicFont={isDyslexicFont}
        setIsDyslexicFont={setIsDyslexicFont}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        totalSentences={activeSentenceList.length}
        currentSentenceIdx={currentIndex}
        onJumpToSentence={(idx) => setCurrentIndex(idx)}
        onResetSession={handleRestartFull}
      />

      {isEvaluationOpen && (
        <EvaluationModal
          stats={stats}
          totalSentences={activeSentenceList.length}
          onRestart={handleRestartFull}
          onStartAdvanced={handleStartAdvanced}
          onStartRemediation={handleStartRemediation}
          onStartSentenceBuilder={() => {
            setIsEvaluationOpen(false);
            setIsSentenceBuilderOpen(true);
          }}
          onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        />
      )}

      <SentenceBuilderModal
        isOpen={isSentenceBuilderOpen}
        onClose={() => setIsSentenceBuilderOpen(false)}
        onPlayCustomSentence={handlePlayCustomSentence}
      />
    </div>
  );
}
