// components/VQLN/MilestoneCelebration.js
import React, { useEffect } from 'react';
import { Award, ChevronUp, Video } from 'lucide-react';
import StandardPopup from './Common/StandardPopup';

const MilestoneCelebration = ({ milestone, onClose }) => {
  useEffect(() => {
    // Try to load confetti if available
    const tryConfetti = () => {
      if (typeof window !== 'undefined' && window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    };
    
    tryConfetti();
    
    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <StandardPopup 
      isOpen={true} 
      onClose={onClose}
      showCloseButton={false}
      size="sm"
    >
      <div className="text-center">
        <div className="mb-4 inline-flex justify-center">
          <div className="bg-orange-500 text-white rounded-full p-4">
            <Award size={40} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Streak Milestone!</h2>
        <p className="text-lg mb-4">You've answered {milestone} questions correctly in a row!</p>
        
        <div className="flex items-center justify-center gap-2 mb-5 p-3 bg-orange-50 rounded-lg">
          <Video size={24} className="text-orange-500" />
          <ChevronUp size={24} className="text-green-500" />
          <span className="text-xl font-bold">+1 Video Reward</span>
        </div>
        
        <button 
          onClick={onClose}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
        >
          Continue
        </button>
      </div>
    </StandardPopup>
  );
};

export default MilestoneCelebration;
