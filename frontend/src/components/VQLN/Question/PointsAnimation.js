// Updated components/VQLN/Question/PointsAnimation.js
import React, { useEffect, useState } from 'react';

/**
 * Enhanced Points Animation with time-based scoring
 * Now with more visible positioning near the score
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
      console.log("Points animation", { 
        basePoints: points, 
        timeRatio, 
        multiplier: timeMultiplier, 
        finalPoints 
      });
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
  
  // Use position prop if provided, otherwise center in the screen
  // CHANGED: Default to show near the score in the top right
  const defaultPosition = {
    top: '120px',
    right: '20px',
    transform: 'none'
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
  
  // ENHANCED: More visible styling
  return (
    <div 
      className={`fixed z-50 ${getPointColor()} ${timeClass} bg-white px-4 py-2 rounded-xl shadow-lg font-bold text-2xl animate-bounce`}
      style={stylePosition}
    >
      {/* Main points display */}
      <span className="points-value">+{calculatedPoints}</span>
      
      {/* Bonus indicator for time-based scoring */}
      {isTimeMode && calculatedPoints > points && (
        <div className="text-xs font-medium -mb-1 text-center">
          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">SPEED BONUS!</span>
        </div>
      )}
    </div>
  );
};

export default PointsAnimation;
