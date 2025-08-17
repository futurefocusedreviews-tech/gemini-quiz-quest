import React, { useState } from 'react';
import { generateFlashcards } from '../services/flashcardService';
import type { FlashcardData } from './Flashcard';
import Spinner from './Spinner';
import AILoader from './AILoader';

interface FlashcardSetupProps {
  onFlashcardStart: (flashcards: FlashcardData[], topic: string, difficulty: string) => void;
}

const topics = ["Materie", "Water", "Lug"];
const difficulties = ["Maklik", "Gemiddeld", "Moeilik"];

const FlashcardSetup: React.FC<FlashcardSetupProps> = ({ onFlashcardStart }) => {
  const [topic, setTopic] = useState(topics[0]);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const flashcards = await generateFlashcards(topic, difficulty);
      if (flashcards.length > 0) {
        onFlashcardStart(flashcards, topic, difficulty);
      } else {
        setError("Kon nie flitskaarte skep vir hierdie onderwerp nie. Probeer asseblief weer!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout het voorgekom.");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyDescription = (diff: string) => {
    const descriptions = {
      'Maklik': 'Basiese woordeskat en definisies',
      'Gemiddeld': 'Konsepte en voorbeelde',
      'Moeilik': 'Gevorderde begrip en toepassings'
    };
    return descriptions[diff as keyof typeof descriptions];
  };

  if (loading) {
    return <AILoader message="A.I. skep jou flitskaarte..." />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-4">📚 Flitskaarte</h2>
      <p className="text-gray-500 mb-8">Kies 'n onderwerp en moeilikheidsgraad om te begin leer.</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-left text-lg font-bold text-gray-700 mb-2">
            Onderwerp
          </label>
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
          <label className="block text-left text-lg font-bold text-gray-700 mb-2">
            Moeilikheidsgraad
          </label>
          <div className="grid grid-cols-1 gap-3">
            {difficulties.map(d => (
              <button
                type="button"
                key={d}
                onClick={() => setDifficulty(d)}
                className={`p-4 rounded-lg text-left transition-all duration-200 ${
                  difficulty === d 
                    ? 'bg-purple-600 text-white ring-2 ring-offset-2 ring-purple-500' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="font-bold text-lg">{d}</div>
                <div className="text-sm opacity-90">{getDifficultyDescription(d)}</div>
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 px-4 rounded-lg shadow-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          🚀 Begin Flitskaarte
        </button>
      </form>
    </div>
  );
};

export default FlashcardSetup;