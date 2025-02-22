// InitialWelcome.js
import React from 'react';
import { Brain } from 'lucide-react';

const InitialWelcome = ({ onStart, isLoading }) => {
  return (
    <div className="initial-welcome">
      <div className="welcome-logo">
        <Brain size={150} color="white" />
      </div>
      <h1 className="welcome-heading">Welcome to Brain Bites</h1>
      <p className="welcome-subtext">
        Engage your mind with bite-sized videos and test your knowledge with interactive questions
      </p>
      <button 
        className={`start-button ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
        onClick={onStart}
        disabled={isLoading}
      >
        {isLoading ? 'Loading Videos...' : 'Get Started'}
      </button>
    </div>
  );
};

export default InitialWelcome;
