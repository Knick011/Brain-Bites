import React, { useState, useEffect, useCallback } from 'react';
import VideoCard from './components/VQLN/Video/VideoCard';
import QuestionCard from './components/VQLN/Question/QuestionCard';
import InitialWelcome from './components/VQLN/Welcome/InitialWelcome';
import MainSelection from './components/VQLN/Welcome/MainSelection';
import RewardsButton from './components/VQLN/RewardsButton';
import SoundEffects from './utils/SoundEffects';
import YouTubeService from './utils/YouTubeService';
import ApiService from './utils/ApiService';
import ApiWarmupService from './utils/ApiWarmupService';
import SwipeNavigation from './components/VQLN/SwipeNavigation';
import './styles/theme.css';
import './styles/GameStyles.css';

// Error message component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
      <p className="text-gray-700 mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

function App() {
  // State variables
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSection, setShowSection] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [availableVideos, setAvailableVideos] = useState(0);
  const [timeMode, setTimeMode] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  const [tutorialMode, setTutorialMode] = useState(true);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => {
      setNetworkStatus(false);
      setError("Network connection lost. Some features may not work properly.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Initialize API availability check
  useEffect(() => {
    const checkApi = async () => {
      console.log("Checking API availability...");
      const isAvailable = await ApiService.checkAvailability();
      console.log("API available:", isAvailable);
      
      if (!isAvailable && networkStatus) {
        console.warn('API not available, prefetching questions for offline use');
        try {
          // Prefetch some questions
          await ApiService.prefetchQuestions('psychology', 3);
          await ApiService.prefetchQuestions('funfacts', 3);
        } catch (err) {
          console.error('Failed to prefetch questions:', err);
        }
      }
    };
    
    checkApi();
  }, [networkStatus]);
  
  // Keep API alive with periodic pings
  useEffect(() => {
    // Send a ping to the server every 5 minutes to keep it active
    const pingInterval = setInterval(() => {
      if (ApiService.isReady) {
        fetch(`${ApiService.baseUrl}/`)
          .then(response => console.log("API keep-alive ping sent"))
          .catch(err => console.warn("API ping failed:", err));
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(pingInterval);
  }, []);

  // Start API warmup service
  useEffect(() => {
    // Start the API warmup service when the app loads
    ApiWarmupService.start();
    
    // Stop the warmup service when the component unmounts
    return () => {
      ApiWarmupService.stop();
    };
  }, []);

  // Fetch question with error handling
  const fetchQuestion = useCallback(async () => {
    if (!selectedSection) {
      console.warn('No section selected, cannot fetch question');
      return;
    }
    
    try {
      setIsLoading(true);
      setIsQuestionLoading(true);
      setError(null);
      
      console.log(`Fetching ${selectedSection} question...`);
      const question = await ApiService.getRandomQuestion(selectedSection);
      console.log("Received question:", question);
      
      if (!question) {
        throw new Error("No question data received");
      }
      
      // Check if question has been used before
      if (usedQuestionIds.has(question.id)) {
        // If we've used many questions, reset the used set
        if (usedQuestionIds.size >= 20) {
          setUsedQuestionIds(new Set([question.id]));
        } else {
          // Try getting another question
          setIsLoading(false);
          setIsQuestionLoading(false);
          return fetchQuestion();
        }
      } else {
        // Add to used questions set
        setUsedQuestionIds(prev => new Set([...prev, question.id]));
      }
      
      // Shuffle answer options (if they exist)
      if (question.options) {
        const shuffledQuestion = {...question};
        const optionKeys = Object.keys(shuffledQuestion.options);
        const optionValues = Object.values(shuffledQuestion.options);
        
        // Create a mapping of old positions to new positions
        const newPositions = [...optionKeys].sort(() => Math.random() - 0.5);
        const oldToNewMap = {};
        optionKeys.forEach((key, index) => {
          oldToNewMap[key] = newPositions[index];
        });
        
        // Create shuffled options object
        const shuffledOptions = {};
        optionKeys.forEach((key, index) => {
          shuffledOptions[newPositions[index]] = optionValues[index];
        });
        
        // Update correct answer based on the new positions
        const newCorrectAnswer = oldToNewMap[shuffledQuestion.correctAnswer];
        
        shuffledQuestion.options = shuffledOptions;
        shuffledQuestion.correctAnswer = newCorrectAnswer;
        
        setCurrentQuestion(shuffledQuestion);
      } else {
        setCurrentQuestion(question);
      }
      
      setShowQuestion(true);
      setQuestionsAnswered(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching question:', error);
      setError(`Failed to fetch question: ${error.message}`);
      setIsQuestionLoading(false);
    } finally {
      setIsLoading(false);
      setIsQuestionLoading(false);
    }
  }, [selectedSection, usedQuestionIds]);

  // Load videos on initial mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        console.log('Loading videos from YouTube service');
        const loadedVideos = await YouTubeService.getViralShorts(10);
        console.log(`Loaded ${loadedVideos.length} videos`);
        
        if (loadedVideos && loadedVideos.length > 0) {
          setVideos(loadedVideos);
        } else {
          console.warn('No videos were loaded');
        }
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
    SoundEffects.preloadSounds();
  }, []);

  // Get a random video
  const getRandomVideo = useCallback(() => {
    if (!videos || videos.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * videos.length);
    return videos[randomIndex];
  }, [videos]);

  // Handle answer submission
  const handleAnswerSubmit = useCallback((isCorrect, answerTime = null) => {
    if (isCorrect) {
      // Update correct answers count
      setCorrectAnswers(prev => prev + 1);
      
      // Calculate score if in time mode
      if (timeMode) {
        // Default time score if not provided
        const timeScore = (answerTime !== null) 
          ? Math.max(10, Math.floor(100 - (answerTime * 9)))
          : 50; // Default score
        
        console.log(`Adding ${timeScore} points to score`);
        setScore(prevScore => {
          const newScore = prevScore + timeScore;
          console.log(`New score: ${newScore}`);
          return newScore;
        });
      }
      
      // Update streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Tutorial mode - show video immediately after each correct answer
      if (tutorialMode) {
        // Get a random video
        const videoToPlay = getRandomVideo();
        
        if (videoToPlay) {
          // Show video after a small delay
          setTimeout(() => {
            setCurrentVideo(videoToPlay);
            setShowQuestion(false);
          }, 500);
        }
        
        // Exit tutorial mode after 5 correct answers
        if (correctAnswers + 1 >= 5) {
          setTimeout(() => {
            setTutorialMode(false);
            setTimeMode(true);
          }, 3000);
        }
      } else {
        // Game mode reward logic
        if (newStreak % 2 === 0) {
          // Standard reward: 1 video every 2 questions
          setAvailableVideos(prev => prev + 1);
        }
        
        // Fetch next question after a delay
        setTimeout(() => {
          fetchQuestion();
        }, 500);
      }
      
      if (SoundEffects.playCorrect) {
        SoundEffects.playCorrect();
      }
    } else {
      setStreak(0);
      if (SoundEffects.playIncorrect) {
        SoundEffects.playIncorrect();
      }
      
      // Fetch a new question after a delay
      setTimeout(() => {
        fetchQuestion();
      }, 500);
    }
  }, [correctAnswers, fetchQuestion, getRandomVideo, streak, timeMode, tutorialMode]);

  // Start watching a video from rewards
  const watchVideo = useCallback(() => {
    if (availableVideos <= 0) return;
    
    try {
      // Get a random video
      const video = getRandomVideo();
      
      if (video) {
        setCurrentVideo(video);
        setShowQuestion(false);
        setAvailableVideos(prev => prev - 1);
      } else {
        setError("Couldn't load video. Please try again later.");
      }
    } catch (error) {
      console.error('Error loading video:', error);
      setError("Error loading video: " + error.message);
    }
  }, [availableVideos, getRandomVideo]);

  // Handle video ending
  const handleVideoEnd = useCallback(() => {
    setShowQuestion(true);
    
    // In tutorial mode, fetch next question after video
    if (tutorialMode) {
      fetchQuestion();
    }
  }, [tutorialMode, fetchQuestion]);

  // Handle video skip
  const handleVideoSkip = useCallback(() => {
    setShowQuestion(true);
    
    // In tutorial mode, fetch next question after video
    if (tutorialMode) {
      fetchQuestion();
    }
  }, [tutorialMode, fetchQuestion]);

  // Handle video ready state
  const handleVideoReady = useCallback(() => {
    console.log('Video ready to play');
  }, []);

  // Handle start button click
  const handleStart = useCallback(() => {
    if (SoundEffects.playTransition) {
      SoundEffects.playTransition();
    }
    setShowWelcome(false);
    setShowSection(true);
  }, []);

  // Handle section selection
  const handleMainSelection = useCallback((section) => {
    if (SoundEffects.playTransition) {
      SoundEffects.playTransition();
    }
    setSelectedSection(section);
    setShowSection(false);
    
    // Immediately fetch the first question
    try {
      console.log(`Selecting section: ${section}`);
      const fetchInitialQuestion = async () => {
        setIsQuestionLoading(true);
        const question = await ApiService.getRandomQuestion(section);
        
        if (question) {
          // Process the question (same as in fetchQuestion)
          const shuffledQuestion = {...question};
          if (shuffledQuestion.options) {
            const optionKeys = Object.keys(shuffledQuestion.options);
            const optionValues = Object.values(shuffledQuestion.options);
            
            const newPositions = [...optionKeys].sort(() => Math.random() - 0.5);
            const oldToNewMap = {};
            optionKeys.forEach((key, index) => {
              oldToNewMap[key] = newPositions[index];
            });
            
            const shuffledOptions = {};
            optionKeys.forEach((key, index) => {
              shuffledOptions[newPositions[index]] = optionValues[index];
            });
            
            const newCorrectAnswer = oldToNewMap[shuffledQuestion.correctAnswer];
            
            shuffledQuestion.options = shuffledOptions;
            shuffledQuestion.correctAnswer = newCorrectAnswer;
          }
          
          setCurrentQuestion(shuffledQuestion);
          setShowQuestion(true);
          setQuestionsAnswered(prev => prev + 1);
        }
        setIsQuestionLoading(false);
      };
      
      fetchInitialQuestion();
      
      // Also prefetch more questions for later use
      ApiService.prefetchQuestions(section, 5);
    } catch (error) {
      console.error("Error in initial question fetch:", error);
      setIsQuestionLoading(false);
    }
  }, []);

  // Handle continue from explanation
  const handleContinue = useCallback(() => {
    if (tutorialMode && selectedAnswer) {
      const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
      handleAnswerSubmit(isCorrect);
    }
  }, [tutorialMode, selectedAnswer, currentQuestion, handleAnswerSubmit]);
  
  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="app">
      {/* Login/Rewards buttons visibility */}
      {!showWelcome && !showSection && (
        <>
          {showQuestion && !isLoading && !tutorialMode && (
            <RewardsButton 
              availableVideos={availableVideos} 
              onWatchVideo={watchVideo} 
            />
          )}
          
          {timeMode && (
            <div className="fixed top-4 right-4 z-40 bg-white shadow-md rounded-full px-4 py-2 flex items-center gap-2">
              <span className="font-bold text-lg">Score: {score}</span>
            </div>
          )}
        </>
      )}
      
      {showWelcome && (
        <InitialWelcome onStart={handleStart} isLoading={isLoading} />
      )}
      
      {showSection && (
        <MainSelection onSelect={handleMainSelection} />
      )}
      
      {!showWelcome && !showSection && (
        <>
          {showQuestion ? (
            <div className="question-container">
              {tutorialMode ? (
                <div className="w-full bg-orange-500 text-white py-2 px-4 text-center font-bold rounded-t-lg">
                  Tutorial Mode: Question {questionsAnswered} of 5
                </div>
              ) : (
                <div className="w-full mb-4 px-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">Questions Answered: {questionsAnswered}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-out w-full"></div>
                  </div>
                </div>
              )}
              
              {isQuestionLoading ? (
                <div className="flex items-center justify-center h-full my-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : currentQuestion ? (
                <>
                  <QuestionCard 
                    question={currentQuestion}
                    onAnswerSubmit={handleAnswerSubmit}
                    timeMode={timeMode}
                    streak={streak}
                    onSelectAnswer={setSelectedAnswer}
                  />
                  {/* Add swipe navigation in tutorial mode after answering a question */}
                  {tutorialMode && selectedAnswer && (
                    <SwipeNavigation onSwipeUp={handleContinue} />
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-white p-4 rounded-lg text-center my-20">
                  <p>No question available. Please try a different category or check your connection.</p>
                  <button
                    onClick={() => setShowSection(true)}
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    Go Back To Categories
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <VideoCard 
                url={currentVideo?.url}
                onEnd={handleVideoEnd}
                onSkip={handleVideoSkip}
                onReady={handleVideoReady}
              />
              <SwipeNavigation onSwipeUp={handleVideoSkip} />
            </>
          )}
        </>
      )}
      
      {/* Error message */}
      {error && (
        <ErrorMessage 
          message={error}
          onRetry={() => {
            setError(null);
            if (selectedSection) {
              fetchQuestion();
            } else {
              setShowSection(true);
            }
          }}
        />
      )}
      
      {/* Network status indicator */}
      {!networkStatus && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          You're offline. Some features may not work.
        </div>
      )}
    </div>
  );
}

export default App;
