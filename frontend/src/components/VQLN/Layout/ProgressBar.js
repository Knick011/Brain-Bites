// ProgressBar.js
import React from 'react';
import { Flame } from 'lucide-react';

const ProgressBar = ({ correctAnswers, totalQuestions, streak }) => {
  const percentage = totalQuestions === 0 ? 0 : (correctAnswers / totalQuestions) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-white mb-2">
        <span>Progress</span>
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-orange-500">{streak}</span>
            </div>
          )}
          <span>{correctAnswers} / {totalQuestions} Correct</span>
        </div>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;