// components/VQLN/RewardsButton.js
import React, { useState } from 'react';
import { Video, X } from 'lucide-react';

const RewardsButton = ({ availableVideos, onWatchVideo }) => {
  const [showRewards, setShowRewards] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setShowRewards(true)}
        className="fixed top-4 left-4 z-50 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors shadow-md"
      >
        <Video size={20} />
        <span className="font-medium">{availableVideos}</span>
      </button>
      
      {showRewards && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Rewards</h2>
              <button 
                onClick={() => setShowRewards(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 mb-2">
                <Video size={32} />
              </div>
              <p className="text-3xl font-bold">{availableVideos}</p>
              <p className="text-gray-600">Available Videos</p>
            </div>
            
            {availableVideos > 0 ? (
              <button 
                onClick={() => {
                  onWatchVideo();
                  setShowRewards(false);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Watch Now
              </button>
            ) : (
              <div className="text-center text-gray-600 bg-gray-100 rounded-lg p-4">
                <p>Answer more questions correctly to earn video rewards!</p>
                <p className="text-sm mt-2">Get a streak of 5 correct answers for your next reward.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RewardsButton;
