// components/VQLN/GameModePopup.js
import React from 'react';
import { Award, Zap, Video } from 'lucide-react';

const GameModePopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Popup content */}
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6 relative z-10 animate-scaleIn">
        <div className="mb-4 flex justify-center">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-full">
            <Zap size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-3 text-center text-orange-500">
          Game Mode Activated!
        </h2>
        
        <p className="text-gray-700 mb-5 text-center">
          You've completed the tutorial. Now you'll earn rewards for answering correctly!
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-orange-50 p-3 rounded-lg">
            <div className="bg-orange-100 p-2 rounded-full shrink-0">
              <Video size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="font-semibold">Every 2 correct answers</p>
              <p className="text-sm text-gray-600">Earn 1 video reward</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 bg-yellow-50 p-3 rounded-lg">
            <div className="bg-yellow-100 p-2 rounded-full shrink-0">
              <Award size={20} className="text-yellow-500" />
            </div>
            <div>
              <p className="font-semibold">Streak milestones (5, 10, 15...)</p>
              <p className="text-sm text-gray-600">Earn bonus videos!</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-full font-medium transition-all duration-200 hover:shadow-lg"
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
};

export default GameModePopup;
