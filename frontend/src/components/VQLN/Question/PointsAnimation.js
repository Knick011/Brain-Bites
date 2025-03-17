// components/VQLN/Question/PointsAnimation.js
import React, { useEffect, useState } from 'react';

/**
 * Enhanced Points Animation with time-based scoring
 */
const PointsAnimation = ({ points, position = {}, isTimeMode = false, answerTime = null, maxTime = 10 }) => {
  const [visible, setVisible] = useState(true);
  const [calculatedPoints, setCalculatedPoints] = useState(points);
  
  useEffect(() => {
    // Calculate time-based points if in time mode
    if (isTimeMode && answerTime !== null && maxTime > 0) {
      // Points formula: base points × time multiplier
      // Time multiplier ranges from 1.0 (slow) to 2.0 (instant)
      const timeRatio = 1 - (answerTime / maxTime);
      const timeMultiplier = 1 + timeRatio; // 1.0 to 2.0 multiplier
      const finalPoints = Math.floor(points * timeMultiplier);
      
      setCalculatedPoints(finalPoints);
    } else {
      setCalculatedPoints(points);
    }
    
    // Auto-hide after animation completes
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [points, isTimeMode, answerTime, maxTime]);
  
  if (!visible) return null;
  
  // Default position at center of screen if not provided
  const defaultPosition = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };
  
  const stylePosition = {
    ...defaultPosition,
    ...position
  };
  
  // Determine color based on points (higher = better color)
  const getPointColor = () => {
    if (calculatedPoints >= 150) return 'text-yellow-400 points-excellent';
    if (calculatedPoints >= 100) return 'text-green-500 points-great';
    if (calculatedPoints >= 50) return 'text-blue-500 points-good';
    return 'text-orange-500 points-normal';
  };
  
  // Additional class for time-based points
  const timeClass = isTimeMode ? 'points-time-based' : '';
  
  return (
    <div 
      className={`points-animation ${getPointColor()} ${timeClass}`}
      style={stylePosition}
    >
      {/* Main points display */}
      <span className="points-value">+{calculatedPoints}</span>
      
      {/* Bonus indicator for time-based scoring */}
      {isTimeMode && calculatedPoints > points && (
        <div className="points-bonus-indicator">
          <span className="points-bonus-text">FAST BONUS!</span>
        </div>
      )}
    </div>
  );
};

export default PointsAnimation;
