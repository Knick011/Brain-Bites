// components/VQLN/StreakCounter.js
import React, { useEffect, useState } from 'react';
import { Flame } from 'lucide-react';

const StreakCounter = ({ streak }) => {
  const [animate, setAnimate] = useState(false);
  const [prevStreak, setPrevStreak] = useState(streak);
  
  // Add animation when streak increases
  useEffect(() => {
    if (streak > prevStreak) {
      setAnimate(true);
      // Reset animation after it completes
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
    setPrevStreak(streak);
  }, [streak, prevStreak]);
  
  const isMilestone = streak > 0 && streak % 5 === 0;
  
  return (
    <div 
      className={`streak-counter ${animate ? 'streak-pulse' : ''} ${isMilestone ? 'milestone' : ''}`}
    >
      <Flame 
        size={16} 
        className={streak > 0 ? 'text-orange-500' : 'text-gray-400'} 
      />
      <span>{streak}</span>
    </div>
  );
};

export default StreakCounter;
