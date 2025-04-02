// components/VQLN/SkipTutorialButton.js
import React from 'react';
import { FastForward } from 'lucide-react';

/**
 * Skip Tutorial Button Component
 * 
 * @param {Object} props
 * @param {Function} props.onSkip - Function to call when skipping tutorial
 */
const SkipTutorialButton = ({ onSkip }) => {
  return (
    <button
      onClick={onSkip}
      className="fixed bottom-20 right-4 z-50 bg-white text-orange-500 border border-orange-300 shadow-md px-4 py-2 rounded-full flex items-center gap-2 hover:bg-orange-50 transition-colors"
      aria-label="Skip tutorial"
    >
      <FastForward size={18} />
      <span className="font-medium">Skip Tutorial</span>
    </button>
  );
};

export default SkipTutorialButton;
