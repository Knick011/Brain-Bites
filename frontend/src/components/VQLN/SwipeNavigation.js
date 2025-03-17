// components/VQLN/SwipeNavigation.js
import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * Component to add swipe navigation functionality similar to TikTok/Instagram reels
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
          const content = document.querySelector('.swipe-content');
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
      
      // Reset content position with transition
      const content = document.querySelector('.swipe-content');
      if (content) {
        content.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // If swipe threshold met, trigger the transition animation
        if (distance > threshold) {
          content.classList.add('exiting');
          
          // Show flash effect
          setShowFlash(true);
          setTimeout(() => setShowFlash(false), 300);
          
          // Set up the next content to slide in from bottom
          setTimeout(() => {
            // Trigger swipe action (this will change content)
            onSwipeUp();
            
            // Get the new content element and animate it
            setTimeout(() => {
              const newContent = document.querySelector('.swipe-content');
              if (newContent) {
                newContent.classList.add('entering');
                // Remove classes after animation completes
                setTimeout(() => {
                  if (newContent) {
                    newContent.classList.remove('entering');
                  }
                }, 500);
              }
            }, 50);
          }, 250); // Trigger just before the exit animation completes
        } else {
          // Reset if threshold not met
          content.style.transform = '';
        }
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
      
      {/* Swipe indicator */}
      <div className="swipe-indicator">
        <div className="swipe-indicator-circle">
          <ChevronUp />
        </div>
        <div className="swipe-indicator-text">
          Swipe up
        </div>
      </div>
    </>
  );
};

export default SwipeNavigation;
