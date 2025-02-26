// components/VQLN/ScoreDisplay.js
import React from 'react';
import { Award } from 'lucide-react';

const ScoreDisplay = ({ score, timeMode }) => {
  if (!timeMode) return null;
  
  return (
    <div className="fixed top-4 right-4 z-40 bg-white shadow-md rounded-full px-4 py-2 flex items-center gap-2 animate-fadeIn">
      <Award size={20} className="text-orange-500" />
      <span className="font-bold text-lg">{score}</span>
    </div>
  );
};

export default ScoreDisplay;
