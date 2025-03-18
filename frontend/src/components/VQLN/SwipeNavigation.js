// components/VQLN/SwipeNavigation.js
import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp, ArrowDown } from 'lucide-react';

/**
 * Enhanced SwipeNavigation component with better touch and keyboard support
 */
const SwipeNavigation = ({ 
  onSwipeUp, 
  threshold = 70, 
  isTutorial = false, 
  enabled = false,
  isVideo = false
}) => {
  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);
  const [swiping, setSwiping] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  
  // Show indicator based on mode
  useEffect(() => {
    if (enabled) {
      setShowIndicator(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
    }
  }, [enabled]);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (e) => {
      // Use Down Arrow, Space, or Enter keys for navigation
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault(); // Prevent default scrolling behavior
        console.log("Key pressed for navigation:", e.key);
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
          onSwipeUp && onSwipeUp();
          
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
    const targetElement = isVideo ? 
      document.querySelector('.video-container') : 
      document;
    
    if (targetElement) {
      targetElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      targetElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      targetElement.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      if (targetElement) {
        targetElement.removeEventListener('touchstart', handleTouchStart);
        targetElement.removeEventListener('touchmove', handleTouchMove);
        targetElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [threshold, enabled, onSwipeUp, isVideo]);
  
  return (
    <>
      {/* Visual indicator for swipe/keyboard navigation */}
      {showIndicator && enabled && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 text-center">
          <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse shadow-lg">
            <ChevronUp size={20} />
            <span className="text-sm font-medium">Swipe up or press ↓ to continue</span>
            <ArrowDown size={20} />
          </div>
        </div>
      )}
      
      {/* Add CSS for the flash effect */}
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
          50% { opacity: 0.7; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default SwipeNavigation;
