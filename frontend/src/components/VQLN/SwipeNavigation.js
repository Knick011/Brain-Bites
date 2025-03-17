// components/VQLN/SwipeNavigation.js
import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * Enhanced SwipeNavigation component with TikTok-style transitions
 * Only enabled after user answers a question and only on the explanation popup
 */
const SwipeNavigation = ({ 
  onSwipeUp, 
  threshold = 100, 
  isTutorial = false, 
  enabled = false,
  isVideo = false
}) => {
  const touchStartRef = useRef(null);
  const touchMoveRef = useRef(null);
  const [swiping, setSwiping] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  
  // Show indicator automatically in tutorial mode
  useEffect(() => {
    if (isTutorial && enabled) {
      setShowIndicator(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
    }
  }, [isTutorial, enabled]);
  
  // Set up swipe handlers and keyboard navigation
  useEffect(() => {
    // Don't add event listeners if not enabled
    if (!enabled) return;
    
    // Add TikTok-style class to the body for global styling
    document.body.classList.add('tiktok-style');
    
    // Apply necessary class to current content
    const content = document.querySelector('.swipe-content');
    if (content) {
      content.classList.add('current-content');
    }
    
    // Add keyboard event listener for down arrow key
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        // Trigger the same animation and callback as a swipe up
        const content = document.querySelector('.current-content');
        if (content) {
          // Add smooth transition
          content.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
          
          // Execute animation
          content.style.transform = 'translateY(-100%) scale(0.8)';
          content.style.opacity = '0';
          
          // Create next content container that will come from bottom
          const nextContent = document.createElement('div');
          nextContent.className = 'next-content swipe-content';
          nextContent.style.transform = 'translateY(100%) scale(0.9)';
          nextContent.style.opacity = '0';
          document.body.appendChild(nextContent);
          
          // Trigger the swipe action after animation
          setTimeout(() => {
            // Execute the callback
            onSwipeUp();
            
            // Remove the temporary element
            if (document.body.contains(nextContent)) {
              document.body.removeChild(nextContent);
            }
            
            // Wait a bit then set up the new content with TikTok entrance animation
            setTimeout(() => {
              const newContent = document.querySelector('.swipe-content');
              if (newContent) {
                newContent.classList.add('current-content');
                newContent.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
                newContent.style.transform = 'translateY(0) scale(1)';
                newContent.style.opacity = '1';
              }
            }, 100);
          }, 450);
        }
      }
    };
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.classList.remove('tiktok-style');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onSwipeUp]);
  
  useEffect(() => {
    // Don't add event listeners if not enabled
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
    
    // Handle touch end
    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchMoveRef.current) return;
      
      const distance = touchStartRef.current - touchMoveRef.current;
      const content = document.querySelector('.current-content');
      
      if (content) {
        // Add smooth transition for the completion of the swipe
        content.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
        
        if (distance > threshold) {
          // Complete the exit animation with TikTok-style
          content.style.transform = 'translateY(-100%) scale(0.8)';
          content.style.opacity = '0';
          
          // Create next content container that will come from bottom
          const nextContent = document.createElement('div');
          nextContent.className = 'next-content swipe-content';
          nextContent.style.transform = 'translateY(100%) scale(0.9)';
          nextContent.style.opacity = '0';
          document.body.appendChild(nextContent);
          
          // Trigger the swipe action after animation
          setTimeout(() => {
            // Execute the callback
            onSwipeUp();
            
            // Remove the temporary element
            if (document.body.contains(nextContent)) {
              document.body.removeChild(nextContent);
            }
            
            // Wait a bit then set up the new content with TikTok entrance animation
            setTimeout(() => {
              const newContent = document.querySelector('.swipe-content');
              if (newContent) {
                newContent.classList.add('current-content');
                newContent.style.transition = 'transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)';
                newContent.style.transform = 'translateY(0) scale(1)';
                newContent.style.opacity = '1';
              }
            }, 100);
          }, 450); // Slightly longer to let the animation complete
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
    
    // Add event listeners to entire document or to video element for videos
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
  }, [onSwipeUp, threshold, enabled, isVideo]);
  
  return (
    <>
      {/* Show swipe indicator only when enabled */}
      {showIndicator && enabled && (
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
