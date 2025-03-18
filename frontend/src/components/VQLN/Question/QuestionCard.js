// components/VQLN/Question/QuestionCard.js
import React, { useState, useEffect } from 'react';
import AnswerNotification from './AnswerNotification';
import { ArrowDown } from 'lucide-react';

const QuestionCard = ({ 
  question, 
  onAnswerSubmit, 
  timeMode = false, 
  streak = 0, 
  onSelectAnswer,
  tutorialMode = false,
  onExplanationShow
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answerTime, setAnswerTime] = useState(10);
  const [timerActive, setTimerActive] = useState(true);
  const [explanationTimeLeft, setExplanationTimeLeft] = useState(15);
  const [showKeyboardHint, setShowKeyboardHint] = useState(true);

  // Auto-hide keyboard hint after 10 seconds
  useEffect(() => {
    const hintTimer = setTimeout(() => {
      setShowKeyboardHint(false);
    }, 10000);
    
    return () => clearTimeout(hintTimer);
  }, []);

  // Reset states when a new question is loaded
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setExplanationTimeLeft(15);
    setShowKeyboardHint(true);
    
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle key presses if there's a question and no answer selected yet
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

  return (
    <div className="bg-[#FFF8E7] h-full">
      <div className="w-full mx-auto max-w-3xl p-4">
        {/* Keyboard hint */}
        {showKeyboardHint && !selectedAnswer && (
          <div className="bg-orange-100 rounded-lg px-4 py-2 text-sm mb-4 flex items-center justify-between">
            <span className="text-orange-800">
              <span className="font-bold">Tip:</span> Use keyboard to select answers (A, B, C, D keys or 1, 2, 3, 4 keys)
            </span>
            <button onClick={() => setShowKeyboardHint(false)} className="text-orange-500">
              ✕
            </button>
          </div>
        )}
        
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
          
          {/* Keyboard navigation instructions for tutorial mode */}
          {tutorialMode && !selectedAnswer && (
            <div className="text-center mt-4 p-2 bg-gray-100 rounded-lg text-gray-600 flex items-center justify-center gap-2">
              <ArrowDown size={16} className="text-orange-500" />
              <span>You can also use keyboard keys to select answers</span>
            </div>
          )}
          
          {/* Explanation Popup */}
          {showExplanation && (
            <AnswerNotification 
              isCorrect={selectedAnswer === question.correctAnswer}
              isTimeout={selectedAnswer === 'TIMEOUT'}
              explanation={question.explanation}
              correctAnswer={question.options?.[question.correctAnswer] || ""}
              onContinue={handleContinue}
              timeLeft={explanationTimeLeft}
              tutorialMode={tutorialMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
