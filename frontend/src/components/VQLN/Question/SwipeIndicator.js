// components/VQLN/SwipeIndicator.js
import React from 'react';
import { ChevronUp } from 'lucide-react';

const SwipeIndicator = ({ visible = true }) => {
  if (!visible) return null;
  
  return (
    <div className="swipe-indicator">
      <ChevronUp />
    </div>
  );
};

export default SwipeIndicator;
