// components/VQLN/Question/AnswerNotification.js
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronDown } from 'lucide-react';
import StandardPopup from '../Common/StandardPopup';

/**
 * Answer Notification Popup
 * 
 * @param {Object} props
 * @param {boolean} props.isCorrect - Whether the answer was correct
 * @param {boolean} props.isTimeout - Whether the answer timed out
 * @param {string} props.explanation - Explanation text
 * @param {string} props.correctAnswer - The text of the correct answer
 * @param {function} props.onContinue - Function to call when continuing to next question
 * @param {number} props.timeLeft - Seconds until auto-continuation
 */
const AnswerNotification = ({ 
  isCorrect, 
  isTimeout = false, 
  explanation, 
  correctAnswer,
  onContinue,
  timeLeft = 15
}) => {
  const getIcon = () => {
    if (isCorrect) return <CheckCircle size={32} className="text-green-500" />;
    if (isTimeout) return <AlertCircle size={32} className="text-yellow-500" />;
    return <XCircle size={32} className="text-red-500" />;
  };
  
  const getTitle = () => {
    if (isCorrect) return "Correct!";
    if (isTimeout) return "Time's up!";
    return "Incorrect";
  };
  
  const getBackgroundColor = () => {
    if (isCorrect) return "bg-green-50";
    if (isTimeout) return "bg-yellow-50";
    return "bg-red-50";
  };
  
  return (
    <StandardPopup 
      isOpen={true} 
      onClose={onContinue}
      showCloseButton={false}
      size="md"
    >
      <div className={`rounded-lg p-5 ${getBackgroundColor()}`}>
        <div className="flex items-center gap-3 mb-3">
          {getIcon()}
          <h3 className="text-xl font-bold">{getTitle()}</h3>
        </div>
        
        {!isCorrect && !isTimeout && (
          <div className="mb-4">
            <p className="font-medium mb-1">The correct answer was:</p>
            <p className="text-gray-800 font-bold">{correctAnswer}</p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-700">{explanation}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Next question in {timeLeft}s
          </div>
          
          <button 
            onClick={onContinue}
            className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            <span>Continue</span>
            <ChevronDown size={16} />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-1 mt-4 rounded-full overflow-hidden">
          <div 
            className="h-1 bg-orange-500 transition-all duration-1000 ease-linear" 
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
      </div>
    </StandardPopup>
  );
};

export default AnswerNotification;
