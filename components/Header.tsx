
import React from 'react';
import type { User } from 'firebase/auth';
import { logout } from '../services/firebase';

interface HeaderProps {
  user: User;
  onShowHistory: () => void;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onShowHistory, onGoHome }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="text-2xl font-black text-purple-600 cursor-pointer"
          onClick={onGoHome}
        >
          Gemini Quiz Quest
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onShowHistory}
            className="text-gray-600 hover:text-purple-600 font-semibold transition-colors"
          >
            My Tellings
          </button>
          <div className="flex items-center space-x-2">
            <img
              src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`}
              alt={user.displayName || 'User'}
              className="w-10 h-10 rounded-full border-2 border-purple-500"
            />
            <span className="hidden sm:block font-semibold text-gray-700">{user.displayName}</span>
          </div>
          <button
            onClick={logout}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;