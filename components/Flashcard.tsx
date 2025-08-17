import React, { useState } from 'react';

export interface FlashcardData {
  id: string;
  front: string;
  back: string;
  topic: string;
  difficulty: string;
}

interface FlashcardProps {
  flashcards: FlashcardData[];
  onComplete: (knownCount: number, unknownCount: number) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ flashcards, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnown = () => {
    const newKnownCards = new Set([...knownCards, currentCard.id]);
    setKnownCards(newKnownCards);
    
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      onComplete(newKnownCards.size, unknownCards.size);
    }
  };

  const handleUnknown = () => {
    const newUnknownCards = new Set([...unknownCards, currentCard.id]);
    setUnknownCards(newUnknownCards);
    
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      onComplete(knownCards.size, newUnknownCards.size);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  if (!currentCard) {
    return <div>Geen flitskaarte beskikbaar nie</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-semibold text-purple-600">
            Flitskaart {currentIndex + 1} van {flashcards.length}
          </p>
          <p className="text-sm text-gray-500">
            Geweet: {knownCards.size} | Nie geweet: {unknownCards.size}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative mb-8">
        <div 
          className={`flashcard-container relative w-full h-64 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
        >
          {/* Front */}
          <div className="flashcard-face absolute inset-0 w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl shadow-xl flex items-center justify-center p-6 backface-hidden">
            <p className="text-white text-2xl font-bold text-center leading-tight">
              {currentCard.front}
            </p>
          </div>
          
          {/* Back */}
          <div className="flashcard-face absolute inset-0 w-full h-full bg-gradient-to-br from-green-400 to-teal-500 rounded-xl shadow-xl flex items-center justify-center p-6 backface-hidden rotate-y-180">
            <p className="text-white text-xl font-semibold text-center leading-relaxed">
              {currentCard.back}
            </p>
          </div>
        </div>
        
        <p className="text-center text-gray-500 mt-4 text-sm">
          {isFlipped ? 'Klik om terug te draai' : 'Klik om antwoord te sien'}
        </p>
      </div>

      {/* Action Buttons */}
      {isFlipped && (
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleUnknown}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            ❌ Nie Geweet Nie
          </button>
          <button
            onClick={handleKnown}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            ✅ Geweet
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 font-bold py-2 px-4 rounded-lg transition"
        >
          ← Vorige
        </button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Onderwerp: <span className="font-semibold text-purple-600">{currentCard.topic}</span>
          </p>
          <p className="text-xs text-gray-500">
            Vlak: {currentCard.difficulty}
          </p>
        </div>

        <button
          onClick={() => handleNext()}
          disabled={currentIndex === flashcards.length - 1}
          className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Volgende →
        </button>
      </div>

      <style jsx>{`
        .flashcard-container {
          perspective: 1000px;
        }
        .flashcard-face {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default Flashcard;