
import React, { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import type { QuizQuestion } from '../types';
import Spinner from './Spinner';
import AILoader from './AILoader';

interface QuizSetupProps {
  onQuizStart: (questions: QuizQuestion[], topic: string) => void;
}

const topics = ["Materie", "Water", "Lug"];
const difficulties = ["Maklik", "Gemiddeld", "Moeilik"];

const QuizSetup: React.FC<QuizSetupProps> = ({ onQuizStart }) => {
  const [topic, setTopic] = useState(topics[0]);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const questions = await generateQuiz(topic, difficulty);
      if (questions.length > 0) {
        onQuizStart(questions, topic);
      } else {
        setError("The AI couldn't create a quiz for this topic. Please try another one!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AILoader />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Skep Jou Vrae!</h2>
      <p className="text-gray-500 mb-8">Kies 'n onderwerp en moeilikheidsgraad om te begin.</p>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-left text-lg font-bold text-gray-700 mb-2">Onderwerp</label>
          <select
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="block w-full p-4 text-lg border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
          >
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-left text-lg font-bold text-gray-700 mb-2">Moeilikheidsgraad</label>
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map(d => (
              <button
                type="button"
                key={d}
                onClick={() => setDifficulty(d)}
                className={`p-4 rounded-lg text-lg font-bold transition-all duration-200 ${difficulty === d ? 'bg-purple-600 text-white ring-2 ring-offset-2 ring-purple-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          🚀 Begin Vrae
        </button>
      </form>
    </div>
  );
};

export default QuizSetup;
