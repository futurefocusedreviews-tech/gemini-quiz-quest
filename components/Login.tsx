
import React from 'react';
import { signInWithGoogle } from '../services/firebase';

const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google Sign-In failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="text-center bg-white/90 p-10 rounded-2xl shadow-2xl backdrop-blur-sm max-w-md w-full">
        <h1 className="text-5xl font-black text-gray-800 mb-2">Gemini Quiz Quest</h1>
        <p className="text-gray-600 mb-8 text-lg">A magical learning adventure!</p>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center w-full bg-white hover:bg-gray-100 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google icon"
            className="w-6 h-6 mr-4"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
