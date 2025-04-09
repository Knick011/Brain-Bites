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
          left: 16px;
          transform: ${isVisible ? 'translateY(0) rotate(-8deg)' : 'translateY(120%) rotate(-8deg)'};
        }
        
        .mascot-container.right {
          right: 16px;
          transform: ${isVisible ? 'translateY(0) rotate(8deg)' : 'translateY(120%) rotate(8deg)'};
        }
        
        .mascot-wrapper {
          position: relative;
          animation: bounce 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        .mascot-image {
          width: 100px;
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
          width: 12px;
          height: 50px;
          background-color: #bb8e3c;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .speech-bubble {
          position: absolute;
          top: -60px;
          background-color: white;
          padding: 8px 12px;
          border-radius: 12px;
          max-width: 200px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          font-size: 14px;
          opacity: 0;
          animation: fadeIn 0.3s ease forwards 0.5s;
          z-index: 51;
        }
        
        .speech-bubble.left {
          left: 0;
        }
        
        .speech-bubble.right {
          right: 0;
        }
        
        .speech-bubble-arrow {
          position: absolute;
          bottom: -8px;
          width: 16px;
          height: 16px;
          background-color: white;
          transform: rotate(45deg);
          box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
        }
        
        .speech-bubble.left .speech-bubble-arrow {
          left: 20px;
        }
        
        .speech-bubble.right .speech-bubble-arrow {
          right: 20px;
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
            width: 80px;
          }
          
          .mascot-stick {
            height: 40px;
          }
          
          .mascot-container.left {
            left: 8px;
          }
          
          .mascot-container.right {
            right: 8px;
          }
          
          .speech-bubble {
            max-width: 160px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedMascotDisplay;
