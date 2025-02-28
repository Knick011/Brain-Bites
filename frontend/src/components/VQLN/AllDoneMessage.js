// components/VQLN/AllDoneMessage.js
import React, { useEffect, useState } from 'react';
import { CheckCircle, Video } from 'lucide-react';

const AllDoneMessage = () => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl p-6 max-w-sm text-center animate-scaleIn shadow-xl">
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
    </div>
  );
};

export default AllDoneMessage;
