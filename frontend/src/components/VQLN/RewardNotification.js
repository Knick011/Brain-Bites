// components/VQLN/RewardNotification.js
import React, { useEffect, useState } from 'react';
import { Video, Gift } from 'lucide-react';
import StandardPopup from './Common/StandardPopup';

/**
 * Reward Notification Popup
 * 
 * @param {Object} props
 * @param {boolean} props.isVisible - Whether the popup is visible
 * @param {function} props.onClose - Function to call when closing
 * @param {number} props.rewardCount - Number of rewards earned
 */
const RewardNotification = ({ isVisible, onClose, rewardCount = 1 }) => {
  const [visible, setVisible] = useState(isVisible);
  
  useEffect(() => {
    setVisible(isVisible);
    
    // Auto-hide after 3 seconds
    if (isVisible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose && onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  
  if (!visible) return null;
  
  return (
    <StandardPopup 
      isOpen={visible} 
      onClose={() => {
        setVisible(false);
        onClose && onClose();
      }}
      showCloseButton={false}
      size="sm"
    >
      <div className="text-center">
        <div className="mb-4 inline-flex justify-center">
          <div className="bg-orange-500 text-white rounded-full p-4">
            <Gift size={36} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">New Reward!</h2>
        
        <p className="text-lg mb-4">
          {rewardCount === 1 
            ? "You've earned a video reward!" 
            : `You've earned ${rewardCount} video rewards!`}
        </p>
        
        <div className="flex items-center justify-center gap-2 mb-5 p-3 bg-orange-50 rounded-lg">
          <Video size={24} className="text-orange-500" />
          <span className="text-xl font-bold">+{rewardCount}</span>
          <span className="text-gray-500">added to your collection</span>
        </div>
        
        <button 
          onClick={() => {
            setVisible(false);
            onClose && onClose();
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
        >
          Awesome!
        </button>
      </div>
    </StandardPopup>
  );
};

export default RewardNotification;
