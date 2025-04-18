// components/VQLN/EnhancedMascotDisplay.js
import React, { useState, useEffect, useRef } from 'react';

const EnhancedMascotDisplay = ({ 
  type = 'happy', 
  position = 'left',
  showMascot = true,
  lastVisit = null,
  onDismiss = null,
  message = null, // Optional speech bubble message
  autoHide = false, // Automatically hide after a duration
  autoHideDuration = 5000 // Duration in ms before auto-hiding
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mascotType, setMascotType] = useState(type);
  const [isWaving, setIsWaving] = useState(false);
  const [isSinking, setIsSinking] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [displayedMessage, setDisplayedMessage] = useState(message);
  const autoHideTimer = useRef(null);
  const sinkTimer = useRef(null);
  const messageTimer = useRef(null);
  const entryDelay = 300;
  
  // Update mascot type when prop changes
  useEffect(() => {
    // Check if returning user after 1+ days
    if (lastVisit && type === 'happy') {
      const daysSinceLastVisit = Math.floor((new Date() - new Date(lastVisit)) / (1000 * 60 * 60 * 24));
      if (daysSinceLastVisit >= 1) {
        setMascotType('depressed');
      } else {
        setMascotType(type);
      }
    } else {
      setMascotType(type);
    }
  }, [type, lastVisit]);
  
  // Handle message updates
  useEffect(() => {
    setDisplayedMessage(message);
  }, [message]);
  
  // Main effect to control visibility and animations
  useEffect(() => {
    // Clear all timers when component unmounts or dependencies change
    const clearAllTimers = () => {
      clearTimeout(sinkTimer.current);
      clearTimeout(autoHideTimer.current);
      clearTimeout(messageTimer.current);
    };
    
    if (showMascot) {
      // Clear any existing timers
      clearAllTimers();
      
      // If we're already showing the peeking mascot and want to show
      // the main mascot, hide the peeking one first
      if (isPeeking) {
        setIsPeeking(false);
      }
      
      // Show the main mascot after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsSinking(false);
        
        // Add a wave animation
        setTimeout(() => {
          setIsWaving(true);
          setTimeout(() => setIsWaving(false), 1000);
        }, 500);
        
        // For messages, display longer (5s) vs standard (3s)
        const displayDuration = displayedMessage ? 5000 : 3000;
        
        // Schedule the mascot to sink after the display duration
        sinkTimer.current = setTimeout(() => {
          setIsSinking(true);
          
          // After sinking animation completes, show peeking mascot
          setTimeout(() => {
            setIsVisible(false);
            setIsPeeking(true);
          }, 500); // Sinking animation duration
        }, displayDuration);
        
        // Set up auto-hide if enabled (overrides sinking behavior)
        if (autoHide) {
          autoHideTimer.current = setTimeout(() => {
            setIsSinking(true);
            setTimeout(() => {
              setIsVisible(false);
              setIsPeeking(true);
              if (onDismiss) onDismiss();
            }, 500);
          }, autoHideDuration);
        }
      }, entryDelay);
      
      return () => {
        clearTimeout(timer);
        clearAllTimers();
      };
    } else {
      // When instructed to hide, hide everything
      setIsVisible(false);
      setIsPeeking(false);
    }
  }, [showMascot, autoHide, autoHideDuration, onDismiss, displayedMessage]);
  
  // Handle new message arrival - reset timers to give user time to read
  useEffect(() => {
    if (isVisible && displayedMessage && !isSinking) {
      // Clear any existing sink timer to give user time to read the message
      clearTimeout(sinkTimer.current);
      
      // Set new sink timer
      sinkTimer.current = setTimeout(() => {
        setIsSinking(true);
        
        // After sinking animation completes, show peeking mascot
        setTimeout(() => {
          setIsVisible(false);
          setIsPeeking(true);
        }, 500); // Matches the duration of the sinking animation
      }, 5000); // 5 seconds for messages
    }
  }, [displayedMessage, isVisible, isSinking]);

  // Handle mascot dismissal
  const handleDismiss = () => {
    setIsSinking(true);
    
    setTimeout(() => {
      setIsVisible(false);
      setIsPeeking(true);
      if (onDismiss) {
        onDismiss();
      }
    }, 500);
  };
  
  // Handle click on peeking mascot
  const handlePeekClick = () => {
    setIsPeeking(false);
    
    setTimeout(() => {
      setIsVisible(true);
      setIsSinking(false);
      
      // Reset sinking timer - sink after 3 seconds (or 5 if has message)
      const displayDuration = displayedMessage ? 5000 : 3000;
      
      clearTimeout(sinkTimer.current);
      sinkTimer.current = setTimeout(() => {
        setIsSinking(true);
        setTimeout(() => {
          setIsVisible(false);
          setIsPeeking(true);
        }, 500);
      }, displayDuration);
    }, 100);
  };
  
  // Don't render anything if not supposed to show and not peeking
  if (!showMascot && !isVisible && !isPeeking) return null;
  
  return (
    <>
      {/* Main mascot */}
      <div 
        className={`mascot-container ${position} ${isVisible ? 'visible' : 'hidden'} ${isWaving ? 'waving' : ''} ${isSinking ? 'sinking' : ''}`}
        onClick={handleDismiss}
      >
        <div className="mascot-wrapper">
          <img 
            src={`/images/${mascotType}.png`} 
            alt={`${mascotType} mascot`} 
            className="mascot-image"
          />
          <div className="mascot-stick"></div>
          
          {/* Speech bubble - using displayedMessage */}
          {displayedMessage && isVisible && !isSinking && (
            <div className={`speech-bubble ${position}`}>
              {displayedMessage}
              <div className="speech-bubble-arrow"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Peeking mascot at bottom - centered and 85% visible */}
      {isPeeking && (
        <div 
          className="peeking-mascot"
          onClick={handlePeekClick}
        >
          <img 
            src="/images/below.png" 
            alt="Peeking mascot" 
            className="peeking-image"
          />
        </div>
      )}
      
      {/* Add CSS for the animations */}
      <style jsx>{`
        .mascot-container {
          position: fixed;
          bottom: -10px;
          z-index: 50;
          transform-origin: bottom center;
          cursor: pointer;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: auto;
          will-change: transform;
        }
        
        .mascot-container.left {
          left: 20px;
          transform: ${isVisible && !isSinking ? 'translateY(0) rotate(8deg)' : 'translateY(120%) rotate(8deg)'};
        }
        
        .mascot-container.right {
          right: 20px;
          transform: ${isVisible && !isSinking ? 'translateY(0) rotate(-8deg)' : 'translateY(120%) rotate(-8deg)'};
        }
        
        .mascot-container.sinking {
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: translateY(120%) !important;
        }
        
        .mascot-wrapper {
          position: relative;
          animation: ${isVisible && !isSinking ? 'bounce 3s ease-in-out infinite' : 'none'};
          transform-origin: bottom center;
        }
        
        .mascot-image {
          width: 200px;
          height: auto;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
          transition: transform 0.3s ease;
          transform-origin: center bottom;
        }
        
        .waving .mascot-image {
          animation: wave 0.5s ease-in-out;
        }
        
        .mascot-stick {
          position: absolute;
          bottom: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 70px;
          background-color: #bb8e3c;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        /* Peeking mascot styles - centered and 85% visible */
        .peeking-mascot {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%) translateY(100%); /* Start fully hidden */
          z-index: 49;
          cursor: pointer;
          animation: peekIn 1.5s forwards ease; /* Slow rising animation */
          will-change: transform;
        }
        
        .peeking-image {
          width: 300px; /* Much larger */
          height: auto;
          filter: drop-shadow(0 -2px 8px rgba(0, 0, 0, 0.3));
        }
        
        .speech-bubble {
          position: absolute;
          top: -80px;
          background-color: #FFF8E7; /* App background color */
          padding: 12px 16px;
          border-radius: 12px;
          max-width: 240px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          font-size: 18px; /* Slightly larger */
          font-family: 'Fredoka', sans-serif; /* Match app font */
          font-weight: 500;
          color: #333333; /* Match app text color */
          opacity: 0;
          animation: fadeIn 0.3s ease forwards 0.3s;
          z-index: 51;
          border: 2px solid #FF9F1C; /* App primary orange */
        }
        
        .speech-bubble.left {
          left: 0;
        }
        
        .speech-bubble.right {
          right: 0;
        }
        
        .speech-bubble-arrow {
          position: absolute;
          bottom: -10px;
          width: 18px;
          height: 18px;
          background-color: #FFF8E7; /* Match bubble background */
          transform: rotate(45deg);
          border-right: 2px solid #FF9F1C; /* Match bubble border */
          border-bottom: 2px solid #FF9F1C; /* Match bubble border */
        }
        
        .speech-bubble.left .speech-bubble-arrow {
          left: 30px;
        }
        
        .speech-bubble.right .speech-bubble-arrow {
          right: 30px;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes wave {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes peekIn {
          0% { transform: translateX(-50%) translateY(100%); }
          60% { transform: translateX(-50%) translateY(15%); } /* 85% visible (15% still hidden) */
          70% { transform: translateX(-50%) translateY(20%); } /* Slight bounce with 80% visible */
          100% { transform: translateX(-50%) translateY(15%); } /* Final position - 85% visible */
        }
        
        /* Media queries for responsive design */
        @media (max-width: 768px) {
          .mascot-image {
            width: 150px;
          }
          
          .mascot-stick {
            height: 60px;
          }
          
          .mascot-container.left {
            left: 12px;
          }
          
          .mascot-container.right {
            right: 12px;
          }
          
          .peeking-image {
            width: 200px; /* Still large but more reasonable for mobile */
          }
          
          .speech-bubble {
            max-width: 200px;
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default EnhancedMascotDisplay;
