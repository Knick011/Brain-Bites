// components/VQLN/Selection/MainSelection.js
import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const MainSelection = ({ onSelect }) => {
  return (
    <div className="selection-screen">
      <h1 className="selection-title">Choose Your Path</h1>
      
      <div className="selection-container">
        <button 
          className="selection-button funfacts"
          onClick={() => onSelect('funfacts')}
        >
          <div className="selection-icon">
            <Sparkles color="white" size={24} />
          </div>
          <div className="selection-text">
            <h3>Fun Facts</h3>
            <p>Discover fascinating psychological facts</p>
          </div>
        </button>

        <button 
          className="selection-button psychology"
          onClick={() => onSelect('psychology')}
        >
          <div className="selection-icon">
            <Brain color="white" size={24} />
          </div>
          <div className="selection-text">
            <h3>Psychology</h3>
            <p>Test your course knowledge</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MainSelection;