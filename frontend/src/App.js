// Complete Updated App.js with all fixes
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
import YouTubeLogin from './components/VQLN/YouTubeLogin';
import RewardsConfirmation from './components/VQLN/RewardsConfirmation';
import AllDoneMessage from './components/VQLN/AllDoneMessage';
import StorageService from './utils/StorageService';
import { Home, X } from 'lucide-react';
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
  
  // New state variables for added features
  const [isYouTubeSignedIn, setIsYouTubeSignedIn] = useState(false);
  const [showRewardsConfirmation, setShowRewardsConfirmation] = useState(false);
  const [showAllDoneMessage, setShowAllDoneMessage] = useState(false);
  const [inRewardsFlow, setInRewardsFlow] = useState(false);
  const [totalVideos, setTotalVideos] = useState(0);

  // Refs for performance optimization
  const contentRef = useRef(null);
  // Add this ref to track tutorial mode changes
  const prevTutorialMode = useRef(true);
  
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

  // Add effect to load saved state on mount
  useEffect(() => {
    const loadSavedState = () => {
      // Check if tutorial already completed
      const tutorialCompleted = StorageService.isTutorialCompleted();
      if (tutorialCompleted) {
        setTutorialMode(false);
        // IMPORTANT: Activate time mode if tutorial is completed
        setTimeMode(true);
      }
      
      // Load saved score
      const savedScore = StorageService.getScore();
      if (savedScore > 0) {
        setScore(savedScore);
      }
      
      // Load available videos
      const savedVideos = StorageService.getAvailableVideos();
      if (savedVideos > 0) {
        setAvailableVideos(savedVideos);
      }
      
      // Load other stats for display
      const questionsAnswered = StorageService.getTotalQuestionsAnswered();
      if (questionsAnswered > 0) {
        setQuestionsAnswered(questionsAnswered);
      }
      
      const correctAnswers = StorageService.getTotalCorrectAnswers();
      if (correctAnswers > 0) {
        setCorrectAnswers(correctAnswers);
      }
    };
    
    loadSavedState();
  }, []);

  // Add effect to save state when it changes
  useEffect(() => {
    // Don't save during tutorial mode
    if (!tutorialMode) {
      // Save score
      StorageService.saveScore(score);
      StorageService.saveHighScore(score);
      
      // Save available videos
      StorageService.saveAvailableVideos(availableVideos);
      
      // Save highest streak
      StorageService.saveHighestStreak(streak);
      
      // Save total questions answered and correct answers
      StorageService.saveTotalQuestionsAnswered(questionsAnswered);
      StorageService.saveTotalCorrectAnswers(correctAnswers);
    }
    
    // Mark tutorial as completed when exiting tutorial mode
    if (!tutorialMode && prevTutorialMode.current) {
      StorageService.setTutorialCompleted(true);
    }
    
    // Keep track of previous tutorial mode state
    prevTutorialMode.current = tutorialMode;
  }, [score, availableVideos, streak, questionsAnswered, correctAnswers, tutorialMode]);
  
  // Helper function to finish rewards flow
  const finishRewardsFlow = useCallback(() => {
    setShowAllDoneMessage(true);
    
    // Exit rewards flow after delay
    setTimeout(() => {
      setInRewardsFlow(false);
      setCurrentVideo(null);
      setShowQuestion(true);
      setShowAllDoneMessage(false);
    }, 3000);
  }, []);
  
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
  }, [processCorrectAnswer, processIncorrectAnswer, tutorialMode, timeMode]);

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

  // Updated watchVideo function with rewards flow
  const watchVideo = useCallback(async () => {
    if (availableVideos <= 0) return;
    
    try {
      setIsVideoLoading(true);
      
      // Set the rewards flow flag
      setInRewardsFlow(true);
      
      // Store total videos count for progress indicator
      setTotalVideos(availableVideos);
      
      // Get fresh videos directly from service to ensure variety - get enough for ALL rewards
      const freshVideos = await YouTubeService.getViralShorts(Math.min(availableVideos * 2, 20));
      console.log(`Got ${freshVideos.length} fresh videos for reward watching`);
      
      if (freshVideos && freshVideos.length > 0) {
        // Find a video that hasn't been viewed recently
        let newVideo = freshVideos.find(video => !viewedVideoIds.has(video.id));
        
        // If all videos viewed, reset tracking and use first
        if (!newVideo) {
          console.log("All videos viewed, resetting tracking");
          // Keep track of very last video to avoid immediate repetition
          const lastVideoId = Array.from(viewedVideoIds).pop();
          setViewedVideoIds(new Set(lastVideoId ? [lastVideoId] : []));
          
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
        
        // Decrement available videos only when viewing
        setAvailableVideos(prev => prev - 1);
        setSwipeEnabled(true);
        
        // Add a class to body for TikTok-style video transitions
        document.body.classList.add('video-transition-active');
      } else {
        throw new Error("No videos available");
      }
    } catch (error) {
      console.error('Error loading video:', error);
      setError("Couldn't load video: " + error.message);
      fetchQuestion();
      setInRewardsFlow(false); // Exit rewards flow mode on error
    } finally {
      setIsVideoLoading(false);
    }
  }, [availableVideos, fetchQuestion, viewedVideoIds]);

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    // We don't do anything here because the VideoCard now handles
    // video completion with its replay functionality
    // The user will need to manually proceed after the video ends
    
    console.log("Video ended notification received in App component");
  }, []);

  // Updated handleVideoSkip for the continuous rewards flow
  const handleVideoSkip = useCallback(() => {
    console.log("Video skip handler called", { inRewardsFlow, availableVideos });
    
    // Mark current video as viewed
    if (currentVideo && currentVideo.id) {
      setViewedVideoIds(prev => new Set([...prev, currentVideo.id]));
    }
    
    // If in rewards flow and more videos available, go to next video
    if (inRewardsFlow && availableVideos > 0) {
      console.log("Getting next reward video");
      // Get the next video
      const nextVideo = getRandomVideo();
      if (nextVideo) {
        console.log("Found next video:", nextVideo.id);
        
        // Apply entering-from-bottom animation by briefly adding class to body
        document.body.classList.add('video-transition-active');
        
        // Set the next video after a brief delay to allow animation to start
        setTimeout(() => {
          // Set the next video
          setCurrentVideo(nextVideo);
          // Mark it as viewed
          setViewedVideoIds(prev => new Set([...prev, nextVideo.id]));
          // Decrement available videos
          setAvailableVideos(prev => prev - 1);
          
          // Remove class after transition completes
          setTimeout(() => {
            document.body.classList.remove('video-transition-active');
          }, 400);
        }, 50);
        
        return;
      } else {
        console.log("No next video found");
      }
    }
    
    // If in rewards flow but no more videos available, show completion message
    if (inRewardsFlow && availableVideos === 0) {
      console.log("No more rewards available, finishing flow");
      finishRewardsFlow();
      return;
    }
    
    // Only if not in rewards flow, go back to questions
    if (!inRewardsFlow) {
      console.log("Not in rewards flow, going back to questions");
      setCurrentVideo(null);
      setShowQuestion(true);
      
      // In tutorial mode, fetch next question after video
      if (tutorialMode) {
        fetchQuestion();
      }
    }
  }, [tutorialMode, fetchQuestion, currentVideo, availableVideos, inRewardsFlow, getRandomVideo, finishRewardsFlow]);
  
  // Handle rewards confirmation responses
  const handleConfirmExitRewards = useCallback(() => {
    setShowRewardsConfirmation(false);
    
    // Exit the rewards flow
    setInRewardsFlow(false);
    
    // Clear current video to force a refresh next time
    setCurrentVideo(null);
    setShowQuestion(true);
    
    // Save state after exiting
    if (!tutorialMode) {
      StorageService.saveAvailableVideos(availableVideos);
    }
  }, [tutorialMode, availableVideos]);

  const handleCancelExitRewards = useCallback(() => {
    setShowRewardsConfirmation(false);
    // Continue with the current video
  }, []);
  
  // Updated handleVideoToQuestionTransition for manual transitions
  const handleVideoToQuestionTransition = useCallback(() => {
    console.log("Video to question transition handler called", { inRewardsFlow });
    
    // If in rewards flow, treat this the same as a skip - go to next video
    if (inRewardsFlow) {
      console.log("In rewards flow, redirecting to handleVideoSkip");
      handleVideoSkip();
      return;
    }
    
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
  }, [tutorialMode, fetchQuestion, currentVideo, handleVideoSkip, inRewardsFlow]);

  // Handle YouTube login status change
  const handleYouTubeLoginStatusChange = useCallback((isSignedIn, videos = []) => {
    setIsYouTubeSignedIn(isSignedIn);
    
    // In a real implementation, this would use the personalized videos
    // For now, just show a message
    if (isSignedIn) {
      setError({
        message: 'YouTube connected! This feature is in beta.',
        isConfirm: false,
        onConfirm: () => setError(null)
      });
      
      // Add any obtained videos to the list if there are any
      if (videos && videos.length > 0) {
        setVideos(prevVideos => {
          // Filter out duplicates
          const existingIds = new Set(prevVideos.map(v => v.id));
          const newVideos = videos.filter(v => !existingIds.has(v.id));
          
          return [...prevVideos, ...newVideos];
        });
      }
    }
  }, []);

  // Add "Go Home" handler
  const handleGoHome = useCallback(() => {
    SoundEffects.playTransition();
    
    // Confirm if user wants to go back to section selection
    setError({
      message: 'Return to main menu? Your progress will be saved.',
      isConfirm: true,
      onConfirm: () => {
        // Save current state before navigating
        if (!tutorialMode) {
          StorageService.saveGameState({
            score,
            availableVideos,
            questionsAnswered,
            correctAnswers,
            streak,
            selectedSection
          });
        }
        
        // Navigate to section selection
        setShowSection(true);
        setSelectedSection(null);
        setCurrentQuestion(null);
        setError(null);
      },
      onCancel: () => setError(null)
    });
  }, [tutorialMode, score, availableVideos, questionsAnswered, correctAnswers, streak, selectedSection]);

  // Navigation handlers
  const handleStart = useCallback(() => {
    SoundEffects.playTransition();
    SoundEffects.playButtonPress();
    
    setShowWelcome(false);
    setShowSection(true);
  }, []);

// Complete Updated App.js with all fixes
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
import YouTubeLogin from './components/VQLN/YouTubeLogin';
import RewardsConfirmation from './components/VQLN/RewardsConfirmation';
import AllDoneMessage from './components/VQLN/AllDoneMessage';
import StorageService from './utils/StorageService';
import { Home, X } from 'lucide-react';
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
  
  // New state variables for added features
  const [isYouTubeSignedIn, setIsYouTubeSignedIn] = useState(false);
  const [showRewardsConfirmation, setShowRewardsConfirmation] = useState(false);
  const [showAllDoneMessage, setShowAllDoneMessage] = useState(false);
  const [inRewardsFlow, setInRewardsFlow] = useState(false);
  const [totalVideos, setTotalVideos] = useState(0);

  // Refs for performance optimization
  const contentRef = useRef(null);
  // Add this ref to track tutorial mode changes
  const prevTutorialMode = useRef(true);
  
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

  // Add effect to load saved state on mount
  useEffect(() => {
    const loadSavedState = () => {
      // Check if tutorial already completed
      const tutorialCompleted = StorageService.isTutorialCompleted();
      if (tutorialCompleted) {
        setTutorialMode(false);
        // IMPORTANT: Activate time mode if tutorial is completed
        setTimeMode(true);
      }
      
      // Load saved score
      const savedScore = StorageService.getScore();
      if (savedScore > 0) {
        setScore(savedScore);
      }
      
      // Load available videos
      const savedVideos = StorageService.getAvailableVideos();
      if (savedVideos > 0) {
        setAvailableVideos(savedVideos);
      }
      
      // Load other stats for display
      const questionsAnswered = StorageService.getTotalQuestionsAnswered();
      if (questionsAnswered > 0) {
        setQuestionsAnswered(questionsAnswered);
      }
      
      const correctAnswers = StorageService.getTotalCorrectAnswers();
      if (correctAnswers > 0) {
        setCorrectAnswers(correctAnswers);
      }
    };
    
    loadSavedState();
  }, []);

  // Add effect to save state when it changes
  useEffect(() => {
    // Don't save during tutorial mode
    if (!tutorialMode) {
      // Save score
      StorageService.saveScore(score);
      StorageService.saveHighScore(score);
      
      // Save available videos
      StorageService.saveAvailableVideos(availableVideos);
      
      // Save highest streak
      StorageService.saveHighestStreak(streak);
      
      // Save total questions answered and correct answers
      StorageService.saveTotalQuestionsAnswered(questionsAnswered);
      StorageService.saveTotalCorrectAnswers(correctAnswers);
    }
    
    // Mark tutorial as completed when exiting tutorial mode
    if (!tutorialMode && prevTutorialMode.current) {
      StorageService.setTutorialCompleted(true);
    }
    
    // Keep track of previous tutorial mode state
    prevTutorialMode.current = tutorialMode;
  }, [score, availableVideos, streak, questionsAnswered, correctAnswers, tutorialMode]);
  
  // Helper function to finish rewards flow
  const finishRewardsFlow = useCallback(() => {
    setShowAllDoneMessage(true);
    
    // Exit rewards flow after delay
    setTimeout(() => {
      setInRewardsFlow(false);
      setCurrentVideo(null);
      setShowQuestion(true);
      setShowAllDoneMessage(false);
    }, 3000);
  }, []);
  
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
  }, [processCorrectAnswer, processIncorrectAnswer, tutorialMode, timeMode]);

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

  // Updated watchVideo function with rewards flow
  const watchVideo = useCallback(async () => {
    if (availableVideos <= 0) return;
    
    try {
      setIsVideoLoading(true);
      
      // Set the rewards flow flag
      setInRewardsFlow(true);
      
      // Store total videos count for progress indicator
      setTotalVideos(availableVideos);
      
      // Get fresh videos directly from service to ensure variety - get enough for ALL rewards
      const freshVideos = await YouTubeService.getViralShorts(Math.min(availableVideos * 2, 20));
      console.log(`Got ${freshVideos.length} fresh videos for reward watching`);
      
      if (freshVideos && freshVideos.length > 0) {
        // Find a video that hasn't been viewed recently
        let newVideo = freshVideos.find(video => !viewedVideoIds.has(video.id));
        
        // If all videos viewed, reset tracking and use first
        if (!newVideo) {
          console.log("All videos viewed, resetting tracking");
          // Keep track of very last video to avoid immediate repetition
          const lastVideoId = Array.from(viewedVideoIds).pop();
          setViewedVideoIds(new Set(lastVideoId ? [lastVideoId] : []));
          
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
        
        // Decrement available videos only when viewing
        setAvailableVideos(prev => prev - 1);
        setSwipeEnabled(true);
        
        // Add a class to body for TikTok-style video transitions
        document.body.classList.add('video-transition-active');
      } else {
        throw new Error("No videos available");
      }
    } catch (error) {
      console.error('Error loading video:', error);
      setError("Couldn't load video: " + error.message);
      fetchQuestion();
      setInRewardsFlow(false); // Exit rewards flow mode on error
    } finally {
      setIsVideoLoading(false);
    }
  }, [availableVideos, fetchQuestion, viewedVideoIds]);

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    // We don't do anything here because the VideoCard now handles
    // video completion with its replay functionality
    // The user will need to manually proceed after the video ends
    
    console.log("Video ended notification received in App component");
  }, []);

  // Updated handleVideoSkip for the continuous rewards flow
  const handleVideoSkip = useCallback(() => {
    console.log("Video skip handler called", { inRewardsFlow, availableVideos });
    
    // Mark current video as viewed
    if (currentVideo && currentVideo.id) {
      setViewedVideoIds(prev => new Set([...prev, currentVideo.id]));
    }
    
    // If in rewards flow and more videos available, go to next video
    if (inRewardsFlow && availableVideos > 0) {
      console.log("Getting next reward video");
      // Get the next video
      const nextVideo = getRandomVideo();
      if (nextVideo) {
        console.log("Found next video:", nextVideo.id);
        
        // Apply entering-from-bottom animation by briefly adding class to body
        document.body.classList.add('video-transition-active');
        
        // Set the next video after a brief delay to allow animation to start
        setTimeout(() => {
          // Set the next video
          setCurrentVideo(nextVideo);
          // Mark it as viewed
          setViewedVideoIds(prev => new Set([...prev, nextVideo.id]));
          // Decrement available videos
          setAvailableVideos(prev => prev - 1);
          
          // Remove class after transition completes
          setTimeout(() => {
            document.body.classList.remove('video-transition-active');
          }, 400);
        }, 50);
        
        return;
      } else {
        console.log("No next video found");
      }
    }
    
    // If in rewards flow but no more videos available, show completion message
    if (inRewardsFlow && availableVideos === 0) {
      console.log("No more rewards available, finishing flow");
      finishRewardsFlow();
      return;
    }
    
    // Only if not in rewards flow, go back to questions
    if (!inRewardsFlow) {
      console.log("Not in rewards flow, going back to questions");
      setCurrentVideo(null);
      setShowQuestion(true);
      
      // In tutorial mode, fetch next question after video
      if (tutorialMode) {
        fetchQuestion();
      }
    }
  }, [tutorialMode, fetchQuestion, currentVideo, availableVideos, inRewardsFlow, getRandomVideo, finishRewardsFlow]);
  
  // Handle rewards confirmation responses
  const handleConfirmExitRewards = useCallback(() => {
    setShowRewardsConfirmation(false);
    
    // Exit the rewards flow
    setInRewardsFlow(false);
    
    // Clear current video to force a refresh next time
    setCurrentVideo(null);
    setShowQuestion(true);
    
    // Save state after exiting
    if (!tutorialMode) {
      StorageService.saveAvailableVideos(availableVideos);
    }
  }, [tutorialMode, availableVideos]);

  const handleCancelExitRewards = useCallback(() => {
    setShowRewardsConfirmation(false);
    // Continue with the current video
  }, []);
  
  // Updated handleVideoToQuestionTransition for manual transitions
  const handleVideoToQuestionTransition = useCallback(() => {
    console.log("Video to question transition handler called", { inRewardsFlow });
    
    // If in rewards flow, treat this the same as a skip - go to next video
    if (inRewardsFlow) {
      console.log("In rewards flow, redirecting to handleVideoSkip");
      handleVideoSkip();
      return;
    }
    
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
  }, [tutorialMode, fetchQuestion, currentVideo, handleVideoSkip, inRewardsFlow]);

  // Handle YouTube login status change
  const handleYouTubeLoginStatusChange = useCallback((isSignedIn, videos = []) => {
    setIsYouTubeSignedIn(isSignedIn);
    
    // In a real implementation, this would use the personalized videos
    // For now, just show a message
    if (isSignedIn) {
      setError({
        message: 'YouTube connected! This feature is in beta.',
        isConfirm: false,
        onConfirm: () => setError(null)
      });
      
      // Add any obtained videos to the list if there are any
      if (videos && videos.length > 0) {
        setVideos(prevVideos => {
          // Filter out duplicates
          const existingIds = new Set(prevVideos.map(v => v.id));
          const newVideos = videos.filter(v => !existingIds.has(v.id));
          
          return [...prevVideos, ...newVideos];
        });
      }
    }
  }, []);

  // Add "Go Home" handler
  const handleGoHome = useCallback(() => {
    SoundEffects.playTransition();
    
    // Confirm if user wants to go back to section selection
    setError({
      message: 'Return to main menu? Your progress will be saved.',
      isConfirm: true,
      onConfirm: () => {
        // Save current state before navigating
        if (!tutorialMode) {
          StorageService.saveGameState({
            score,
            availableVideos,
            questionsAnswered,
            correctAnswers,
            streak,
            selectedSection
          });
        }
        
        // Navigate to section selection
        setShowSection(true);
        setSelectedSection(null);
        setCurrentQuestion(null);
        setError(null);
      },
      onCancel: () => setError(null)
    });
  }, [tutorialMode, score, availableVideos, questionsAnswered, correctAnswers, streak, selectedSection]);

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
