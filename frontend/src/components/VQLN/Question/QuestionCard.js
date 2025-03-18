// components/VQLN/Question/QuestionCard.js
import React, { useState, useEffect } from 'react';
import AnswerNotification from './AnswerNotification';
import SoundEffects from '../../../utils/SoundEffects';

const QuestionCard = ({ 
  question, 
  onAnswerSubmit, 
  timeMode = false, 
  streak = 0, 
  onSelectAnswer,
  tutorialMode = false,
  onExplanationShow,
  onExplanationContinue // Add this prop
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answerTime, setAnswerTime] = useState(10);
  const [timerActive, setTimerActive] = useState(false);

  // Reset states when a new question is loaded
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setAnswerTime(10);
    setTimerActive(!!timeMode);
  }, [question, timeMode]);

  // Timer for question timeout
  useEffect(() => {
    let timer;
    if (timerActive) {
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
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive]);

  // Update parent component with selected answer
  useEffect(() => {
    if (onSelectAnswer && selectedAnswer !== null) {
      onSelectAnswer(selectedAnswer);
    }
  }, [selectedAnswer, onSelectAnswer]);

  // Notify parent when explanation is shown
  useEffect(() => {
    if (showExplanation && onExplanationShow) {
      onExplanationShow(true);
    }
  }, [showExplanation, onExplanationShow]);

  // Handle key presses for answer selection
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!question || selectedAnswer !== null) return;
      
      const key = e.key.toUpperCase();
      
      // Check if key matches an option key (A, B, C, D, etc.)
      if (question.options && question.options[key]) {
        handleAnswerClick(key);
      }
      
      // Use number keys as alternate option selectors (1=A, 2=B, etc.)
      const numberMap = {
        '1': 'A',
        '2': 'B',
        '3': 'C',
        '4': 'D',
        '5': 'E'
      };
      
      if (numberMap[e.key] && question.options && question.options[numberMap[e.key]]) {
        handleAnswerClick(numberMap[e.key]);
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [question, selectedAnswer]);

  const handleTimeUp = () => {
    if (!selectedAnswer) {
      setSelectedAnswer('TIMEOUT');
      if (onSelectAnswer) onSelectAnswer('TIMEOUT');
      setShowExplanation(true);
      
      // Play incorrect sound for timeout
      SoundEffects.playIncorrect();
    }
  };

  if (!question) {
    return <div className="w-full h-full bg-white p-4">Loading question...</div>;
  }

  const handleAnswerClick = (option) => {
    if (selectedAnswer !== null) return;
    
    // Play button press sound when selecting an answer
    SoundEffects.playButtonPress();
    
    // Calculate remaining time for scoring
    const remainingTime = timeMode ? answerTime : null;
    
    // Stop the timer
    setTimerActive(false);
    
    setSelectedAnswer(option);
    if (onSelectAnswer) onSelectAnswer(option);
    
    // Show explanation with a short delay
    setTimeout(() => {
      setShowExplanation(true);
      
      // Play appropriate sound based on answer correctness
      if (option === question.correctAnswer) {
        SoundEffects.playCorrect();
      } else {
        SoundEffects.playIncorrect();
      }
    }, 300);
  };

  // Handle continue from explanation - UPDATED TO PASS TO PARENT
  const handleContinue = () => {
    console.log("Handle continue triggered in QuestionCard");
    setShowExplanation(false);
    
    // Play transition sound
    SoundEffects.playTransition();
    
    if (onExplanationContinue) {
      // Call the parent's continuation function
      onExplanationContinue();
    } else {
      // Fallback to original behavior
      onAnswerSubmit(selectedAnswer === question.correctAnswer, 10 - answerTime);
    }
  };

  return (
    <div className="bg-[#FFF8E7] h-full">
      <div className="w-full mx-auto max-w-3xl p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
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
          
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">{question.question}</h2>
            
            <div className="space-y-3">
              {Object.entries(question.options || {}).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAnswerClick(key)}
                  className={`w-full p-3 bg-gray-100 text-left rounded-lg transition-colors ${
                    selectedAnswer === key 
                      ? key === question.correctAnswer
                        ? 'bg-green-200'
                        : 'bg-red-200'
                      : 'hover:bg-gray-200'
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
              correctAnswer={question.options?.[question.correctAnswer] || ""}
              tutorialMode={tutorialMode}
              onContinue={handleContinue} // Pass the continue handler
              autoAdvanceDelay={7000} // Auto-advance after 7 seconds
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
