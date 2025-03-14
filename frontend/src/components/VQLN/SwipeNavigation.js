// components/VQLN/SwipeNavigation.js
import { useEffect, useRef } from 'react';

/**
 * Component to add swipe navigation functionality 
 * similar to TikTok/Instagram reels
 */
const SwipeNavigation = ({ onSwipeUp, threshold = 100 }) => {
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartRef.current = e.targetTouches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      touchEndRef.current = e.targetTouches[0].clientY;
    };
    
    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchEndRef.current) return;
      
      const distance = touchStartRef.current - touchEndRef.current;
      
      // Detect upward swipe
      if (distance > threshold) {
        onSwipeUp();
      }
      
      // Reset touch positions
      touchStartRef.current = null;
      touchEndRef.current = null;
    };
    
    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeUp, threshold]);
  
  // This component doesn't render anything visible
  return null;
};

export default SwipeNavigation;
