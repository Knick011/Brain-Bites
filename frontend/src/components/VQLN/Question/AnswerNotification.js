// components/VQLN/Question/AnswerNotification.js
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronDown } from 'lucide-react';
import StandardPopup from '../Common/StandardPopup';

/**
 * Answer Notification Popup
 */
const AnswerNotification = ({ 
  isCorrect, 
  isTimeout = false, 
  explanation, 
  correctAnswer,
  onContinue,
  timeLeft = 15
}) => {
  const getIcon = () => {
    if (isCorrect) return <CheckCircle size={32} className="text-green-500" style={{ color: '#22c55e' }} />;
    if (isTimeout) return <AlertCircle size={32} className="text-yellow-500" style={{ color: '#eab308' }} />;
    return <XCircle size={32} className="text-red-500" style={{ color: '#ef4444' }} />;
  };
  
  const getTitle = () => {
    if (isCorrect) return "Correct!";
    if (isTimeout) return "Time's up!";
    return "Incorrect";
  };
  
  const getBackgroundColor = () => {
    if (isCorrect) return "#f0fdf4"; // Light green
    if (isTimeout) return "#fefce8"; // Light yellow
    return "#fef2f2"; // Light red
  };
  
  const getTextColor = () => {
    if (isCorrect) return "#166534"; // Dark green
    if (isTimeout) return "#854d0e"; // Dark yellow
    return "#991b1b"; // Dark red
  };
  
  return (
    <StandardPopup 
      isOpen={true} 
      onClose={onContinue}
      showCloseButton={false}
      size="md"
    >
      <div 
        style={{ 
          borderRadius: '0.5rem', 
          padding: '1.25rem', 
          backgroundColor: getBackgroundColor(),
          color: getTextColor()
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          {getIcon()}
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{getTitle()}</h3>
        </div>
        
        {!isCorrect && !isTimeout && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>The correct answer was:</p>
            <p style={{ fontWeight: 'bold', color: '#1f2937' }}>{correctAnswer}</p>
          </div>
        )}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#4b5563' }}>{explanation}</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Next question in {timeLeft}s
          </div>
          
          <button 
            onClick={onContinue}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            <span>Continue</span>
            <ChevronDown size={16} />
          </button>
        </div>
        
        {/* Progress bar */}
        <div style={{ 
          width: '100%', 
          height: '0.25rem', 
          backgroundColor: '#e5e7eb', 
          borderRadius: '9999px', 
          marginTop: '1rem',
          overflow: 'hidden'
        }}>
          <div 
            style={{ 
              height: '100%', 
              backgroundColor: '#f97316', // Orange
              borderRadius: '9999px', 
              width: `${(timeLeft / 15) * 100}%`,
              transition: 'width 1s linear'
            }}
          ></div>
        </div>
      </div>
    </StandardPopup>
  );
};

export default AnswerNotification;
