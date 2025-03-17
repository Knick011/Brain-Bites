// components/VQLN/Question/QuestionCard.js
import React, { useState, useEffect } from 'react';
import AnswerNotification from './AnswerNotification';

const QuestionCard = ({ 
  question, 
  onAnswerSubmit, 
  timeMode = false, 
  streak = 0, 
  onSelectAnswer,
  tutorialMode = false
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answerTime, setAnswerTime] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const [explanationTimeLeft, setExplanationTimeLeft] = useState(15);

  // Reset states when a new question is loaded
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
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

  // Update parent component with selected answer for swipe navigation
  useEffect(() => {
    if (onSelectAnswer && selectedAnswer !== null) {
      onSelectAnswer(selectedAnswer);
    }
  }, [selectedAnswer, onSelectAnswer]);

  if (!question) {
    return <div className="w-full h-full bg-white p-4">Loading question...</div>;
  }

  const handleTimeUp = () => {
    if (!selectedAnswer) {
      setSelectedAnswer('TIMEOUT');
      if (onSelectAnswer) onSelectAnswer('TIMEOUT');
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
    
    setSelectedAnswer(option);
    if (onSelectAnswer) onSelectAnswer(option);
    
    // Always show explanation with a short delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 300);
  };

  // Handle continue from explanation
  const handleContinue = () => {
    setShowExplanation(false);
    onAnswerSubmit(selectedAnswer === question.correctAnswer, 10 - answerTime);
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
                  <span className="font-medium">{key}: </span>{value}
                </button>
              ))}
            </div>
          </div>
          
          {/* Explanation Popup - No continue button in tutorial mode */}
          {showExplanation && (
            <AnswerNotification 
              isCorrect={selectedAnswer === question.correctAnswer}
              isTimeout={selectedAnswer === 'TIMEOUT'}
              explanation={question.explanation}
              correctAnswer={question.options?.[question.correctAnswer] || ""}
              onContinue={handleContinue}
              timeLeft={explanationTimeLeft}
              showContinueButton={!tutorialMode} // Hide continue button in tutorial mode
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
