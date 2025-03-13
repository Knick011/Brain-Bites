// App.js - updated version
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import VideoCard from './components/VQLN/Video/VideoCard';
import QuestionCard from './components/VQLN/Question/QuestionCard';
import InitialWelcome from './components/VQLN/Welcome/InitialWelcome';
import MainSelection from './components/VQLN/Selection/MainSelection';
import YouTubeLogin from './components/VQLN/YouTubeLogin';
import RewardsButton from './components/VQLN/RewardsButton';
import ProgressBar from './components/VQLN/ProgressBar';
import ScoreDisplay from './components/VQLN/ScoreDisplay';
import MilestoneCelebration from './components/VQLN/MilestoneCelebration';
import TimeModeIntro from './components/VQLN/TimeModeIntro';
import SoundEffects from './utils/SoundEffects';
import TutorialPopup from './components/VQLN/Tutorial/TutorialPopup';
import GameModePopup from './components/VQLN/GameModePopup';
import AllDoneMessage from './components/VQLN/AllDoneMessage';
import RewardsConfirmation from './components/VQLN/RewardsConfirmation';
import RewardNotification from './components/VQLN/RewardNotification';
import YouTubeService from './utils/YouTubeService';
import ApiService from './utils/ApiService';
import './styles/theme.css';
import './styles/GameStyles.css';
import './styles/popup-animations.css';

// API Configuration
const API_BASE_URL = 'https://brain-bites-api.onrender.com';

// Initialize API service
const apiService = new ApiService(API_BASE_URL);

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
  const [youtubePersonalization, setYoutubePersonalization] = useState(false);
  const [personalizedVideos, setPersonalizedVideos] = useState([]);
  const [videoReady, setVideoReady] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [availableVideos, setAvailableVideos] = useState(0);
  const [timeMode, setTimeMode] = useState(false);
  const [score, setScore] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [showTimeIntro, setShowTimeIntro] = useState(false);
  const [error, setError] = useState(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  const [usedVideoIds, setUsedVideoIds] = useState(new Set());
  const [tutorialMode, setTutorialMode] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [watchingAllRewards, setWatchingAllRewards] = useState(false);
  const [rewardsToWatch, setRewardsToWatch] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showAllDoneMessage, setShowAllDoneMessage] = useState(false);
  const [showGameModePopup, setShowGameModePopup] = useState(false);
  const [showRewardPopup, setShowRewardPopup] = useState(false);
  const [apiWarmedUp, setApiWarmedUp] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);

  // Refs to avoid closure issues with state
  const videoLockRef = useRef(false);
  
  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(true);
      // Try to reconnect when network comes back
      apiService.warmup();
    };
    
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
  
  // Tutorial steps configuration
  const tutorialSteps = [
    {
      title: "Welcome to Brain Bites!",
      content: "Let's learn how to use this app. First, you'll be answering trivia questions.",
      element: ".question-container"
    },
    {
      title: "Answer Questions",
      content: "Select the correct answer from the options. For each correct answer, you'll get to watch a fun video!",
      element: ".space-y-3"
    },
    {
      title: "Build Your Streak",
      content: "Your streak shows how many questions you've answered correctly in a row.",
      element: ".streak-counter"
    },
    {
      title: "Watch Videos",
      content: "After each correct answer in tutorial mode, you'll get to watch a fun short video!",
      element: ".video-container"
    },
    {
      title: "Ready to Start?",
      content: "You're all set! Let's begin with your first question.",
      element: ".question-container"
    }
  ];

  // Initialize API warmup with more frequent checks
  useEffect(() => {
    const warmupApi = async () => {
      // Try to warm up the API
      const isWarmedUp = await apiService.warmup();
      setApiWarmedUp(isWarmedUp);
      
      // Start keeping the API warm with more frequent pings (every 3 minutes)
      apiService.startWarmupInterval(3);
    };
    
    warmupApi();
    
    // Clean up on unmount
    return () => {
      apiService.stopWarmupInterval();
    };
  }, []);

  // Fetch question with improved error handling using ApiService
  const fetchQuestion = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsQuestionLoading(true);
      setError(null);
      
      // Use the ApiService instead of direct axios calls
      if (!selectedSection) {
        throw new Error('No section selected');
      }
      
      const question = await apiService.getRandomQuestion(selectedSection);
      
      if (question) {
        // Check if question has been used before
        if (usedQuestionIds.has(question.id)) {
          // If we've used all questions from the set (60 total), reset the used set
          if (usedQuestionIds.size >= 58) { // Leave a little buffer
            setUsedQuestionIds(new Set());
          } else {
            // Try getting another question
            setIsLoading(false);
            setIsQuestionLoading(false);
            return fetchQuestion();
          }
        }
        
        // Shuffle answer options
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
        
        // Add to used questions set
        setUsedQuestionIds(prev => new Set([...prev, question.id]));
        
        setCurrentQuestion(shuffledQuestion);
        setShowQuestion(true);
        setQuestionsAnswered(prev => prev + 1);
      } else {
        throw new Error('No question data received');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      
      // Get API status to provide better error messages
      const apiStatus = apiService.getStatus();
      
      setError(`Failed to fetch question: ${apiStatus.lastError || error.message}.`);
      
      // Try warming up the API for next time
      if (networkStatus) {
        apiService.warmup();
      }
    } finally {
      setIsLoading(false);
      setIsQuestionLoading(false);
    }
  }, [selectedSection, usedQuestionIds, networkStatus]);

  // SIMPLIFIED: Load videos on initial mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        console.log('Loading videos from YouTube service');
        const videos = await YouTubeService.getViralShorts(30);
        console.log(`Loaded ${videos.length} videos`);
        
        if (videos && videos.length > 0) {
          setVideos(videos);
        } else {
          console.warn('No videos were loaded');
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
    SoundEffects.preloadSounds();
    
    // Start tutorial after loading
    setTimeout(() => {
      if (tutorialMode) {
        setShowTutorial(true);
      }
    }, 1500);
  }, [tutorialMode]);

  // SIMPLIFIED: Get a random video
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
      if (timeMode && answerTime !== null) {
        const timeScore = Math.max(10, Math.floor(100 - (answerTime * 9)));
        setScore(prevScore => prevScore + timeScore);
      }
      
      // Update streak and check milestone
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
            
            // Show time mode intro after tutorial completion
            setTimeout(() => {
              setTimeMode(true);
              setShowTimeIntro(true);
              
              // Show game mode popup after intro closes
              setTimeout(() => {
                setShowGameModePopup(true);
              }, 5000);
            }, 1000);
          }, 3000);
        }
      } else {
        // Game mode reward logic
        if (newStreak % 2 === 0) {
          // Standard reward: 1 video every 2 questions
          setAvailableVideos(prev => prev + 1);
          setShowRewardPopup(true);
          setTimeout(() => setShowRewardPopup(false), 3000);
        }
        
        // Milestone rewards: extra video at streaks of 5, 10, 15, etc.
        if (newStreak >= 5 && newStreak % 5 === 0) {
          setShowMilestone(true);
          setCurrentMilestone(newStreak);
          setAvailableVideos(prev => prev + 2); // Add 2 instead of 1
          SoundEffects.playStreak();
        }
        
        // Start time mode at streak of 10 if not already active
        if (newStreak === 10 && !timeMode) {
          setTimeMode(true);
          setShowTimeIntro(true);
        }
        
        // Fetch next question after a delay
        setTimeout(() => {
          fetchQuestion();
        }, 500);
      }
      
      SoundEffects.playCorrect();
    } else {
      setStreak(0);
      SoundEffects.playIncorrect();
      
      // Fetch a new question after a delay
      setTimeout(() => {
        fetchQuestion();
      }, 500);
    }
  }, [correctAnswers, fetchQuestion, streak, timeMode, tutorialMode, getRandomVideo]);

  // Start watching all rewards with error handling and retry
  const startWatchingAllRewards = useCallback(() => {
    if (availableVideos <= 0) return;
    
    try {
      // Get unique videos for all available rewards
      const videosToWatch = [];
      
      for (let i = 0; i < availableVideos; i++) {
        let video = getRandomVideo();
        
        if (video) {
          videosToWatch.push(video);
        }
      }
      
      if (videosToWatch.length > 0) {
        setRewardsToWatch(videosToWatch);
        setCurrentVideoIndex(0);
        setCurrentVideo(videosToWatch[0]);
        setWatchingAllRewards(true);
        setShowQuestion(false);
        setAvailableVideos(0); // Reset available videos count
      } else {
        setError("Couldn't load videos. Please try again later.");
      }
    } catch (error) {
      console.error('Error starting videos:', error);
      setError("Error loading videos: " + error.message);
    }
  }, [availableVideos, getRandomVideo]);

  // Handle video ending
  const handleVideoEnd = useCallback(() => {
    if (watchingAllRewards) {
      // Move to next video if available
      if (currentVideoIndex < rewardsToWatch.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
        setCurrentVideo(rewardsToWatch[currentVideoIndex + 1]);
      } else {
        // No more videos
        setWatchingAllRewards(false);
        setShowQuestion(true);
        setShowAllDoneMessage(true);
        setTimeout(() => setShowAllDoneMessage(false), 3000);
      }
    } else {
      // Single video mode - go back to questions
      setShowQuestion(true);
      
      // In tutorial mode, fetch next question after video
      if (tutorialMode) {
        fetchQuestion();
      }
    }
  }, [watchingAllRewards, currentVideoIndex, rewardsToWatch, tutorialMode, fetchQuestion]);

  // Handle video skip
  const handleVideoSkip = useCallback(() => {
    if (watchingAllRewards) {
      // Move to next video if available
      if (currentVideoIndex < rewardsToWatch.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
        setCurrentVideo(rewardsToWatch[currentVideoIndex + 1]);
      } else {
        // No more videos
        setWatchingAllRewards(false);
        setShowQuestion(true);
        setShowAllDoneMessage(true);
        setTimeout(() => setShowAllDoneMessage(false), 3000);
      }
    } else {
      // Single video mode - go back to questions
      setShowQuestion(true);
      
      // In tutorial mode, fetch next question after video
      if (tutorialMode) {
        fetchQuestion();
      }
    }
  }, [watchingAllRewards, currentVideoIndex, rewardsToWatch, tutorialMode, fetchQuestion]);

  // Handle exit from rewards section
  const handleExitRewards = useCallback(() => {
    if (watchingAllRewards) {
      setShowExitConfirmation(true);
    } else {
      setShowQuestion(true);
    }
  }, [watchingAllRewards]);

  // Confirm exit from rewards
  const confirmExitRewards = useCallback(() => {
    setShowExitConfirmation(false);
    setWatchingAllRewards(false);
    setShowQuestion(true);
  }, []);

  // Cancel exit from rewards
  const cancelExitRewards = useCallback(() => {
    setShowExitConfirmation(false);
  }, []);

  // Handle video ready state
  const handleVideoReady = useCallback(() => {
    setVideoReady(true);
  }, []);

  // Handle start button click
  const handleStart = useCallback(() => {
    SoundEffects.playTransition();
    setShowWelcome(false);
    setShowSection(true);
  }, []);

  // Handle section selection
  const handleMainSelection = useCallback((section) => {
    SoundEffects.playTransition();
    setSelectedSection(section);
    setShowSection(false);
    fetchQuestion();
  }, [fetchQuestion]);

  // Handle milestone close
  const handleMilestoneClose = useCallback(() => {
    setShowMilestone(false);
  }, []);

  // Handle time intro close
  const handleTimeIntroClose = useCallback(() => {
    setShowTimeIntro(false);
  }, []);

  // Handle YouTube login
  const handleYouTubeLogin = useCallback((isLoggedIn, videos = []) => {
    setYoutubePersonalization(isLoggedIn);
    if (isLoggedIn && videos.length > 0) {
      setPersonalizedVideos(videos);
    }
  }, []);

  // Handle tutorial step navigation
  const handleNextTutorialStep = useCallback(() => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
    }
  }, [tutorialStep, tutorialSteps.length]);

  // Handle game mode popup close
  const handleGameModePopupClose = useCallback(() => {
    setShowGameModePopup(false);
  }, []);

  // Auto-dismiss the error after 5 seconds
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
      {!showWelcome && !showSection && (
        <>
          <YouTubeLogin onLoginStatusChange={handleYouTubeLogin} />
          
          {showQuestion && !isLoading && !tutorialMode && (
            <RewardsButton 
              availableVideos={availableVideos} 
              onWatchVideo={startWatchingAllRewards} 
            />
          )}
          
          {timeMode && <ScoreDisplay score={score} />}
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
                <ProgressBar 
                  questionsAnswered={questionsAnswered}
                  tutorialMode={false}
                />
              )}
              
              {isQuestionLoading ? (
                <div className="flex items-center justify-center h-full my-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : (
                <QuestionCard 
                  question={currentQuestion}
                  onAnswerSubmit={handleAnswerSubmit}
                  timeMode={timeMode}
                  streak={streak}
                />
              )}
            </div>
          ) : (
            <>
              <VideoCard 
                url={currentVideo?.url}
                onEnd={handleVideoEnd}
                onSkip={handleVideoSkip}
                onReady={handleVideoReady}
                onExit={handleExitRewards}
                watchingAllRewards={watchingAllRewards}
                currentIndex={currentVideoIndex + 1}
                totalVideos={rewardsToWatch.length}
              />
            </>
          )}
        </>
      )}

      {/* Tutorial Popup */}
      {showTutorial && (
        <TutorialPopup 
          step={tutorialSteps[tutorialStep]} 
          onNext={handleNextTutorialStep}
          currentStep={tutorialStep + 1}
          totalSteps={tutorialSteps.length}
        />
      )}

      {/* Game Mode Popup */}
      {showGameModePopup && (
        <GameModePopup onClose={handleGameModePopupClose} />
      )}

      {/* Milestone Celebration */}
      {showMilestone && (
        <MilestoneCelebration 
          milestone={currentMilestone}
          onClose={handleMilestoneClose}
        />
      )}
      
      {/* Time Mode Intro */}
      {showTimeIntro && (
        <TimeModeIntro onClose={handleTimeIntroClose} />
      )}
      
      {/* All Done Message */}
      {showAllDoneMessage && (
        <AllDoneMessage />
      )}
      
      {/* Exit confirmation for rewards */}
      {showExitConfirmation && (
        <RewardsConfirmation
          onConfirm={confirmExitRewards}
          onCancel={cancelExitRewards}
          remainingVideos={rewardsToWatch.length - currentVideoIndex - 1}
        />
      )}
      
      {/* Rewards earned popup */}
      {showRewardPopup && (
        <RewardNotification 
          isVisible={showRewardPopup}
          onClose={() => setShowRewardPopup(false)}
          rewardCount={1}
        />
      )}
      
      {/* Network status indicator */}
      {!networkStatus && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          You're offline. Some features may not work.
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn z-50">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
