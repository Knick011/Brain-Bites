// Updated AllDoneMessage.js with auto-transition
import React, { useEffect, useState } from 'react';
import { CheckCircle, Video } from 'lucide-react';
import StandardPopup from './Common/StandardPopup';

const AllDoneMessage = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [counter, setCounter] = useState(3);
  
  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Auto-hide after 3 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 3000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(hideTimer);
    };
  }, [onClose]);
  
  if (!isVisible) return null;
  
  return (
    <StandardPopup 
      isOpen={true} 
      onClose={() => {
        setIsVisible(false);
        if (onClose) onClose();
      }}
      showCloseButton={false}
      size="sm"
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle className="text-green-500" size={32} />
        </div>
        
        <h3 className="text-xl font-bold mb-2">All Videos Watched!</h3>
        
        <p className="text-gray-600 mb-4">
          You've watched all your reward videos. Answer more questions correctly to earn more rewards!
        </p>
        
        <div className="flex items-center gap-2 text-orange-500 justify-center mb-4">
          <Video size={20} />
          <span className="font-medium">Keep learning to earn more</span>
        </div>
        
        {/* Progress bar for auto-continue */}
        <div className="w-full bg-gray-200 h-1 mt-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(counter / 3) * 100}%` }}
          ></div>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          Continuing in {counter}...
        </div>
      </div>
    </StandardPopup>
  );
};

export default AllDoneMessage;
