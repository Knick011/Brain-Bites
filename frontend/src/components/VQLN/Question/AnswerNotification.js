// components/VQLN/Question/AnswerNotification.js
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronUp } from 'lucide-react';

/**
 * Answer notification component with minimal "swipe to continue" text
 */
const AnswerNotification = ({ 
  isCorrect, 
  isTimeout = false, 
  explanation, 
  correctAnswer,
  tutorialMode = false
}) => {
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
          
          {/* Simple swipe instruction text - no UI controls or buttons */}
          <div className="text-center mt-4 text-gray-500 flex items-center justify-center gap-1">
            <ChevronUp size={16} />
            <span className="text-sm">Swipe up to continue</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerNotification;
