// components/VQLN/PointsAnimation.js
import React, { useEffect, useState } from 'react';

const PointsAnimation = ({ points, position = {} }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Auto-hide after animation completes
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  return (
    <div 
      className="points-animation text-2xl"
      style={stylePosition}
    >
      +{points}
    </div>
  );
};

export default PointsAnimation;
