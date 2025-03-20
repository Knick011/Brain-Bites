// Final Updated App.js with all requested changes
import React, { useState, useEffect, useCallback, useRef } from 'react';
import VideoCard from './components/VQLN/Video/VideoCard';
import QuestionCard from './components/VQLN/Question/QuestionCard';
import InitialWelcome from './components/VQLN/Welcome/InitialWelcome';
import MainSelection from './components/VQLN/Welcome/MainSelection';
import RewardsButton from './components/VQLN/RewardsButton';
import SoundEffects from './utils/SoundEffects';
import YouTubeService from './utils/YouTubeService';
import ApiService from './utils/ApiService';
import SwipeNavigation from './components/VQLN/SwipeNavigation';
import TutorialPopup from './components/VQLN/Tutorial/TutorialPopup';
import GameModePopup from './components/VQLN/GameModePopup';
import MilestoneCelebration from './components/VQLN/MilestoneCelebration';
import PointsAnimation from './components/VQLN/Question/PointsAnimation';
import './styles/theme.css';
import './styles/GameStyles.css';
import './styles/popup-animations.css';

function App() {
  // UI & navigation states
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSection, setShowSection] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  
  // Content states
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  const [viewedVideoIds, setViewedVideoIds] = useState(new Set());
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  
  // Game mechanics states
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [availableVideos, setAvailableVideos] = useState(0);
  const [timeMode, setTimeMode] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  // Tutorial and special states
  const [tutorialMode, setTutorialMode] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showGameModePopup, setShowGameModePopup] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [answerTime, setAnswerTime] = useState(null);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [swipeEnabled, setSwipeEnabled] = useState(false);
  const [explanationVisible, setExplanationVisible] = useState(false);

  // Refs for performance optimization
  const contentRef = useRef(null);
  
  // Debug helper function
  const debugLog = (message, data) => {
    console.log(`[DEBUG] ${message}`, data);
  };

  // Define tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Brain Bites!",
      content: "Answer quiz questions and watch entertaining videos as rewards. Swipe up or press the Down Arrow key to navigate between questions and videos!"
    },
    {
      title: "Answer Questions",
      content: "Select the correct answer from the options. The faster you answer, the more points you'll earn in Time Mode!"
    },
    {
      title: "Earn Video Rewards",
      content: "Every 2 correct answers earns you a video reward. Reach streak milestones (5, 10, 15...) for bonus videos!"
    },
    {
      title: "Time Mode",
      content: "After the tutorial, Time Mode activates! Answer quickly for more points - up to 2x for super-fast answers!"
    }
  ];
  
  // Handle correct answer processing
  const processCorrectAnswer = useCallback((answerTimeValue) => {
    debugLog("Processing correct answer", { tutorialMode, timeMode, streak: streak + 1 });
    
    // Increment streak
    setStreak(prevStreak => {
      const newStreak = prevStreak + 1;
      debugLog("Streak updated", { prevStreak, newStreak });
      return newStreak;
    });
    
    // Increment correct answers
    setCorrectAnswers(prevCorrect => {
      const newCorrect = prevCorrect + 1;
      debugLog("Correct answers updated", { prevCorrect, newCorrect });
      
      // CHANGE: Reward logic now based on correct answers, not streaks
      // For every 2 correct answers, award a video (not dependent on streak)
      if (!tutorialMode && newCorrect % 2 === 0) {
        debugLog("Adding standard video reward based on correct answers", { newCorrect });
        setAvailableVideos(prev => {
          const newAvailable = prev + 1;
          debugLog("Available videos updated", { prev, newAvailable });
          return newAvailable;
        });
      }
      
      return newCorrect;
    });
    
    // Keep milestone bonuses based on streaks (every 5)
    if (!tutorialMode) {
      const newStreak = streak + 1;
      if (newStreak % 5 === 0) {
        debugLog("Adding streak milestone bonus", { newStreak });
        setTimeout(() => {
          setCurrentMilestone(newStreak);
          setShowMilestone(true);
          setAvailableVideos(prev => {
            const newAvailable = prev + 1;
            debugLog("Milestone videos added", { prev, newAvailable });
            return newAvailable;
          });
        }, 500);
      }
    }
    
    // Calculate score in time mode
    if (timeMode) {
      debugLog("Calculating time-based score", { answerTimeValue, timeMode });
      
      // Default time score if not provided
      const timeScore = (answerTimeValue !== null) 
        ? Math.max(20, Math.floor(100 - (answerTimeValue * 9)))
        : 50;
      
      // Apply time multiplier for faster answers
      const timeRatio = answerTimeValue !== null ? 1 - (answerTimeValue / 10) : 0.5;
      const timeMultiplier = 1 + timeRatio; // 1.0 to 2.0 multiplier
      const finalScore = Math.floor(timeScore * timeMultiplier);
      
      // Show points animation - CHANGED: positioned near the score
      setPointsEarned(finalScore);
      setShowPointsAnimation(true);
      setTimeout(() => setShowPointsAnimation(false), 1500);
      
      // Update total score
      setScore(prevScore => {
        const newScore = prevScore + finalScore;
        debugLog("Score updated", { prevScore, newScore, finalScore });
        return newScore;
      });
    }
    
    // Play the correct sound
    SoundEffects.playCorrect();
  }, [streak, tutorialMode, timeMode]);
  
  // Handle incorrect answer processing
  const processIncorrectAnswer = useCallback(() => {
    debugLog("Processing incorrect answer");
    
    // Reset streak
    setStreak(0);
    
    // Play the incorrect sound
    SoundEffects.playIncorrect();
    
    // Fetch next question after delay
    setTimeout(() => {
      fetchQuestion();
    }, 1500);
  }, []);

  // Check for tutorial completion based on questions answered
  useEffect(() => {
    // CHANGE: Complete tutorial after 5 questions, regardless of correctness
    if (tutorialMode && questionsAnswered >= 5) {
      debugLog("Tutorial complete! Activating game mode", { questionsAnswered });
      setTimeout(() => {
        setTutorialMode(false);
        setShowGameModePopup(true);
        setTimeout(() => {
          setTimeMode(true);
          console.log("Time mode activated!");
        }, 1000);
      }, 500);
    }
  }, [questionsAnswered, tutorialMode]);

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

  // Check API availability
  useEffect(() => {
    const checkApi = async () => {
      console.log("Checking API availability...");
      const isAvailable = await ApiService.checkAvailability();
      console.log("API available:", isAvailable);
    };
    
    checkApi();
  }, [networkStatus]);

  // Reset currentVideo when returning to questions
  useEffect(() => {
    if (showQuestion) {
      // Clear current video when showing questions to prevent reuse
      setCurrentVideo(null);
    }
  }, [showQuestion]);

  // Load videos and preload sounds on initial mount
  useEffect(() => {
    // Preload sounds
    SoundEffects.preloadSounds();
    
    const loadVideos = async () => {
      try {
        setIsLoading(true);
        console.log('Loading videos from YouTube service');
        const loadedVideos = await YouTubeService.getViralShorts(15);
        console.log(`Loaded ${loadedVideos.length} videos`);
        
        if (loadedVideos && loadedVideos.length > 0) {
          setVideos(loadedVideos);
        } else {
          console.warn('No videos were loaded, will retry');
          setTimeout(async () => {
            const retryVideos = await YouTubeService.getViralShorts(10);
            if (retryVideos && retryVideos.length > 0) {
              setVideos(retryVideos);
            } else {
              console.error('Failed to load videos after retry');
            }
            setIsLoading(false);
          }, 2000);
          return;
        }
      } catch (error) {
        console.error('Error loading videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
    
    // Add keyboard navigation for global app
    const handleKeyDown = (e) => {
      // Use Backspace key to go back to category selection when stuck
      if (e.key === 'Backspace' && !showWelcome && !showSection) {
        setError({
          message: 'Return to category selection?',
          isConfirm: true,
          onConfirm: () => {
            setShowSection(true);
            setSelectedSection(null);
            setCurrentQuestion(null);
            setError(null);
          },
          onCancel: () => setError(null)
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      
      // Reset swipe-related states
      setSwipeEnabled(false);
      setExplanationVisible(false);
      setSelectedAnswer(null);
      
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

  // Get a random video that hasn't been viewed
  const getRandomVideo = useCallback(() => {
    if (!videos || videos.length === 0) {
      return null;
    }
    
    // Filter out videos that have already been viewed
    const unwatchedVideos = videos.filter(video => !viewedVideoIds.has(video.id));
    
    // If too many videos watched, reset
    if (unwatchedVideos.length === 0) {
      // Keep track of last viewed video to avoid immediate repetition
      const lastVideoId = Array.from(viewedVideoIds).pop();
      setViewedVideoIds(new Set(lastVideoId ? [lastVideoId] : []));
      
      // Return random video not matching last viewed
      const availableVideos = videos.filter(video => video.id !== lastVideoId);
      const randomIndex = Math.floor(Math.random() * availableVideos.length);
      return availableVideos[randomIndex] || videos[0];
    }
    
    // Get random unwatched video
    const randomIndex = Math.floor(Math.random() * unwatchedVideos.length);
    return unwatchedVideos[randomIndex];
  }, [videos, viewedVideoIds]);

  // SIMPLIFIED AND FIXED: Handle answer submission function
  const handleAnswerSubmit = useCallback((isCorrect, answerTimeValue = null) => {
    debugLog("Answer submitted", { isCorrect, answerTimeValue, timeMode, tutorialMode });
    
    // Enable swiping after answering in tutorial mode
    if (tutorialMode) {
      setSwipeEnabled(true);
    }
    
    // Save the answer time for points calculation
    setAnswerTime(answerTimeValue);
    
    // Process correct or incorrect answer
    if (isCorrect) {
      processCorrectAnswer(answerTimeValue);
    } else {
      processIncorrectAnswer();
    }
  }, [processCorrectAnswer, processIncorrectAnswer, tutorialMode]);

  // Handle explanation continue
  const handleExplanationContinue = useCallback(() => {
    console.log("Explanation continue handler triggered");
    
    if (tutorialMode) {
      // For tutorial mode, just show the video if available
      if (currentVideo) {
        setShowQuestion(false);
      } else {
        // Get and show a video
        const videoToPlay = getRandomVideo();
        if (videoToPlay) {
          setCurrentVideo(videoToPlay);
          setViewedVideoIds(prev => new Set([...prev, videoToPlay.id]));
          setTimeout(() => setShowQuestion(false), 50);
        } else {
          fetchQuestion();
        }
      }
    } else {
      // For regular mode, just fetch the next question
      fetchQuestion();
    }
    
    // Reset explanation state
    setExplanationVisible(false);
    setSwipeEnabled(false);
  }, [tutorialMode, currentVideo, fetchQuestion, getRandomVideo]);

  // Watch a video from rewards - always get a fresh video
  const watchVideo = useCallback(async () => {
    if (availableVideos <= 0) return;
    
    try {
      setIsVideoLoading(true);
      
      // Get fresh videos directly from service to ensure variety
      const freshVideos = await YouTubeService.getViralShorts(3);
      console.log(`Got ${freshVideos.length} fresh videos`);
      
      if (freshVideos && freshVideos.length > 0) {
        // Find a video that hasn't been viewed recently
        let newVideo = freshVideos.find(video => !viewedVideoIds.has(video.id));
        
        // If all videos viewed, reset tracking and use first
        if (!newVideo) {
          console.log("All videos viewed, resetting tracking");
          // Keep track of very last video to avoid immediate repetition
          const lastVideoId = Array.from(viewedVideoIds).pop();
          setViewedVideoIds(new Set());
          
          // Find a video that isn't the last one watched
          newVideo = freshVideos.find(video => video.id !== lastVideoId) || freshVideos[0];
        }
        
        console.log("Selected video:", newVideo.id, newVideo.title);
        
        // Update video list with new videos
        setVideos(prevVideos => {
          // Create a set of existing video IDs
          const existingIds = new Set(prevVideos.map(v => v.id));
          
          // Filter out duplicates and append new videos
          const uniqueNewVideos = freshVideos.filter(v => !existingIds.has(v.id));
          
          if (uniqueNewVideos.length > 0) {
            console.log(`Adding ${uniqueNewVideos.length} new videos to list`);
            return [...prevVideos, ...uniqueNewVideos];
          }
          
          return prevVideos;
        });
        
        // Mark this video as viewed
        setViewedVideoIds(prev => new Set([...prev, newVideo.id]));
        
        // Set video and switch view
        setCurrentVideo(newVideo);
        setShowQuestion(false);
        setAvailableVideos(prev => prev - 1);
        setSwipeEnabled(true);
      } else {
        throw new Error("No videos available");
      }
    } catch (error) {
      console.error('Error loading video:', error);
      setError("Couldn't load video: " + error.message);
      fetchQuestion();
    } finally {
      setIsVideoLoading(false);
    }
  }, [availableVideos, fetchQuestion, viewedVideoIds]);

  // Handle video skip - get a different video on next view
  const handleVideoSkip = useCallback(() => {
    // If we have a current video, mark it as viewed
    if (currentVideo && currentVideo.id) {
      setViewedVideoIds(prev => new Set([...prev, currentVideo.id]));
    }
    
    // Clear current video to force a refresh next time
    setCurrentVideo(null);
    setShowQuestion(true);
    
    // In tutorial mode, fetch next question after video
    if (tutorialMode) {
      fetchQuestion();
    }
  }, [tutorialMode, fetchQuestion, currentVideo]);
  
  // Handle video ending
  const handleVideoEnd = useCallback(() => {
    // Don't automatically transition in tutorial mode - wait for swipe
    if (!tutorialMode) {
      // Mark video as viewed before moving on
      if (currentVideo && currentVideo.id) {
        setViewedVideoIds(prev => new Set([...prev, currentVideo.id]));
      }
      
      // Clear current video to force a fresh one next time
      setCurrentVideo(null);
      setShowQuestion(true);
    }
  }, [tutorialMode, currentVideo]);
  
  // Handle transition from video to question
  const handleVideoToQuestionTransition = useCallback(() => {
    // Play transition sound
    SoundEffects.playTransition();
    
    // Mark video as viewed
    if (currentVideo && currentVideo.id) {
      setViewedVideoIds(prev => new Set([...prev, currentVideo.id]));
    }
    
    // Clear current video to force a fresh one next time
    setCurrentVideo(null);
    setShowQuestion(true);
    
    // In tutorial mode, fetch next question after video
    if (tutorialMode) {
      fetchQuestion();
    }
    
    // Reset swipe enabled
    setSwipeEnabled(false);
  }, [tutorialMode, fetchQuestion, currentVideo]);

  // Navigation handlers
  const handleStart = useCallback(() => {
    SoundEffects.playTransition();
    SoundEffects.playButtonPress();
    
    setShowWelcome(false);
    setShowSection(true);
  }, []);

  const handleMainSelection = useCallback((section) => {
    SoundEffects.playTransition();
    SoundEffects.playButtonPress();
    
    setSelectedSection(section);
    setShowSection(false);
    
    // Show first tutorial step
    setTutorialStep(0);
    setShowTutorial(true);
    
    // Load first question in background
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
    } catch (error) {
      console.error("Error in initial question fetch:", error);
      setIsQuestionLoading(false);
    }
  }, []);

  // UI interaction handlers
  const handleTutorialNext = useCallback(() => {
    SoundEffects.playButtonPress();
    
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
    }
  }, [tutorialStep, tutorialSteps.length]);

  const handleMilestoneClose = useCallback(() => {
    SoundEffects.playButtonPress();
    setShowMilestone(false);
    fetchQuestion();
  }, [fetchQuestion]);

  // Utility functions for explanation and swipe handling
  const handleExplanationVisibility = useCallback((isVisible) => {
    setExplanationVisible(isVisible);
  }, []);

  // Error handling
  useEffect(() => {
    if (error && typeof error === 'string') {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Performance optimization to fix forced reflow
  useEffect(() => {
    if (contentRef.current && swipeEnabled) {
      // Read layout properties first
      const width = contentRef.current.offsetWidth;
      const height = contentRef.current.offsetHeight;
      
      // Then batch any writes/mutations
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        }
      });
    }
  }, [swipeEnabled]);

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
              
              {/* CHANGED: Points animation position - near score */}
              {showPointsAnimation && (
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xl font-bold text-green-500 bg-white px-3 py-1 rounded-full shadow-md animate-bounce">
                  +{pointsEarned}
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Welcome Screen */}
      {showWelcome && (
        <InitialWelcome onStart={handleStart} isLoading={isLoading} />
      )}
      
      {/* Section Selection */}
      {showSection && (
        <MainSelection onSelect={handleMainSelection} />
      )}
      
      {/* Tutorial Popup */}
      {showTutorial && (
        <TutorialPopup 
          step={tutorialSteps[tutorialStep]}
          onNext={handleTutorialNext}
          currentStep={tutorialStep + 1}
          totalSteps={tutorialSteps.length}
        />
      )}
      
      {/* Game Mode Popup */}
      {showGameModePopup && (
        <GameModePopup onClose={() => setShowGameModePopup(false)} />
      )}
      
      {/* Milestone Celebration */}
      {showMilestone && (
        <MilestoneCelebration 
          milestone={currentMilestone}
          onClose={handleMilestoneClose}
        />
      )}
      
      {/* Main Content Area */}
      {!showWelcome && !showSection && (
        <>
          {!showQuestion ? (
            <>
              {!isVideoLoading ? (
                <VideoCard 
                  url={currentVideo}
                  onEnd={handleVideoEnd}
                  onSkip={handleVideoSkip}
                  onReady={() => {}}
                  tutorialMode={tutorialMode}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-black">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              
              {/* Add swipe navigation for videos with auto-advance */}
              {!isVideoLoading && (
                <SwipeNavigation 
                  onSwipeUp={handleVideoToQuestionTransition} 
                  enabled={true}
                  isVideo={true}
                  autoAdvanceDelay={30000} // Auto-advance after 30 seconds
                />
              )}
            </>
          ) : (
            <div className="question-container swipe-content" ref={contentRef}>
              {tutorialMode ? (
                <div className="w-full bg-orange-500 text-white py-2 px-4 text-center font-bold">
                  Tutorial Mode: Question {questionsAnswered} of 5
                </div>
              ) : (
                <div className="w-full mb-4 px-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="font-medium">Questions Answered: {questionsAnswered}</span>
                  </div>
                  
                  {/* REMOVED: Orange bar below questions answered text */}
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
                    tutorialMode={tutorialMode}
                    onExplanationShow={handleExplanationVisibility}
                    onExplanationContinue={handleExplanationContinue}
                  />
                  
                  {/* Add swipe navigation in tutorial mode */}
                  {tutorialMode && swipeEnabled && explanationVisible && (
                    <SwipeNavigation 
                      onSwipeUp={handleExplanationContinue} 
                      enabled={true}
                      autoAdvanceDelay={7000} // Auto-advance after 7 seconds
                    />
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
          )}
        </>
      )}
      
      {/* Error message */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              {error.isConfirm ? 'Confirm' : 'Error'}
            </h3>
            <p className="text-gray-700 mb-4">
              {typeof error === 'string' ? error : error.message}
            </p>
            
            {error.isConfirm ? (
              <div className="flex justify-end gap-3">
                <button 
                  onClick={error.onCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={error.onConfirm}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setError(null);
                  if (selectedSection) {
                    fetchQuestion();
                  } else {
                    setShowSection(true);
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Network status indicator */}
      {!networkStatus && (
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          You're offline. Some features may not work.
        </div>
      )}
      
      {/* Debug panel to track tutorial mode issues */}
      <div className="fixed bottom-4 left-4 bg-black bg-opacity-60 text-white text-xs p-2 rounded z-50 max-w-xs">
        <div>Tutorial: {tutorialMode ? 'ON' : 'OFF'}</div>
        <div>Correct: {correctAnswers}/5</div>
        <div>Time Mode: {timeMode ? 'ON' : 'OFF'}</div>
        <div>Streak: {streak}</div>
        <div>Score: {score}</div>
        <div>Videos: {availableVideos}</div>
      </div>
      
      {/* Reset button - visible always for testing */}
      <button
        onClick={() => {
          setError({
            message: 'Reset the application state?',
            isConfirm: true,
            onConfirm: () => {
              setShowWelcome(true);
              setShowSection(false);
              setSelectedSection(null);
              setCurrentQuestion(null);
              setTutorialMode(true);
              setQuestionsAnswered(0);
              setCorrectAnswers(0);
              setStreak(0);
              setAvailableVideos(0);
              setTimeMode(false);
              setScore(0);
              setViewedVideoIds(new Set());
              setError(null);
            },
            onCancel: () => setError(null)
          });
        }}
        className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-70 hover:opacity-100 z-50"
      >
        Reset
      </button>

      {/* CSS for video protection */}
      <style jsx>{`
        /* Video protection overlay */
        #video-protection-overlay, #video-swipe-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          cursor: default;
          touch-action: none;
        }

        /* Makes sure YouTube iframe events don't bubble up */
        .video-container iframe {
          pointer-events: none !important;
        }

        /* Enable pointer events only on controls */
        .video-container .react-player > div > div {
          pointer-events: none !important; 
        }

        /* Enhanced swipe transition */
        .swipe-content {
          position: relative;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 768px) {
          .video-container .react-player {
            max-height: 80vh !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
