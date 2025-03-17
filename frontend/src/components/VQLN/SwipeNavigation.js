// components/VQLN/SwipeNavigation.js
import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * Enhanced SwipeNavigation component with TikTok-style transitions
 * Works anywhere on the screen with fun indicator only in tutorial mode
 */
const SwipeNavigation = ({ onSwipeUp, threshold = 100, isTutorial = false, showAfterAction = false }) => {
  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);
  const [swiping, setSwiping] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  
  // Show indicator only in tutorial mode after answering question
  useEffect(() => {
    // Only show indicator for tutorial and after action
    if (isTutorial && showAfterAction) {
      setShowIndicator(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
    }
  }, [isTutorial, showAfterAction]);
  
  useEffect(() => {
    // Add TikTok-style class to the body for global styling
    document.body.classList.add('tiktok-style');
    
    // Apply necessary class to current content
    const content = document.querySelector('.swipe-content');
    if (content) {
      content.classList.add('current-content');
    }
    
    return () => {
      document.body.classList.remove('tiktok-style');
    };
  }, []);
  
  useEffect(() => {
    // Make entire document swipeable
    const handleTouchStart = (e) => {
      touchStartRef.current = e.targetTouches[0].clientY;
      touchMoveRef.current = e.targetTouches[0].clientY;
      setSwiping(false);
    };
    
    const handleTouchMove = (e) => {
      if (!touchStartRef.current) return;
      
      touchMoveRef.current = e.targetTouches[0].clientY;
      const distance = touchStartRef.current - touchMoveRef.current;
      
      // Only respond to upward swipes
      if (distance > 0) {
        setSwiping(true);
        
        // Apply TikTok-style transform to current content
        const content = document.querySelector('.current-content');
        if (content) {
          // Scale and translate with opacity change
          const movePercent = Math.min((distance / window.innerHeight) * 100, 25);
          const scaleValue = 1 - (movePercent / 100);
          const opacityValue = 1 - (movePercent / 25);
          
          content.style.transform = `translateY(-${movePercent}%) scale(${scaleValue})`;
          content.style.opacity = opacityValue;
          content.style.transition = 'none'; // No transition during manual drag
        }
        
        // Prevent default to avoid page scrolling
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchMoveRef.current) return;
      
      const distance = touchStartRef.current - touchMoveRef.current;
      const content = document.querySelector('.current-content');
      
      if (content) {
        // Add smooth transition for the completion of the swipe
        content.style.transition = 'transform 0.35s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.35s cubic-bezier(0.19, 1, 0.22, 1)';
        
        if (distance > threshold) {
          // Complete the exit animation with TikTok-style
          content.style.transform = 'translateY(-100%) scale(0.8)';
          content.style.opacity = '0';
          
          // Create a flash effect for transition
          const flash = document.createElement('div');
          flash.className = 'tiktok-flash';
          document.body.appendChild(flash);
          
          // Trigger the swipe action after animation
          setTimeout(() => {
            onSwipeUp();
            document.body.removeChild(flash);
            
            // Set up the next content with TikTok entrance animation
            setTimeout(() => {
              const newContent = document.querySelector('.swipe-content');
              if (newContent) {
                newContent.classList.add('current-content');
                newContent.style.transition = 'transform 0.35s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.35s cubic-bezier(0.19, 1, 0.22, 1)';
                newContent.style.transform = 'translateY(0) scale(1)';
                newContent.style.opacity = '1';
              }
            }, 50);
          }, 300);
        } else {
          // Reset if swipe was not strong enough
          content.style.transform = 'translateY(0) scale(1)';
          content.style.opacity = '1';
        }
      }
      
      // Reset touch values
      touchStartRef.current = null;
      touchMoveRef.current = null;
      setSwiping(false);
    };
    
    // Add event listeners to entire document
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeUp, threshold]);
  
  return (
    <>
      {/* Fun swipe indicator only shown in tutorial mode after answering */}
      {showIndicator && (
        <div className="fun-swipe-indicator-container">
          <div className="fun-swipe-indicator">
            <div className="indicator-ring"></div>
            <div className="indicator-arrow">
              <ChevronUp size={24} strokeWidth={3} />
            </div>
            <div className="indicator-text">Swipe up to continue</div>
          </div>
        </div>
      )}
    </>
  );
};

export default SwipeNavigation;
