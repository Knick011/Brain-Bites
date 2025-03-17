// components/VQLN/GameModePopup.js
import React, { useEffect } from 'react';
import { Award, Video, Zap } from 'lucide-react';

/**
 * Enhanced Game Mode Popup Component
 */
const GameModePopup = ({ onClose }) => {
  // Auto-close after 10 seconds to ensure it doesn't get stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose && onClose();
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-2xl animate-scaleIn">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex mb-4 p-4 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full text-white">
              <Zap size={36} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Game Mode Activated!</h2>
            
            <p className="text-gray-600 mb-5">
              You've completed the tutorial. Now you'll earn rewards for answering correctly!
            </p>
          </div>
          
          {/* Rewards Info */}
          <div className="grid gap-4 mb-6">
            <div className="bg-orange-50 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Video size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Every 2 correct answers</p>
                <p className="text-gray-600 text-sm">Earn 1 video reward</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Award size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Streak milestones (5, 10, 15...)</p>
                <p className="text-gray-600 text-sm">Earn bonus videos!</p>
              </div>
            </div>
          </div>
          
          {/* Button */}
          <button 
            onClick={() => onClose && onClose()}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModePopup;
