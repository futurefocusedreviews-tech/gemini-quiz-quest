import React from 'react';
import type { FlashcardSession } from '../services/localStorage';

interface FlashcardResultProps {
  session: FlashcardSession;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const FlashcardResult: React.FC<FlashcardResultProps> = ({ session, onPlayAgain, onGoHome }) => {
  const percentage = Math.round((session.knownCards / session.totalCards) * 100);
  
  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { message: "Uitstekend! Jy ken hierdie onderwerp baie goed!", emoji: "🏆", color: "text-yellow-600" };
    if (percentage >= 80) return { message: "Fantasties! Jy verstaan die meeste konsepte.", emoji: "⭐", color: "text-green-600" };
    if (percentage >= 70) return { message: "Goed gedoen! Jy maak goeie vordering.", emoji: "👍", color: "text-blue-600" };
    if (percentage >= 50) return { message: "Nie sleg nie! Oefen nog 'n bietjie.", emoji: "📚", color: "text-yellow-600" };
    return { message: "Hou moed! Meer oefening sal help.", emoji: "💪", color: "text-red-600" };
  };
  
  const performance = getPerformanceMessage(percentage);
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
      {/* Header */}
      <div className="mb-8">
        <div className="text-6xl mb-4">{performance.emoji}</div>
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Flitskaarte Voltooi!</h2>
        <h3 className="text-2xl font-semibold text-blue-600 capitalize mb-4">{session.topic}</h3>
        <p className={`text-xl font-semibold ${performance.color}`}>
          {performance.message}
        </p>
      </div>

      {/* Score Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-8">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-black text-gray-700">{session.totalCards}</div>
            <div className="text-sm text-gray-600">Totaal</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-green-600">{session.knownCards}</div>
            <div className="text-sm text-gray-600">Geweet</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-red-600">{session.unknownCards}</div>
            <div className="text-sm text-gray-600">Nie Geweet</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className={`h-4 rounded-full transition-all duration-1000 ${
              percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
              percentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
              'bg-gradient-to-r from-red-400 to-red-600'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className={`text-4xl font-black ${getScoreColor(percentage)}`}>
          {percentage}% Reggekry
        </div>
      </div>

      {/* Motivational Messages */}
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <p className="text-gray-600 text-sm">
          {session.unknownCards > 0 && (
            <>Fokus op die {session.unknownCards} kaarte wat jy nie geweet het nie vir volgende keer. </>
          )}
          {percentage >= 80 && "Jy is gereed vir die volgende moeilikheidsgraad! "}
          Hou aan oefen om jou kennis te versterk.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onPlayAgain}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          📚 Oefen Weer
        </button>
        <button
          onClick={onGoHome}
          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          🏠 Terug Hoof
        </button>
      </div>
      
      {/* Study Tips */}
      <div className="mt-6 text-xs text-gray-500">
        💡 Wenk: Herhaal die kaarte wat jy nie geweet het nie om beter te onthou
      </div>
    </div>
  );
};

export default FlashcardResult;