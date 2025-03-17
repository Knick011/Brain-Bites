// components/VQLN/Tutorial/TutorialPopup.js
import React from 'react';
import { HelpCircle, ArrowRight, CheckCircle } from 'lucide-react';

/**
 * Enhanced Tutorial Popup Component
 */
const TutorialPopup = ({ step, onNext, currentStep, totalSteps }) => {
  // Ensure we have valid step data
  if (!step || !step.title || !step.content) {
    console.error("Missing step data for TutorialPopup");
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fadeIn">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl animate-scaleIn">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-full">
              <HelpCircle className="text-orange-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
          </div>
          
          <p className="text-gray-700 mb-6 text-base leading-relaxed">{step.content}</p>
          
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
              {currentStep} of {totalSteps}
            </div>
            
            <button 
              onClick={() => onNext && onNext()}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-base font-medium transition-colors"
            >
              {currentStep === totalSteps ? (
                <>
                  <span>Got it</span>
                  <CheckCircle size={18} />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPopup;
