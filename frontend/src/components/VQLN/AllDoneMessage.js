// components/VQLN/AllDoneMessage.js
import React, { useEffect, useState } from 'react';
import { CheckCircle, Video } from 'lucide-react';
import StandardPopup from './Common/StandardPopup';

const AllDoneMessage = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <StandardPopup 
      isOpen={true} 
      onClose={() => setIsVisible(false)}
      showCloseButton={false}
      size="sm"
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-500" size={32} />
        </div>
        
        <h3 className="text-xl font-bold mb-2">All Videos Watched!</h3>
        
        <p className="text-gray-600 mb-4">
          You've watched all your reward videos. Answer more questions correctly to earn more rewards!
        </p>
        
        <div className="flex items-center gap-2 text-orange-500 justify-center">
          <Video size={20} />
          <span className="font-medium">Keep learning to earn more</span>
        </div>
      </div>
    </StandardPopup>
  );
};

export default AllDoneMessage;
