import React, { useState } from 'react';
import type { QuizResult } from '../types';
import type { FlashcardSession } from '../services/localStorage';

interface ScoreHistoryProps {
    history: QuizResult[];
    flashcardHistory: FlashcardSession[];
    onBack: () => void;
}

const ScoreHistory: React.FC<ScoreHistoryProps> = ({ history, flashcardHistory, onBack }) => {
    const [activeTab, setActiveTab] = useState<'quiz' | 'flashcard'>('quiz');
    
    const getScoreColor = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };
    
    const getScoreEmoji = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        if (percentage >= 90) return '🏆';
        if (percentage >= 80) return '⭐';
        if (percentage >= 60) return '👍';
        return '📚';
    };
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('af-ZA', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-extrabold text-gray-800">My Tellings</h2>
                <button
                    onClick={onBack}
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
                >
                    ← Terug na Hoof
                </button>
            </div>

            {/* Tabs */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => setActiveTab('quiz')}
                    className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                        activeTab === 'quiz'
                            ? 'bg-purple-500 text-white shadow-md'
                            : 'text-gray-600 hover:text-purple-600'
                    }`}
                >
                    🧠 Vrae ({history.length})
                </button>
                <button
                    onClick={() => setActiveTab('flashcard')}
                    className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                        activeTab === 'flashcard'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-gray-600 hover:text-blue-600'
                    }`}
                >
                    📚 Flitskaarte ({flashcardHistory.length})
                </button>
            </div>

            {/* Quiz Results */}
            {activeTab === 'quiz' && (
                <>
                    {history.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🧠</div>
                            <p className="text-gray-500 text-lg">Jy het nog geen vrae voltooi nie.</p>
                            <p className="text-gray-400">Speel een om jou telling hier te sien!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((result, index) => {
                                const percentage = Math.round((result.score / result.totalQuestions) * 100);
                                return (
                                    <div key={index} className="bg-gradient-to-r from-purple-50 to-white p-6 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-200 shadow-md">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">🧠</span>
                                                    <span className="text-2xl">{getScoreEmoji(result.score, result.totalQuestions)}</span>
                                                    <h3 className="text-2xl font-bold text-purple-700 capitalize">{result.topic}</h3>
                                                    <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm font-semibold">Vrae</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{formatDate(result.date)}</p>
                                                <div className="flex items-center gap-4">
                                                    <span className={`text-3xl font-black ${getScoreColor(result.score, result.totalQuestions)}`}>
                                                        {result.score} / {result.totalQuestions}
                                                    </span>
                                                    <div className="flex items-center">
                                                        <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                                                            <div 
                                                                className={`h-3 rounded-full transition-all duration-500 ${
                                                                    percentage >= 80 ? 'bg-green-500' :
                                                                    percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`text-lg font-bold ${getScoreColor(result.score, result.totalQuestions)}`}>
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Flashcard Results */}
            {activeTab === 'flashcard' && (
                <>
                    {flashcardHistory.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-gray-500 text-lg">Jy het nog geen flitskaarte voltooi nie.</p>
                            <p className="text-gray-400">Probeer een om jou vordering hier te sien!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {flashcardHistory.map((session, index) => {
                                const percentage = Math.round((session.knownCards / session.totalCards) * 100);
                                return (
                                    <div key={index} className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 shadow-md">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-2xl">📚</span>
                                                    <span className="text-2xl">{percentage >= 80 ? '🏆' : percentage >= 60 ? '⭐' : '📚'}</span>
                                                    <h3 className="text-2xl font-bold text-blue-700 capitalize">{session.topic}</h3>
                                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-semibold">Flitskaarte</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">{formatDate(session.date)}</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex gap-4">
                                                        <span className="text-lg font-bold text-green-600">
                                                            ✓ {session.knownCards} Geweet
                                                        </span>
                                                        <span className="text-lg font-bold text-red-600">
                                                            ✗ {session.unknownCards} Nie Geweet
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                                                            <div 
                                                                className={`h-3 rounded-full transition-all duration-500 ${
                                                                    percentage >= 80 ? 'bg-green-500' :
                                                                    percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`text-lg font-bold ${
                                                            percentage >= 80 ? 'text-green-600' :
                                                            percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                        }`}>
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ScoreHistory;