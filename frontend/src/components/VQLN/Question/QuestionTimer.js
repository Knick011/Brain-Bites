// components/VQLN/Question/QuestionTimer.js
import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

/**
 * Enhanced Question Timer with point indicators
 */
const QuestionTimer = ({ timeLimit = 20, onTimeUp, isActive, displayScore = true }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [potentialPoints, setPotentialPoints] = useState(100);
  
  // Calculate potential points based on time remaining
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      // Calculate points: 100 when full time left, 10 when time almost up
      const calculatedPoints = Math.max(10, Math.floor(100 - ((timeLimit - timeRemaining) / timeLimit) * 90));
      setPotentialPoints(calculatedPoints);
    }
  }, [timeRemaining, timeLimit, isActive]);
  
  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            onTimeUp && onTimeUp();
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
    setPotentialPoints(100);
  }, [timeLimit]);
  
  // Calculate percentage for progress bar
  const percentage = (timeRemaining / timeLimit) * 100;
  
  // Get timer color based on percentage
  const getTimerColor = () => {
    if (percentage > 70) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500 timer-danger';
  };
  
  // Get points text color based on points
  const getPointsColor = () => {
    if (potentialPoints > 80) return 'text-green-500';
    if (potentialPoints > 40) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="w-full mb-3">
      {/* Timer display */}
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-1 text-sm font-medium">
          <Clock size={14} className="text-gray-600" />
          <span>{timeRemaining}s</span>
        </div>
        
        {/* Points indicator */}
        {displayScore && (
          <div className={`flex items-center text-sm font-bold ${getPointsColor()}`}>
            <span className="mr-1">+</span>
            <span className="timer-points">{potentialPoints}</span>
            <span className="ml-1">pts</span>
          </div>
        )}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${getTimerColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {/* Animated points at stake */}
      {displayScore && (
        <div className="timer-points-visualization mt-1 flex justify-between">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden flex-grow">
            <div 
              className="h-1 bg-gradient-to-r from-green-500 to-red-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 ml-2">at stake</div>
        </div>
      )}
    </div>
  );
};

export default QuestionTimer;
