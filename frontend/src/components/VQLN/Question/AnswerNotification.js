// components/VQLN/Question/AnswerNotification.js
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ArrowDown } from 'lucide-react';

const AnswerNotification = ({ 
  isCorrect, 
  isTimeout = false, 
  explanation, 
  correctAnswer,
  onContinue,
  timeLeft = 15,
  tutorialMode = false
}) => {
  const [timer, setTimer] = useState(timeLeft);
  const [showKeyboardHint, setShowKeyboardHint] = useState(true);
  
  // Auto-hide keyboard hint after 10 seconds
  useEffect(() => {
    const hintTimer = setTimeout(() => {
      setShowKeyboardHint(false);
    }, 10000);
    
    return () => clearTimeout(hintTimer);
  }, []);
  
  // Countdown timer effect - only auto-continue in non-tutorial mode
  useEffect(() => {
    if (!tutorialMode) {
      const countdown = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            onContinue && onContinue();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdown);
    }
  }, [onContinue, timeLeft, tutorialMode]);
  
  // Enhanced keyboard shortcuts with more keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Continue on Space, Enter, or Down Arrow
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') {
        e.preventDefault(); // Prevent default scrolling
        onContinue && onContinue();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue]);

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
          
          <div className="mb-4">
            <p className="text-gray-700">{explanation || "No explanation available."}</p>
          </div>
          
          {/* Enhanced navigation instructions */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {tutorialMode ? (
                <div className="flex items-center gap-2">
                  <ArrowDown size={16} className="animate-bounce" />
                  <span>Press ↓ key to continue</span>
                </div>
              ) : (
                <span>Next question in {timer}s</span>
              )}
            </div>
            
            <button 
              onClick={() => onContinue && onContinue()}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <span>Continue</span>
              <ArrowDown size={14} />
            </button>
          </div>
          
          {/* Keyboard navigation hint */}
          {showKeyboardHint && (
            <div className="mt-4 p-2 bg-gray-100 rounded-lg text-center text-sm text-gray-600">
              <p>Tip: You can also press <strong>↓</strong>, <strong>Enter</strong>, or <strong>Space</strong> to continue</p>
            </div>
          )}
          
          {/* Progress bar - only in non-tutorial mode */}
          {!tutorialMode && (
            <div className="w-full bg-gray-200 h-1 mt-4 rounded-full overflow-hidden">
              <div 
                className="h-1 bg-orange-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(timer / timeLeft) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnswerNotification;
