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
  const autoHideTimer = useRef(null);
  const sinkTimer = useRef(null);
  const entryDelay = 300;
  
  // Determine mascot type based on props and conditions
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
    
    // Reset states when type changes
    if (isSinking) setIsSinking(false);
    if (isPeeking) setIsPeeking(false);
    
    // Animate entrance after a short delay
    if (showMascot) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsSinking(false);
        setIsPeeking(false);
        
        // Add a little wave animation after appearing
        setTimeout(() => {
          setIsWaving(true);
          setTimeout(() => setIsWaving(false), 1000);
        }, 500);
        
        // Set up sink timer - mascot sinks after 3 seconds
        clearTimeout(sinkTimer.current);
        sinkTimer.current = setTimeout(() => {
          setIsSinking(true);
          
          // After sinking animation completes, show peeking mascot
          setTimeout(() => {
            setIsVisible(false);
            setIsPeeking(true);
          }, 500); // Matches the duration of the sinking animation
        }, 3000); // 3 seconds before sinking
        
        // Set up auto-hide if enabled (overrides sinking behavior)
        if (autoHide) {
          clearTimeout(autoHideTimer.current);
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
        clearTimeout(sinkTimer.current);
        clearTimeout(autoHideTimer.current);
      };
    } else {
      setIsVisible(false);
      // When explicitly hiding mascot, also hide peeking version
      setIsPeeking(false);
    }
  }, [type, showMascot, lastVisit, autoHide, autoHideDuration, onDismiss]);

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
      
      // Reset sinking timer
      clearTimeout(sinkTimer.current);
      sinkTimer.current = setTimeout(() => {
        setIsSinking(true);
        setTimeout(() => {
          setIsVisible(false);
          setIsPeeking(true);
        }, 500);
      }, 3000);
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
          
          {/* Optional speech bubble */}
          {message && isVisible && !isSinking && (
            <div className={`speech-bubble ${position}`}>
              {message}
              <div className="speech-bubble-arrow"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Peeking mascot at bottom - now centered and 85% visible */}
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
        
        /* Peeking mascot styles - now centered and 85% visible */
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
          padding: 10px 14px;
          border-radius: 12px;
          max-width: 240px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          font-size: 16px;
          font-family: 'Fredoka', sans-serif; /* Match app font */
          font-weight: 500;
          color: #333333; /* Match app text color */
          opacity: 0;
          animation: fadeIn 0.3s ease forwards 0.5s;
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
          60% { transform: translateX(-50%) translateY(24%); } /* 85% visible (15% still hidden) */
          70% { transform: translateX(-50%) translateY(29%); } /* Slight bounce with 80% visible */
          100% { transform: translateX(-50%) translateY(24%); } /* Final position - 85% visible */
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
