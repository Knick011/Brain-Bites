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
  const autoHideTimer = useRef(null);
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
    
    // Animate entrance after a short delay
    if (showMascot) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        
        // Add a little wave animation after appearing
        setTimeout(() => {
          setIsWaving(true);
          setTimeout(() => setIsWaving(false), 1000);
        }, 500);
        
        // Set up auto-hide if enabled
        if (autoHide) {
          autoHideTimer.current = setTimeout(() => {
            setIsVisible(false);
            if (onDismiss) setTimeout(() => onDismiss(), 500);
          }, autoHideDuration);
        }
      }, entryDelay);
      
      return () => {
        clearTimeout(timer);
        if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
      };
    } else {
      setIsVisible(false);
    }
  }, [type, showMascot, lastVisit, autoHide, autoHideDuration, onDismiss]);

  // Handle mascot dismissal
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      setTimeout(() => onDismiss(), 500);
    }
  };
  
  // Don't render anything if not supposed to show
  if (!showMascot && !isVisible) return null;
  
  return (
    <div 
      className={`mascot-container ${position} ${isVisible ? 'visible' : 'hidden'} ${isWaving ? 'waving' : ''}`}
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
        {message && isVisible && (
          <div className={`speech-bubble ${position}`}>
            {message}
            <div className="speech-bubble-arrow"></div>
          </div>
        )}
      </div>
      
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
          left: 20px; /* Moved more to center from 16px */
          transform: ${isVisible ? 'translateY(0) rotate(8deg)' : 'translateY(120%) rotate(8deg)'};
          /* Changed angle from -8deg to 8deg to point toward center */
        }
        
        .mascot-container.right {
          right: 20px; /* Moved more to center from 16px */
          transform: ${isVisible ? 'translateY(0) rotate(-8deg)' : 'translateY(120%) rotate(-8deg)'};
          /* Changed angle from 8deg to -8deg to point toward center */
        }
        
        .mascot-wrapper {
          position: relative;
          animation: bounce 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        .mascot-image {
          width: 150px; /* Increased from 100px to make mascot bigger */
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
          width: 14px; /* Made stick thicker */
          height: 60px; /* Made stick longer */
          background-color: #bb8e3c;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .speech-bubble {
          position: absolute;
          top: -80px; /* Adjusted for bigger mascot */
          background-color: #FFF8E7; /* App background color */
          padding: 10px 14px;
          border-radius: 12px;
          max-width: 240px; /* Increased from 200px */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          font-size: 16px; /* Increased from 14px */
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
        
        /* Media queries for responsive design */
        @media (max-width: 768px) {
          .mascot-image {
            width: 120px; /* Increased from 80px but still smaller for mobile */
          }
          
          .mascot-stick {
            height: 50px;
          }
          
          .mascot-container.left {
            left: 12px;
          }
          
          .mascot-container.right {
            right: 12px;
          }
          
          .speech-bubble {
            max-width: 200px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedMascotDisplay;
