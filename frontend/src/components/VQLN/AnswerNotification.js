// Updated components/VQLN/Question/AnswerNotification.js to fix swipe animation issues
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronUp } from 'lucide-react';

/**
 * Answer notification component with auto-transition timer
 * Modified to fix swipe animation issues in tutorial mode
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Auto-advance timer
  useEffect(() => {
    console.log("AnswerNotification mounted, setting up auto-advance timer", { autoAdvanceDelay, onContinue });
    let timer;
    let countdownInterval;
    
    if (autoAdvanceDelay > 0 && onContinue) {
      // Countdown timer for UI feedback
      countdownInterval = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
      
      // Auto-advance timer
      timer = setTimeout(() => {
        console.log("Auto-advance timer triggered, calling onContinue");
        handleContinue();
      }, autoAdvanceDelay);
    }
    
    return () => {
      console.log("AnswerNotification unmounting, clearing timers");
      if (timer) clearTimeout(timer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [autoAdvanceDelay, onContinue]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Use Down Arrow, Space, or Enter keys for navigation
      if ((e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') && onContinue && !isTransitioning) {
        e.preventDefault(); // Prevent default scrolling behavior
        console.log("Key press detected in explanation, calling onContinue");
        handleContinue();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue, isTransitioning]);
  
  // Improved continue handler to prevent multiple triggers
  const handleContinue = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Call onContinue directly without any animation in tutorial mode
    if (tutorialMode) {
      // Call the continue handler immediately
      if (onContinue) {
        console.log("Tutorial mode: directly calling onContinue without animation");
        onContinue();
      }
    } else {
      // In regular mode, call continue after a short delay
      if (onContinue) {
        console.log("Regular mode: calling onContinue after delay");
        onContinue();
      }
    }
  };
  
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
          
          {/* Button to continue - this helps avoid swipe issues */}
          <button
            onClick={handleContinue}
            className={`w-full mt-3 py-2 px-4 rounded-md font-medium transition-colors ${
              isCorrect 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : isTimeout 
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                  : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Continue
          </button>
          
          {/* Progress bar for auto-advance */}
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
