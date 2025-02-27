// components/VQLN/Question/QuestionCard.js
import React, { useState, useEffect } from 'react';
import SoundEffects from '../../../utils/SoundEffects';
import { Clock, ChevronDown, AlertTriangle } from 'lucide-react';

const QuestionCard = ({ 
  question, 
  onAnswerSubmit, 
  timeMode = false, 
  streak = 0,
  showSkipButton = false,
  onSkip
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [answerTime, setAnswerTime] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // For explanation countdown

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
  
  // Skip button timer
  useEffect(() => {
    let timer;
    
    if (showExplanation && !canProceed) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onAnswerSubmit(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [showExplanation, canProceed, onAnswerSubmit]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        if (showExplanation) {
          onSkip();
        } else if (canProceed) {
          onAnswerSubmit(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canProceed, onAnswerSubmit, showExplanation, onSkip]);

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
    setTimeLeft(15); // Start 15s countdown for explanation
    
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
      }
    }, 500);
  };

  // Render Skip button
  const renderSkipButton = () => {
    if (showSkipButton && showExplanation) {
      return (
        <button
          onClick={onSkip}
          className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse-slow"
        >
          <ChevronDown size={20} />
          <span>Next Question ({timeLeft}s)</span>
        </button>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-h-full bg-white p-6 rounded-lg shadow-lg">
      {/* Streak and Timer Display */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
          <span className="font-bold">Streak:</span>
          <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full">{streak}</span>
        </div>
        
        {timeMode && (
          <div className="w-2/3">
            {/* Improved timer with seconds display */}
            <div className="flex items-center justify-end gap-2 mb-1">
              <Clock size={16} className="text-gray-600" />
              <span className="text-gray-700 font-medium">{answerTime}s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear flex items-center justify-center text-xs text-white font-bold ${
                  answerTime > 6 ? 'bg-green-500' : 
                  answerTime > 3 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(answerTime / 10) * 100}%` }}
              >
                {answerTime <= 3 && answerTime}
              </div>
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
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 leading-tight">
          {question.question}
        </h2>
        
        <div className="space-y-4">
          {Object.entries(question.options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleAnswerClick(key)}
              className={`w-full p-4 text-center rounded-full transition-all ${
                selectedAnswer === key && showResult
                  ? key === question.correctAnswer
                    ? 'bg-green-500 text-white transform scale-105'
                    : 'bg-red-500 text-white'
                  : selectedAnswer === key
                    ? 'bg-gray-200 border-gray-400 border'  // Selected but waiting for result
                    : 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1'
              } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'} transition-all duration-200`}
              disabled={selectedAnswer !== null}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className={`mt-6 p-5 rounded-lg ${
          selectedAnswer === question.correctAnswer 
            ? 'bg-green-100 border-green-300 border explanation-timer' 
            : selectedAnswer === 'TIMEOUT'
              ? 'bg-yellow-100 border-yellow-300 border explanation-timer'
              : 'bg-red-100 border-red-300 border explanation-timer'
        }`}>
          <p className="font-bold text-xl mb-3">
            {selectedAnswer === question.correctAnswer 
              ? '✓ Correct!' 
              : selectedAnswer === 'TIMEOUT'
                ? '⏰ Time\'s up!'
                : '✗ Incorrect'}
          </p>
          
          {selectedAnswer === question.correctAnswer && (
            <p className="text-lg">{question.explanation}</p>
          )}
          
          {selectedAnswer === 'TIMEOUT' && (
            <p className="text-lg">The correct answer was: {question.options[question.correctAnswer]}</p>
          )}
          
          {selectedAnswer !== question.correctAnswer && selectedAnswer !== 'TIMEOUT' && (
            <div>
              <p className="text-lg mb-2">The correct answer was: <span className="font-semibold">{question.options[question.correctAnswer]}</span></p>
              <p className="text-lg">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
      
      {renderSkipButton()}
    </div>
  );
};

export default QuestionCard;
