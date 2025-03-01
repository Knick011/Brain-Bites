// components/VQLN/RewardsConfirmation.js
import React from 'react';
import { Video, AlertTriangle, X, Check } from 'lucide-react';
import StandardPopup from './Common/StandardPopup';

const RewardsConfirmation = ({ onConfirm, onCancel, remainingVideos }) => {
  return (
    <StandardPopup 
      isOpen={true} 
      onClose={onCancel}
      title="Exit Rewards?"
      size="md"
    >
      <div>
        <p className="mb-4 text-gray-600">
          You still have {remainingVideos} {remainingVideos === 1 ? 'video' : 'videos'} left to watch. 
          Are you sure you want to exit and return to questions?
        </p>
        
        <div className="flex justify-center items-center gap-3 mb-5 p-4 bg-orange-50 rounded-lg">
          <Video size={24} className="text-orange-500" />
          <span className="text-xl font-bold text-orange-500">{remainingVideos}</span>
          <span className="text-gray-500">remaining</span>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
            <span>Cancel</span>
          </button>
          
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            <Check size={18} />
            <span>Exit Anyway</span>
          </button>
        </div>
      </div>
    </StandardPopup>
  );
};

export default RewardsConfirmation;
