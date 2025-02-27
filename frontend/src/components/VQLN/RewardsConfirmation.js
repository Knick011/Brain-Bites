// components/VQLN/RewardsConfirmation.js
import React from 'react';
import { Video, AlertTriangle, X, Check } from 'lucide-react';

const RewardsConfirmation = ({ onConfirm, onCancel, remainingVideos }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl animate-scaleIn">
        <div className="flex items-center mb-4 gap-3">
          <div className="p-2 bg-orange-100 rounded-full">
            <AlertTriangle className="text-orange-500" size={24} />
          </div>
          <h2 className="text-xl font-bold">Exit Rewards?</h2>
        </div>
        
        <p className="mb-4 text-gray-600">
          You still have {remainingVideos} {remainingVideos === 1 ? 'video' : 'videos'} left to watch. 
          Are you sure you want to exit and return to questions?
        </p>
        
        <div className="flex justify-center items-center gap-3 mb-4">
          <Video size={20} className="text-orange-500" />
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
    </div>
  );
};

export default RewardsConfirmation;
