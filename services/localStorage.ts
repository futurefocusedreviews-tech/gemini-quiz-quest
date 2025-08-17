import type { QuizResult } from '../types';

const QUIZ_HISTORY_KEY = 'gemini-quiz-history';
const QUIZ_PROGRESS_KEY = 'gemini-quiz-progress';
const QUESTION_HISTORY_KEY = 'gemini-question-history';

export const storeQuizResult = async (result: QuizResult): Promise<void> => {
  try {
    const existingHistory = getQuizHistory();
    const updatedHistory = [result, ...existingHistory];
    localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error storing quiz result:", error);
  }
};

export const getQuizHistory = (): QuizResult[] => {
  try {
    const stored = localStorage.getItem(QUIZ_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error retrieving quiz history:", error);
    return [];
  }
};

export const getUserQuizHistory = async (userId: string): Promise<QuizResult[]> => {
  const allHistory = getQuizHistory();
  return allHistory.filter(result => result.userId === userId);
};

export const storeQuizProgress = (questionIndex: number, answers: string[], score: number): void => {
  try {
    const progress = {
      questionIndex,
      answers,
      score,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Error storing quiz progress:", error);
  }
};

export const getQuizProgress = () => {
  try {
    const stored = localStorage.getItem(QUIZ_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error retrieving quiz progress:", error);
    return null;
  }
};

export const clearQuizProgress = (): void => {
  try {
    localStorage.removeItem(QUIZ_PROGRESS_KEY);
  } catch (error) {
    console.error("Error clearing quiz progress:", error);
  }
};

export const getQuestionHistory = (topic: string): string[] => {
  try {
    const stored = localStorage.getItem(QUESTION_HISTORY_KEY);
    const allHistory = stored ? JSON.parse(stored) : {};
    return allHistory[topic] || [];
  } catch (error) {
    console.error("Error retrieving question history:", error);
    return [];
  }
};

export const addToQuestionHistory = (topic: string, questions: string[]): void => {
  try {
    const stored = localStorage.getItem(QUESTION_HISTORY_KEY);
    const allHistory = stored ? JSON.parse(stored) : {};
    
    if (!allHistory[topic]) {
      allHistory[topic] = [];
    }
    
    // Add new questions and keep only last 50 to prevent infinite growth
    allHistory[topic] = [...allHistory[topic], ...questions].slice(-50);
    
    localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify(allHistory));
  } catch (error) {
    console.error("Error storing question history:", error);
  }
};

// Flashcard-specific localStorage functions
const FLASHCARD_PROGRESS_KEY = 'gemini-flashcard-progress';
const FLASHCARD_HISTORY_KEY = 'gemini-flashcard-history';

export interface FlashcardSession {
  topic: string;
  difficulty: string;
  totalCards: number;
  knownCards: number;
  unknownCards: number;
  date: string;
  userId: string;
}

export const storeFlashcardSession = async (session: FlashcardSession): Promise<void> => {
  try {
    const existingHistory = getFlashcardHistory();
    const updatedHistory = [session, ...existingHistory];
    localStorage.setItem(FLASHCARD_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error storing flashcard session:", error);
  }
};

export const getFlashcardHistory = (): FlashcardSession[] => {
  try {
    const stored = localStorage.getItem(FLASHCARD_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error retrieving flashcard history:", error);
    return [];
  }
};

export const getUserFlashcardHistory = async (userId: string): Promise<FlashcardSession[]> => {
  const allHistory = getFlashcardHistory();
  return allHistory.filter(session => session.userId === userId);
};