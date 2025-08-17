
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizResult {
  userId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  date: string;
}
