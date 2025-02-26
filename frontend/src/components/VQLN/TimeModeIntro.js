// components/VQLN/TimeModeIntro.js
import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';

const TimeModeIntro = ({ onClose }) => {
  const [visible, setVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(5);
  
  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Allow for fade-out animation
    }, 5000);
    
    return () => {
      clearInterval(countdownInterval);
      clearTimeout(timer);
    };
  }, [onClose]);
  
  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-xl p-6 text-center max-w-sm mx-4">
        <div className="mb-4 flex justify-center">
          <div className="bg-blue-600 text-white rounded-full p-4">
            <Clock size={40} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Time Mode Activated!</h2>
        <p className="mb-4">You now have 10 seconds to answer each question.</p>
        <p className="mb-4">Answer quickly for more points!</p>
        
        <div className="flex justify-center items-center gap-2 mb-4">
          <Zap size={24} className="text-yellow-500" />
          <span className="text-lg font-medium">Fast = More Points</span>
        </div>
        
        <div className="w-full bg-gray-200 h-1 mt-4 rounded-full overflow-hidden">
          <div 
            className="h-1 bg-orange-500 transition-all duration-1000 ease-linear" 
            style={{ width: `${(timeRemaining / 5) * 100}%` }}
          ></div>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          Continues in {timeRemaining}...
        </div>
      </div>
    </div>
  );
};

export default TimeModeIntro;
