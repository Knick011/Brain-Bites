import React, { useState, useEffect } from 'react';

const MascotDisplay = ({ 
  type = 'happy', // 'happy', 'sad', 'excited', 'gamemode', 'depressed'
  position = 'left', // 'left' or 'right'
  showMascot = true,
  lastVisit = null, // Date object of last visit
  onDismiss = null // Optional callback when mascot is dismissed
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mascotType, setMascotType] = useState(type);
  
  // Determine mascot type based on props and conditions
  useEffect(() => {
    // Check if we should show the depressed mascot (returning after 1+ days)
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
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [type, showMascot, lastVisit]);

  // Handle mascot dismissal
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      setTimeout(() => onDismiss(), 300); // Call after exit animation
    }
  };
  
  // Don't render anything if not supposed to show
  if (!showMascot && !isVisible) return null;
  
  return (
    <div 
      className={`mascot-container ${position} ${isVisible ? 'visible' : 'hidden'}`}
      onClick={handleDismiss}
    >
      <div className="mascot-wrapper">
        <img 
          src={`/images/${mascotType}.png`} 
          alt={`${mascotType} mascot`} 
          className="mascot-image"
        />
        <div className="mascot-stick"></div>
      </div>
      
      {/* Add some CSS for the animations */}
      <style jsx>{`
        .mascot-container {
          position: fixed;
          bottom: -20px;
          z-index: 50;
          transform-origin: bottom center;
          cursor: pointer;
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: auto;
        }
        
        .mascot-container.left {
          left: 16px;
          transform: ${isVisible ? 'translateY(0) rotate(-5deg)' : 'translateY(100%) rotate(-5deg)'};
        }
        
        .mascot-container.right {
          right: 16px;
          transform: ${isVisible ? 'translateY(0) rotate(5deg)' : 'translateY(100%) rotate(5deg)'};
        }
        
        .mascot-container.visible {
          transform: ${position === 'left' ? 'translateY(0) rotate(-5deg)' : 'translateY(0) rotate(5deg)'};
        }
        
        .mascot-container.hidden {
          transform: translateY(100%);
        }
        
        .mascot-wrapper {
          position: relative;
          animation: bounce 2s ease-in-out infinite;
        }
        
        .mascot-image {
          width: 90px;
          height: auto;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }
        
        .mascot-stick {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 40px;
          background-color: #bb8e3c;
          border-radius: 4px;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        /* Media queries for responsive design */
        @media (max-width: 768px) {
          .mascot-image {
            width: 70px;
          }
          
          .mascot-stick {
            height: 30px;
          }
          
          .mascot-container.left {
            left: 8px;
          }
          
          .mascot-container.right {
            right: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default MascotDisplay;
