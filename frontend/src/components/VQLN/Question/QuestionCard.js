// QuestionCard.js
import React, { useState, useEffect } from 'react';
import SoundEffects from '../../../utils/SoundEffects';
import QuestionTimer from './QuestionTimer';
import StreakCounter from './StreakCounter';
import PointsAnimation from './PointsAnimation';

const QuestionCard = ({ question, onAnswerSubmit, timeMode = false, streak = 0 }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [answerTime, setAnswerTime] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPoints, setShowPoints] = useState(false);

  useEffect(() => {
    // Reset states when a new question is loaded
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCanProceed(false);
    setShowResult(false);
    
    if (timeMode) {
      setAnswerTime(10);
      setTimerActive(true);
    }
  }, [question, timeMode]);

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

  const handleTimeUp = () => {
    if (!selectedAnswer) {
      // Time's up without an answer
      SoundEffects.playIncorrect();
      setSelectedAnswer('TIMEOUT');
      setShowExplanation(true);
      setShowResult(true);
      onAnswerSubmit(false);
      
      // Reset after a delay
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowExplanation(false);
        setShowResult(false);
        if (timeMode) {
          setAnswerTime(10);
          setTimerActive(true);
        }
      }, 2000);
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
      setShowResult(true);
      setShowExplanation(true);
      
      const isCorrect = option === question.correctAnswer;
      
      if (isCorrect) {
        setCanProceed(true);
        
        // Show points animation if in time mode
        if (timeMode) {
          setShowPoints(true);
          setTimeout(() => setShowPoints(false), 1500);
        }
        
        onAnswerSubmit(true, remainingTime);
      } else {
        onAnswerSubmit(false);
        // Reset after showing the result
        setTimeout(() => {
          setSelectedAnswer(null);
          setShowExplanation(false);
          setShowResult(false);
          if (timeMode) {
            setAnswerTime(10);
            setTimerActive(true);
          }
        }, 2000);
      }
    }, 500);
  };

  return (
    <div className="w-full h-full bg-white p-4 overflow-y-auto">
      {/* Streak and Timer Display */}
      <div className="flex justify-between items-center mb-4">
        <StreakCounter streak={streak} />
        
        {timeMode && (
          <div className="w-2/3">
            <QuestionTimer 
              timeLimit={10} 
              onTimeUp={handleTimeUp} 
              isActive={timerActive} 
            />
          </div>
        )}
      </div>
      
      {/* Points animation */}
      {showPoints && timeMode && (
        <PointsAnimation 
          points={pointsEarned} 
          position={{ top: '30%', left: '50%' }} 
        />
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">{question.question}</h2>
        
        <div className="space-y-3">
          {Object.entries(question.options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleAnswerClick(key)}
              className={`w-full p-3 text-left rounded transition-colors ${
                selectedAnswer === key && showResult
                  ? key === question.correctAnswer
                    ? 'bg-green-200 border-green-400 border'
                    : 'bg-red-200 border-red-400 border'
                  : selectedAnswer === key
                    ? 'bg-gray-200 border-gray-400 border'  // Selected but waiting for result
                    : 'bg-gray-100 hover:bg-gray-200 border-transparent border'
              } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={selectedAnswer !== null}
            >
              <span className="font-medium mr-2">{key}:</span> {value}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className={`mt-4 p-4 rounded ${
          selectedAnswer === question.correctAnswer 
            ? 'bg-green-100 border-green-300 border' 
            : selectedAnswer === 'TIMEOUT'
              ? 'bg-yellow-100 border-yellow-300 border'
              : 'bg-red-100 border-red-300 border'
        }`}>
          <p className="font-bold mb-2">
            {selectedAnswer === question.correctAnswer 
              ? 'Correct!' 
              : selectedAnswer === 'TIMEOUT'
                ? 'Time\'s up!'
                : 'Incorrect - Try again'}
          </p>
          {selectedAnswer === question.correctAnswer && (
            <p>{question.explanation}</p>
          )}
          {selectedAnswer === 'TIMEOUT' && (
            <p>The correct answer was: {question.options[question.correctAnswer]}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
