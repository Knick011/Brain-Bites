// components/VQLN/Tutorial/TutorialPopup.js
import React, { useEffect, useState } from 'react';
import { HelpCircle, ArrowRight, CheckCircle } from 'lucide-react';

const TutorialPopup = ({ step, onNext, currentStep, totalSteps }) => {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [elementExists, setElementExists] = useState(false);
  
  useEffect(() => {
    // Find the element to position the popup near
    if (step.element) {
      const targetElement = document.querySelector(step.element);
      
      if (targetElement) {
        setElementExists(true);
        
        // Get element position and dimensions
        const rect = targetElement.getBoundingClientRect();
        
        // Calculate centered position near the element
        const newPosition = {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left + rect.width + 20}px`
        };
        
        // Adjust if would go off-screen
        if (rect.left + rect.width + 300 > window.innerWidth) {
          newPosition.left = `${rect.left - 300}px`;
        }
        
        setPosition(newPosition);
      } else {
        setElementExists(false);
      }
    }
  }, [step]);
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-auto" onClick={onNext}></div>
      
      {/* Tutorial popup */}
      <div 
        className="absolute bg-white rounded-xl shadow-xl w-64 p-4 pointer-events-auto transform -translate-y-1/2 transition-all duration-300 ease-in-out"
        style={{
          top: position.top,
          left: position.left,
          zIndex: 60
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="text-orange-500" size={20} />
          <h3 className="font-bold text-lg">{step.title}</h3>
        </div>
        
        <p className="text-gray-700 mb-4">{step.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
          
          <button 
            onClick={onNext}
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
          >
            {currentStep === totalSteps ? (
              <>
                <span>Got it</span>
                <CheckCircle size={16} />
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialPopup;
