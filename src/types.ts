export type CategoryId = 'wie' | 'doet' | 'wat' | 'waar' | 'wanneer' | 'hoe';

export interface CategoryConfig {
  id: CategoryId;
  questionLabel: string; // e.g. "Wie?"
  grammaticalLabel: string; // e.g. "Onderwerp (persoon)"
  shortGrammar: string; // e.g. "Onderwerp"
  subtitle: string; // e.g. "Personen of het onderwerp"
  helperQuestion: string; // e.g. "Wie doet het?"
  colorName: string; // e.g. "Geel", "Rood", "Bruin", etc.
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  accentHex: string;
  lightHex: string;
  iconName: 'user' | 'zap' | 'package' | 'map-pin' | 'clock' | 'sparkles';
  explanation: string;
  example: string;
}

export interface SentencePart {
  id: string;
  text: string;
  category: CategoryId;
}

export interface SentenceData {
  id: number;
  fullSentence: string;
  parts: SentencePart[];
  level: 'basis' | 'moeilijk' | 'extra_oefenen';
  tip?: string;
}

export type DisplayMode = 'both' | 'questions' | 'grammatical';

export type AssessmentResult = 'heel_goed' | 'goed' | 'gemiddeld' | 'laag';

export interface SentenceAttempt {
  sentenceId: number;
  attempts: number;
  firstTryCorrect: boolean;
  mistakesCount: number;
  partsAccuracy: Record<string, boolean>;
}

export interface SessionStats {
  score: number;
  streak: number;
  bestStreak: number;
  sentencesCompleted: number;
  firstTryCorrectCount: number;
  totalAttempts: number;
  categoryMistakes: Record<CategoryId, number>;
  categoryCorrect: Record<CategoryId, number>;
  attemptsHistory: SentenceAttempt[];
}
