import React, { useState, useEffect } from 'react';

interface AILoaderProps {
  message?: string;
}

const AILoader: React.FC<AILoaderProps> = ({ message = "A.I. skep gou jou vrae..." }) => {
  const [dots, setDots] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  
  const loadingMessages = [
    "A.I. skep gou jou vrae...",
    "Kurrikulum word nagegaan...",
    "Interessante vrae word gebou...",
    "Laaste bietjie magie..."
  ];

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
      <div className="mb-8">
        {/* AI Brain Animation */}
        <div className="relative inline-block">
          <div className="text-8xl animate-pulse">🧠</div>
          <div className="absolute -top-2 -right-2 text-3xl animate-bounce">✨</div>
          <div className="absolute -bottom-1 -left-2 text-2xl animate-ping">⚡</div>
        </div>
      </div>

      {/* Animated Text */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {loadingMessages[messageIndex]}
          <span className="text-purple-600">{dots}</span>
        </h2>
        <p className="text-gray-500">
          Gemini A.I. gebruik jou kurrikulum om perfekte vrae te maak
        </p>
      </div>

      {/* Animated Progress Bars */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-32 text-left">Onderwerp analise</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
            <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
          </div>
          <span className="text-green-600">✓</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-32 text-left">Vrae genereer</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full animate-progress" style={{width: '75%'}}></div>
          </div>
          <span className="animate-spin">⚙️</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-32 text-left">Kwaliteit toets</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
            <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full animate-slow-pulse" style={{width: '45%'}}></div>
          </div>
          <span className="text-gray-400">⏳</span>
        </div>
      </div>

      {/* Spinning Gemini Logo Effect */}
      <div className="flex justify-center space-x-2 text-2xl">
        <span className="animate-bounce" style={{animationDelay: '0ms'}}>🤖</span>
        <span className="animate-bounce" style={{animationDelay: '200ms'}}>💭</span>
        <span className="animate-bounce" style={{animationDelay: '400ms'}}>📝</span>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 75%; }
          100% { width: 0%; }
        }
        
        @keyframes slow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }
        
        .animate-slow-pulse {
          animation: slow-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AILoader;