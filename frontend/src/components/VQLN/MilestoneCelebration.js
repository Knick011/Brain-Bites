// components/VQLN/MilestoneCelebration.js
import React, { useEffect, useState } from 'react';
import { Award, ChevronUp, Video } from 'lucide-react';

const MilestoneCelebration = ({ milestone, onClose }) => {
  const [visible, setVisible] = useState(true);
  
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
      setVisible(false);
      setTimeout(onClose, 500); // Allow for fade-out animation
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-xl p-6 text-center max-w-sm mx-4 transform transition-transform duration-500 scale-110">
        <div className="mb-4 flex justify-center">
          <div className="bg-orange-500 text-white rounded-full p-4">
            <Award size={40} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Streak Milestone!</h2>
        <p className="text-lg mb-4">You've answered {milestone} questions correctly in a row!</p>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Video size={24} className="text-orange-500" />
          <ChevronUp size={24} className="text-green-500" />
          <span className="text-xl font-bold">+1 Video Reward</span>
        </div>
        
        <button 
          onClick={onClose}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default MilestoneCelebration;
