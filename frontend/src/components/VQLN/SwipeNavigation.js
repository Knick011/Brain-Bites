// components/VQLN/SwipeNavigation.js
import React, { useEffect, useRef, useState } from 'react';

/**
 * Enhanced SwipeNavigation component with improved handling
 */
const SwipeNavigation = ({ 
  onSwipeUp, 
  threshold = 70, 
  isTutorial = false, 
  enabled = false,
  isVideo = false,
  inRewardsFlow = false, 
  autoAdvanceDelay = 0 // Set to 0 to disable auto-advance
}) => {
  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);
  const [swiping, setSwiping] = useState(false);
  
  // Auto-advance timer (only if enabled and delay > 0)
  useEffect(() => {
    let timer;
    if (enabled && autoAdvanceDelay > 0) {
      timer = setTimeout(() => {
        onSwipeUp && onSwipeUp();
      }, autoAdvanceDelay);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [enabled, onSwipeUp, autoAdvanceDelay]);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (e) => {
      // Use Down Arrow, Space, or Enter keys for navigation
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault(); // Prevent default scrolling behavior
        onSwipeUp && onSwipeUp();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onSwipeUp]);
  
  // Handle touch events
  useEffect(() => {
    if (!enabled) return;
    
    // Handle touch start
    const handleTouchStart = (e) => {
      touchStartRef.current = e.targetTouches[0].clientY;
      touchMoveRef.current = e.targetTouches[0].clientY;
      setSwiping(false);
    };
    
    // Handle touch move
    const handleTouchMove = (e) => {
      if (!touchStartRef.current) return;
      
      touchMoveRef.current = e.targetTouches[0].clientY;
      const distance = touchStartRef.current - touchMoveRef.current;
      
      // Only respond to upward swipes
      if (distance > 20) {
        setSwiping(true);
        
        // Apply visual feedback during swipe
        const content = document.querySelector('.swipe-content');
        if (content) {
          const movePercent = Math.min((distance / window.innerHeight) * 100, 20);
          const scaleValue = 1 - (movePercent / 100);
          const opacityValue = 1 - (movePercent / 25);
          
          content.style.transform = `translateY(-${movePercent}%) scale(${scaleValue})`;
          content.style.opacity = opacityValue;
          content.style.transition = 'none'; // No transition during drag
        }
        
        // Prevent default to avoid page scrolling
        e.preventDefault();
      }
    };
    
    // Handle touch end
    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchMoveRef.current) return;
      
      const distance = touchStartRef.current - touchMoveRef.current;
      const content = document.querySelector('.swipe-content');
      
      // Add transition for smooth animation
      if (content) {
        content.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      }
      
      if (distance > threshold) {
        // Complete the swipe animation
        if (content) {
          content.style.transform = 'translateY(-100%) scale(0.8)';
          content.style.opacity = '0';
        }
        
        // Flash effect for feedback
        const flash = document.createElement('div');
        flash.className = 'swipe-flash active';
        document.body.appendChild(flash);
        
        // Call the swipe callback after animation
        setTimeout(() => {
          if (onSwipeUp) {
            console.log("Swipe navigation triggering callback");
            onSwipeUp();
          }
          
          // Remove flash effect
          if (document.body.contains(flash)) {
            document.body.removeChild(flash);
          }
        }, 300);
      } else {
        // Reset if swipe was not strong enough
        if (content) {
          content.style.transform = 'translateY(0) scale(1)';
          content.style.opacity = '1';
        }
      }
      
      // Reset touch values
      touchStartRef.current = null;
      touchMoveRef.current = null;
      setSwiping(false);
    };
    
    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [threshold, enabled, onSwipeUp]);
  
  return (
    <>
      <style jsx>{`
        .swipe-flash {
          position: fixed;
          inset: 0;
          background-color: rgba(255, 255, 255, 0.15);
          z-index: 999;
          pointer-events: none;
          opacity: 0;
        }
        
        .swipe-flash.active {
          animation: flash 0.3s forwards;
        }
        
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 0.3; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default SwipeNavigation;
