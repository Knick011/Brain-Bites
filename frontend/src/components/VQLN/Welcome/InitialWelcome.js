// components/VQLN/Welcome/InitialWelcome.js
import React from 'react';
import { Brain } from 'lucide-react';

const InitialWelcome = ({ onStart, isLoading }) => {
  return (
    <div className="initial-welcome">
      <div className="welcome-logo">
        <Brain size={150} color="white" className="animate-float" />
      </div>
      <h1 className="welcome-heading">Welcome to Brain Bites</h1>
      <p className="welcome-subtext">
        Learn while you play! Answer questions, watch fun videos, and build your knowledge.
      </p>
      <button 
        className={`start-button ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
        onClick={onStart}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Get Started'}
      </button>
      
      <div className="mt-8 grid grid-cols-3 gap-6 max-w-md mx-auto text-center">
        <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-1">Learn</h3>
          <p className="text-sm">Test your knowledge with fun questions</p>
        </div>
        
        <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-1">Watch</h3>
          <p className="text-sm">Enjoy short videos as rewards</p>
        </div>
        
        <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-1">Grow</h3>
          <p className="text-sm">Build your streak and score points</p>
        </div>
      </div>
    </div>
  );
};

export default InitialWelcome;
