// components/VQLN/GameModePopup.js
import React from 'react';
import { Award, Video, Zap } from 'lucide-react';
import StandardPopup from './Common/StandardPopup';

const GameModePopup = ({ onClose }) => {
  return (
    <StandardPopup 
      isOpen={true} 
      onClose={onClose}
      title="Game Mode Activated!"
      size="md"
      showCloseButton={false}
    >
      <div className="text-center mb-5">
        <div className="inline-flex mb-4 p-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full">
          <Zap size={36} />
        </div>
        
        <p className="mb-6 text-gray-700 text-base">
          You've completed the tutorial. Now you'll earn rewards for answering correctly!
        </p>
      </div>
      
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
      
      <div className="flex justify-center">
        <button 
          onClick={onClose}
          className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          Let's Go!
        </button>
      </div>
    </StandardPopup>
  );
};

export default GameModePopup;
