// components/VQLN/SwipeNavigation.js
import React, { useEffect, useRef, useState } from 'react';

/**
 * Component to add swipe navigation functionality 
 * similar to TikTok/Instagram reels with animation
 */
const SwipeNavigation = ({ onSwipeUp, threshold = 100 }) => {
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const touchMoveRef = useRef(null);
  const [swiping, setSwiping] = useState(false);
  const [swipeAmount, setSwipeAmount] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartRef.current = e.targetTouches[0].clientY;
      setSwiping(false);
      setSwipeAmount(0);
    };
    
    const handleTouchMove = (e) => {
      touchMoveRef.current = e.targetTouches[0].clientY;
      
      if (touchStartRef.current && touchMoveRef.current) {
        const currentDistance = touchStartRef.current - touchMoveRef.current;
        
        // Only track upward swipes
        if (currentDistance > 0) {
          setSwiping(true);
          setSwipeAmount(currentDistance);
          
          // Apply transform to current content
          const content = document.querySelector('.question-container, .video-container');
          if (content) {
            // Limit the transform to avoid pulling too far
            const maxTransform = Math.min(currentDistance * 0.3, window.innerHeight * 0.3);
            content.style.transform = `translateY(-${maxTransform}px)`;
            content.style.transition = 'none'; // Disable transition during drag
          }
        }
      }
    };
    
    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchMoveRef.current) return;
      
      const distance = touchStartRef.current - touchMoveRef.current;
      
      // Reset content position
      const content = document.querySelector('.question-container, .video-container');
      if (content) {
        content.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        content.style.transform = '';
      }
      
      // Detect upward swipe
      if (distance > threshold) {
        // Show flash effect
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 300);
        
        // Trigger swipe action
        onSwipeUp();
      }
      
      // Reset touch positions
      touchStartRef.current = null;
      touchMoveRef.current = null;
      setSwiping(false);
      setSwipeAmount(0);
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
  
  return (
    <>
      {/* Flash effect when swiping */}
      <div className={`swipe-flash ${showFlash ? 'active' : ''}`}></div>
    </>
  );
};

export default SwipeNavigation;
