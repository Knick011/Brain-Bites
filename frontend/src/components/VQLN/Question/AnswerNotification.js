// components/VQLN/Question/AnswerNotification.js
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronUp } from 'lucide-react';

/**
 * Answer notification component with auto-transition timer
 */
const AnswerNotification = ({ 
  isCorrect, 
  isTimeout = false, 
  explanation, 
  correctAnswer,
  tutorialMode = false,
  onContinue = null,
  autoAdvanceDelay = 8000 // 8 second auto-advance timer
}) => {
  const [timeRemaining, setTimeRemaining] = useState(autoAdvanceDelay / 1000);
  
  // Auto-advance timer
  useEffect(() => {
    let timer;
    let countdownInterval;
    
    if (autoAdvanceDelay > 0) {
      // Countdown timer for UI feedback
      countdownInterval = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      
      // Auto-advance timer
      timer = setTimeout(() => {
        if (onContinue) onContinue();
      }, autoAdvanceDelay);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [autoAdvanceDelay, onContinue]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-2xl">
        <div className={`rounded-lg p-5 ${
          isCorrect ? "bg-green-50" : isTimeout ? "bg-yellow-50" : "bg-red-50"
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {isCorrect ? (
              <CheckCircle size={32} className="text-green-500" />
            ) : isTimeout ? (
              <AlertCircle size={32} className="text-yellow-500" />
            ) : (
              <XCircle size={32} className="text-red-500" />
            )}
            <h3 className="text-xl font-bold">
              {isCorrect ? "Correct!" : isTimeout ? "Time's up!" : "Incorrect"}
            </h3>
          </div>
          
          {!isCorrect && !isTimeout && correctAnswer && (
            <div className="mb-4">
              <p className="font-medium mb-1">The correct answer was:</p>
              <p className="text-gray-800 font-bold">{correctAnswer}</p>
            </div>
          )}
          
          <div className="mb-6">
            <p className="text-gray-700">{explanation || "No explanation available."}</p>
          </div>
          
          {/* Simple swipe instruction with auto-progress indicator */}
          <div className="text-center mt-4 text-gray-500 flex items-center justify-center gap-1">
            <ChevronUp size={16} />
            <span className="text-sm">Swipe up to continue</span>
          </div>
          
          {/* Hidden auto-advance progress bar */}
          <div className="w-full h-1 bg-gray-200 mt-4 rounded-full overflow-hidden opacity-40">
            <div 
              className="h-full transition-all duration-1000 ease-linear"
              style={{ 
                width: `${(timeRemaining / (autoAdvanceDelay / 1000)) * 100}%`,
                backgroundColor: isCorrect ? '#22c55e' : isTimeout ? '#facc15' : '#ef4444' 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerNotification;
