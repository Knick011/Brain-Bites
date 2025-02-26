// components/VQLN/ProgressBar.js
import React from 'react';

const ProgressBar = ({ questionsAnswered, tutorialMode }) => {
  // Different styling based on tutorial mode
  const barLabel = tutorialMode 
    ? `Tutorial: ${questionsAnswered}/5`
    : `Questions Answered: ${questionsAnswered}`;
  
  // Progress percentage for tutorial mode
  const percentage = tutorialMode 
    ? (questionsAnswered / 5) * 100
    : 100; // Full bar after tutorial
    
  return (
    <div className="w-full mb-4 px-4">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span className="font-medium">{barLabel}</span>
        {tutorialMode && <span>{questionsAnswered}/5</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
