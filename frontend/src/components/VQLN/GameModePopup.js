// components/VQLN/GameModePopup.js
import React from 'react';
import { Zap, Award, Video } from 'lucide-react';

const GameModePopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-md text-center animate-scaleIn">
        <div className="mb-4 flex justify-center">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full p-4">
            <Zap size={40} />
          </div>
        </div>
      
        <h2 className="text-2xl font-bold mb-3 text-gradient bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Game Mode Activated!</h2>
        <p className="mb-6 text-gray-700">You've completed the tutorial. Now you'll earn rewards for answering correctly!</p>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-orange-50 rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <Video size={20} className="text-orange-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Every 2 correct answers</p>
              <p className="text-gray-600">Earn 1 video reward</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Award size={20} className="text-yellow-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-800">Streak milestones (5, 10, 15...)</p>
              <p className="text-gray-600">Earn bonus videos!</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
};

export default GameModePopup;
