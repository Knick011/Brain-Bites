import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * Enhanced SwipeNavigation component that captures swipes on top of videos
 * and prevents interaction with video elements
 */
const SwipeNavigation = ({ 
  onSwipeUp, 
  threshold = 70, 
  enabled = false,
  isVideo = false,
  minimalUI = true  // New prop to control UI visibility
}) => {
  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);
  const [swiping, setSwiping] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  
  // Show indicator based on mode
  useEffect(() => {
    if (enabled) {
      setShowIndicator(true);
      
      // Auto-hide after 3 seconds for minimal UI experience
      const timer = setTimeout(() => {
        setShowIndicator(minimalUI ? false : true);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
    }
  }, [enabled, minimalUI]);
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!enabled) return;
    
    const handleKeyDown = (e) => {
      // Use Down Arrow key for navigation
      if (e.key === 'ArrowDown') {
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
    
    // Create an invisible overlay for video container to prevent interaction
    if (isVideo) {
      const videoContainer = document.querySelector('.video-container');
      
      if (videoContainer) {
        // Check if overlay already exists
        let swipeOverlay = document.getElementById('video-swipe-overlay');
        
        if (!swipeOverlay) {
          // Create overlay if it doesn't exist
          swipeOverlay = document.createElement('div');
          swipeOverlay.id = 'video-swipe-overlay';
          swipeOverlay.style.position = 'absolute';
          swipeOverlay.style.inset = '0';
          swipeOverlay.style.zIndex = '10';
          swipeOverlay.style.cursor = 'default';
          
          videoContainer.style.position = 'relative';
          videoContainer.appendChild(swipeOverlay);
          
          // Add event listeners to the overlay
          swipeOverlay.addEventListener('touchstart', handleTouchStart, { passive: true });
          swipeOverlay.addEventListener('touchmove', handleTouchMove, { passive: false });
          swipeOverlay.addEventListener('touchend', handleTouchEnd);
          
          // Return cleanup function
          return () => {
            if (swipeOverlay && videoContainer.contains(swipeOverlay)) {
              swipeOverlay.removeEventListener('touchstart', handleTouchStart);
              swipeOverlay.removeEventListener('touchmove', handleTouchMove);
              swipeOverlay.removeEventListener('touchend', handleTouchEnd);
              videoContainer.removeChild(swipeOverlay);
            }
          };
        }
      }
    } else {
      // Add event listeners to document for non-video content
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [threshold, enabled, onSwipeUp, isVideo]);
  
  return (
    <>
      {/* Simplified visual indicator for swipe navigation */}
      {showIndicator && enabled && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 text-center">
          <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
            <ChevronUp size={20} />
            <span className="text-sm font-medium">Swipe up to continue</span>
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
          50% { opacity: 0.3; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  );
};

export default SwipeNavigation;
