
import React from 'react';
import type { QuizResult } from '../types';

interface QuizResultProps {
  result: QuizResult;
  onPlayAgain: () => void;
}

const QuizResultComponent: React.FC<QuizResultProps> = ({ result, onPlayAgain }) => {
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    const message = percentage >= 80 ? "Awesome Job!" : percentage >= 50 ? "Good Try!" : "Keep Practicing!";

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-5xl font-black text-purple-600 mb-4">{message}</h2>
            <p className="text-xl text-gray-600 mb-6">You finished the {result.topic} quiz!</p>
            
            <div className="mb-8">
                <p className="text-6xl font-bold text-gray-800">{result.score} <span className="text-3xl text-gray-500">/ {result.totalQuestions}</span></p>
                <p className="text-2xl font-semibold text-green-500">({percentage}%)</p>
            </div>
            
            <button
                onClick={onPlayAgain}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg text-xl transition duration-300 ease-in-out transform hover:scale-105"
            >
                Play Again
            </button>
        </div>
    );
};

export default QuizResultComponent;
