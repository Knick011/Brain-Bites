// components/VQLN/Tutorial/TutorialPopup.js
import React from 'react';
import { HelpCircle, ArrowRight, CheckCircle } from 'lucide-react';

const TutorialPopup = ({ step, onNext, currentStep, totalSteps }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onNext}></div>
      
      {/* Tutorial popup card */}
      <div className="bg-white rounded-xl shadow-xl w-80 p-5 relative z-10 animate-scaleIn">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-orange-100 rounded-full">
            <HelpCircle className="text-orange-500" size={20} />
          </div>
          <h3 className="text-lg font-bold text-orange-500">{step.title}</h3>
        </div>
        
        <p className="text-gray-700 mb-4">{step.content}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs font-medium bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
            {currentStep} of {totalSteps}
          </div>
          
          <button 
            onClick={onNext}
            className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
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
