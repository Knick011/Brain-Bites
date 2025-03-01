// components/VQLN/Question/QuestionCard.js
import React, { useState, useEffect } from 'react';
import SoundEffects from '../../../utils/SoundEffects';
// Fix the import path - importing from the same directory
import AnswerNotification from './AnswerNotification';

const QuestionCard = ({ question, onAnswerSubmit, timeMode = false, streak = 0 }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [answerTime, setAnswerTime] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [explanationTimeLeft, setExplanationTimeLeft] = useState(15);

  useEffect(() => {
    // Reset states when a new question is loaded
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCanProceed(false);
    setExplanationTimeLeft(15);
    
    if (timeMode) {
      setAnswerTime(10);
      setTimerActive(true);
    }
  }, [question, timeMode]);

  // Timer for question timeout
  useEffect(() => {
    let timer;
    if (timerActive && timeMode) {
      timer = setInterval(() => {
        setAnswerTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeMode]);

  // Timer for explanation auto-proceed
  useEffect(() => {
    let timer;
    if (showExplanation) {
      timer = setInterval(() => {
        setExplanationTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onAnswerSubmit(selectedAnswer === question.correctAnswer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showExplanation, onAnswerSubmit, selectedAnswer, question]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' && showExplanation) {
        // Skip explanation and proceed to next question
        onAnswerSubmit(selectedAnswer === question.correctAnswer);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showExplanation, onAnswerSubmit, selectedAnswer, question]);

  if (!question) {
    return <div className="w-full h-full bg-white p-4">Loading question...</div>;
  }

  const handleTimeUp = () => {
    if (!selectedAnswer) {
      // Time's up without an answer
      SoundEffects.playIncorrect();
      setSelectedAnswer('TIMEOUT');
      setShowExplanation(true);
      setExplanationTimeLeft(15);
    }
  };

  const handleAnswerClick = (option) => {
    if (selectedAnswer !== null) return;
    
    // Calculate remaining time for scoring
    const remainingTime = timeMode ? answerTime : null;
    
    // Stop the timer
    setTimerActive(false);
    
    // Calculate points if in time mode
    if (timeMode && remainingTime) {
      const calculatedPoints = Math.max(10, Math.floor(100 - (remainingTime * 9)));
      setPointsEarned(calculatedPoints);
    }
    
    // Play button press sound
    SoundEffects.playButtonPress();
    
    setSelectedAnswer(option);
    
    setTimeout(() => {
      setShowExplanation(true);
      setExplanationTimeLeft(15);
      
      const isCorrect = option === question.correctAnswer;
      
      if (isCorrect) {
        setCanProceed(true);
        
        // Show points animation if in time mode
        if (timeMode) {
          setShowPoints(true);
          setTimeout(() => setShowPoints(false), 1500);
        }
      }
    }, 500);
  };

  // Handle continue from explanation
  const handleContinue = () => {
    onAnswerSubmit(selectedAnswer === question.correctAnswer);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md p-6">
      {/* Streak Display */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">Streak:</span>
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full">{streak}</span>
        </div>
        
        {timeMode && (
          <div className="w-2/3">
            <div className="flex justify-end mb-1">
              <span className="text-gray-700 font-medium">{answerTime}s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${
                  answerTime > 6 ? 'bg-green-500' : 
                  answerTime > 3 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(answerTime / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Points animation */}
      {showPoints && timeMode && (
        <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-orange-500 animate-bounce z-50">
          +{pointsEarned}
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{question.question}</h2>
        
        <div className="space-y-3">
          {Object.entries(question.options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleAnswerClick(key)}
              className={`w-full p-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-center rounded-full transition-colors ${
                selectedAnswer === key && showExplanation
                  ? key === question.correctAnswer
                    ? 'from-green-400 to-green-500'
                    : 'from-red-400 to-red-500'
                  : selectedAnswer === key
                    ? 'bg-gray-200 text-gray-800'  // Selected but waiting for result
                    : 'hover:from-orange-500 hover:to-orange-600'
              } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={selectedAnswer !== null}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation Popup */}
      {showExplanation && (
        <AnswerNotification 
          isCorrect={selectedAnswer === question.correctAnswer}
          isTimeout={selectedAnswer === 'TIMEOUT'}
          explanation={question.explanation}
          correctAnswer={question.options[question.correctAnswer]}
          onContinue={handleContinue}
          timeLeft={explanationTimeLeft}
        />
      )}
    </div>
  );
};

export default QuestionCard;
