// QuestionTimer.js
import React, { useEffect, useState } from 'react';

const QuestionTimer = ({ timeLimit, onTimeUp, isActive }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onTimeUp]);
  
  // Reset timer when new question appears
  useEffect(() => {
    setTimeRemaining(timeLimit);
  }, [timeLimit]);
  
  // Calculate percentage for progress bar
  const percentage = (timeRemaining / timeLimit) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div 
        className={`h-2.5 rounded-full transition-all duration-1000 ${
          percentage > 60 ? 'bg-green-500' : 
          percentage > 30 ? 'bg-yellow-500' : 'bg-red-500'
        }`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default QuestionTimer;
