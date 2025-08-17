
import React, { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { firebaseConfig } from './services/firebase';
import { storeQuizResult, getUserQuizHistory } from './services/localStorage';
import type { QuizQuestion, QuizResult } from './types';
import Login from './components/Login';
import Header from './components/Header';
import QuizSetup from './components/QuizSetup';
import Quiz from './components/Quiz';
import QuizResultComponent from './components/QuizResult';
import ScoreHistory from './components/ScoreHistory';
import FlashcardSetup from './components/FlashcardSetup';
import Flashcard from './components/Flashcard';
import FlashcardResult from './components/FlashcardResult';
import Spinner from './components/Spinner';
import type { FlashcardData } from './components/Flashcard';
import { storeFlashcardSession, getUserFlashcardHistory } from './services/localStorage';
import type { FlashcardSession } from './services/localStorage';

type GameState = 'setup' | 'quiz-setup' | 'playing' | 'result' | 'history' | 'flashcard-setup' | 'flashcards' | 'flashcard-result';

const ConfigurationNeeded: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="max-w-3xl bg-white p-8 rounded-2xl shadow-2xl border-2 border-red-500">
        <h1 className="text-4xl font-black text-red-600 mb-4 text-center">Configuration Required</h1>
        <p className="text-gray-700 text-lg mb-6">
          Welcome to Gemini Quiz Quest! To get started, you need to configure your <strong>Firebase credentials</strong>.
          The application cannot connect to authentication and database services without them.
        </p>
        <div className="text-left bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Follow these steps:</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-600">
            <li>
              Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Firebase Console</a> and select your project.
            </li>
            <li>
              In the top-left, click the <strong>Gear icon</strong> <span className="font-mono text-sm bg-gray-200 p-1 rounded">⚙️</span> next to "Project Overview", then select <strong>Project settings</strong>.
            </li>
            <li>
              Under the "General" tab, scroll down to the "Your apps" section.
            </li>
            <li>
              Find your web app and look for the <strong>Firebase SDK snippet</strong>. Select the "Config" option.
            </li>
            <li>
              You will see an object with keys like `apiKey`, `authDomain`, etc. Copy this entire object.
            </li>
            <li>
              In your code editor, open the file: <br /> <code className="font-mono text-sm bg-gray-200 p-1 rounded-md mt-1 inline-block">services/firebase.ts</code>
            </li>
            <li>
              Paste your configuration, replacing the placeholder values inside the `firebaseConfig` variable.
            </li>
          </ol>
        </div>
        <p className="mt-6 text-sm text-gray-500 text-center">
          After updating the file, refresh this page. You also need to ensure your <strong>Google Gemini API key</strong> is correctly set up as an environment variable (`API_KEY`).
        </p>
      </div>
    </div>
);


export default function App() {
  const isFirebaseConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith("PASTE_");

  if (!isFirebaseConfigured) {
    return <ConfigurationNeeded />;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [gameState, setGameState] = useState<GameState>('setup');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [flashcardHistory, setFlashcardHistory] = useState<FlashcardSession[]>([]);
  const [currentFlashcardDifficulty, setCurrentFlashcardDifficulty] = useState<string>('');
  const [lastFlashcardSession, setLastFlashcardSession] = useState<FlashcardSession | null>(null);

  useEffect(() => {
    // Bypass auth for development - create a mock user
    const mockUser = {
      uid: 'dev-user-123',
      displayName: 'Development User',
      photoURL: null
    } as User;
    setUser(mockUser);
    setLoadingAuth(false);
  }, []);

  const handleQuizStart = (generatedQuestions: QuizQuestion[], topic: string) => {
    setQuestions(generatedQuestions);
    setCurrentTopic(topic);
    setGameState('playing');
  };
  
  const handleQuizFinish = useCallback(async (score: number, topic: string) => {
    if (user) {
      const result: QuizResult = {
        topic,
        score,
        totalQuestions: questions.length,
        date: new Date().toISOString(),
        userId: user.uid,
      };
      setLastResult(result);
      await storeQuizResult(result);
      setGameState('result');
    }
  }, [user, questions.length]);
  
  const handlePlayAgain = () => {
    setQuestions([]);
    setLastResult(null);
    setGameState('setup');
  };

  const handleShowHistory = async () => {
    if (user) {
        setLoadingAuth(true);
        const userHistory = await getUserQuizHistory(user.uid);
        const userFlashcardHistory = await getUserFlashcardHistory(user.uid);
        setHistory(userHistory);
        setFlashcardHistory(userFlashcardHistory);
        setGameState('history');
        setLoadingAuth(false);
    }
  };

  const handleFlashcardStart = (generatedFlashcards: FlashcardData[], topic: string, difficulty: string) => {
    setFlashcards(generatedFlashcards);
    setCurrentTopic(topic);
    setCurrentFlashcardDifficulty(difficulty);
    setGameState('flashcards');
  };

  const handleFlashcardComplete = async (knownCount: number, unknownCount: number) => {
    if (user) {
      const session: FlashcardSession = {
        topic: currentTopic,
        difficulty: currentFlashcardDifficulty,
        totalCards: flashcards.length,
        knownCards: knownCount,
        unknownCards: unknownCount,
        date: new Date().toISOString(),
        userId: user.uid,
      };
      setLastFlashcardSession(session);
      await storeFlashcardSession(session);
      setGameState('flashcard-result');
    }
  };

  const handleFlashcardPlayAgain = () => {
    setFlashcards([]);
    setLastFlashcardSession(null);
    setGameState('flashcard-setup');
  };

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      <Header user={user} onShowHistory={handleShowHistory} onGoHome={handlePlayAgain} />
      <main className="container mx-auto p-4 md:p-8">
        {gameState === 'setup' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-black text-purple-600 mb-4">Leersentrum</h1>
              <p className="text-gray-600">Kies jou leermetode:</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer" onClick={() => setGameState('quiz-setup')}>
                <div className="text-center">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="text-2xl font-bold text-purple-600 mb-2">Vrae</h3>
                  <p className="text-gray-600">Toets jou kennis met veelvuldige keuse vrae</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer" onClick={() => setGameState('flashcard-setup')}>
                <div className="text-center">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">Flitskaarte</h3>
                  <p className="text-gray-600">Leer woordeskat en konsepte stap vir stap</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {gameState === 'quiz-setup' && <QuizSetup onQuizStart={handleQuizStart} />}
        {gameState === 'playing' && questions.length > 0 && (
          <Quiz questions={questions} topic={currentTopic} onQuizFinish={handleQuizFinish} />
        )}
        {gameState === 'flashcard-setup' && <FlashcardSetup onFlashcardStart={handleFlashcardStart} />}
        {gameState === 'flashcards' && flashcards.length > 0 && (
          <Flashcard flashcards={flashcards} onComplete={handleFlashcardComplete} />
        )}
        {gameState === 'flashcard-result' && lastFlashcardSession && (
          <FlashcardResult 
            session={lastFlashcardSession} 
            onPlayAgain={handleFlashcardPlayAgain}
            onGoHome={handlePlayAgain}
          />
        )}
        {gameState === 'result' && lastResult && (
          <QuizResultComponent result={lastResult} onPlayAgain={handlePlayAgain} />
        )}
        {gameState === 'history' && (
            <ScoreHistory history={history} flashcardHistory={flashcardHistory} onBack={() => setGameState('setup')} />
        )}
      </main>
    </div>
  );
}