// QuestionCard.js
import React, { useState, useEffect } from 'react';
import SoundEffects from '../../../utils/SoundEffects';

const QuestionCard = ({ question, onAnswerSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [showResult, setShowResult] = useState(false); // New state for delayed color change

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' && canProceed) {
        onAnswerSubmit(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canProceed, onAnswerSubmit]);

  if (!question) {
    return <div className="w-full h-full bg-white p-4">Loading question...</div>;
  }

  const handleAnswerClick = (option) => {
    if (selectedAnswer !== null) return;
    
    // Play button press sound first
    SoundEffects.playButtonPress();
    
    // Set selected answer without showing result yet
    setSelectedAnswer(option);
    
    // Delay showing the result and playing the sound
    setTimeout(() => {
      setShowResult(true);
      setShowExplanation(true);
      
      const isCorrect = option === question.correctAnswer;
      
      if (isCorrect) {
        setCanProceed(true);
        onAnswerSubmit(true);
      } else {
        onAnswerSubmit(false);
        // Reset after showing the result
        setTimeout(() => {
          setSelectedAnswer(null);
          setShowExplanation(false);
          setShowResult(false);
        }, 2000);
      }
    }, 2000);
  };

  return (
    <div className="w-full h-full bg-white p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{question.question}</h2>
        
        <div className="space-y-3">
          {Object.values(question.options).map((value, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(Object.keys(question.options)[index])}
              className={`w-full p-3 text-left rounded ${
                selectedAnswer === Object.keys(question.options)[index] && showResult
                  ? Object.keys(question.options)[index] === question.correctAnswer
                    ? 'bg-green-200'
                    : 'bg-red-200'
                  : selectedAnswer === Object.keys(question.options)[index]
                    ? 'bg-gray-200'  // Selected but waiting for result
                    : 'bg-gray-100 hover:bg-gray-200'
              } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={selectedAnswer !== null}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className={`mt-4 p-4 rounded ${
          selectedAnswer === question.correctAnswer ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <p className="font-bold mb-2">
            {selectedAnswer === question.correctAnswer 
              ? 'Correct!' 
              : 'Incorrect - Try again'}
          </p>
          {selectedAnswer === question.correctAnswer && (
            <p>{question.explanation}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;