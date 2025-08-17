
import React, { useState, useMemo, useEffect } from 'react';
import type { QuizQuestion } from '../types';
import { storeQuizProgress, clearQuizProgress } from '../services/localStorage';

interface QuizProps {
  questions: QuizQuestion[];
  topic: string;
  onQuizFinish: (score: number, topic: string) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, topic, onQuizFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    storeQuizProgress(currentQuestionIndex, answers, score);
  }, [currentQuestionIndex, answers, score]);

  // Clear progress when quiz starts
  useEffect(() => {
    return () => {
      if (currentQuestionIndex === questions.length - 1 && isAnswered) {
        clearQuizProgress();
      }
    };
  }, [currentQuestionIndex, questions.length, isAnswered]);

  const currentQuestion = questions[currentQuestionIndex];


  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    // Store the answer
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    
    // Calculate score immediately
    let newScore = score;
    if (option === currentQuestion.correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      handleNext(newScore);
    }, 1500);
  };

  const handleNext = (finalScore?: number) => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Use the passed finalScore or current score
      const scoreToUse = finalScore !== undefined ? finalScore : score;
      onQuizFinish(scoreToUse, topic);
    }
  };
  
  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-purple-100';
    }
    if (option === currentQuestion.correctAnswer) {
      return 'bg-green-500 text-white';
    }
    if (option === selectedAnswer) {
      return 'bg-red-500 text-white';
    }
    return 'bg-white opacity-60';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <div className="mb-6">
        <p className="text-lg font-semibold text-purple-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-800 mb-8">{currentQuestion.question}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={isAnswered}
            className={`p-4 rounded-lg text-lg text-left font-semibold border-2 border-gray-200 transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4 text-xl">
            {selectedAnswer === currentQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect!'}
          </p>
          <p className="text-sm text-gray-500">
            {currentQuestionIndex < questions.length - 1 ? 'Next question in 1.5 seconds...' : 'Finishing quiz...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Quiz;
