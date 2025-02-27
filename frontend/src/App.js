// App.js
import React, { useState, useEffect, useCallback } from 'react';
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
import ClearCacheButton from './components/VQLN/ClearCacheButton';
import YouTubeService from './utils/YouTubeService';
import TutorialPopup from './components/VQLN/Tutorial/TutorialPopup';
import RewardsConfirmation from './components/VQLN/RewardsConfirmation';
import AllDoneMessage from './components/VQLN/AllDoneMessage';
import './styles/theme.css';
import './styles/GameStyles.css';

// API Configuration
const API_BASE_URL = 'https://brain-bites-api.onrender.com';
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

function App() {
  // State variables
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSection, setShowSection] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showAllDoneMessage, setShowAllDoneMessage] = useState(false);
  const [gameMode, setGameMode] = useState(false);
  
  // Tutorial steps configuration
  const tutorialSteps = [
    {
      title: "Welcome to Brain Bites!",
      content: "Let's learn how to use this app. First, you'll be answering trivia questions.",
      element: ".question-container"
    },
    {
      title: "Answer Questions",
      content: "Select the correct answer from the options. For each correct answer, you'll earn streak points.",
      element: ".space-y-3"
    },
    {
      title: "Build Your Streak",
      content: "Your streak counter shows how many questions you've answered correctly in a row.",
      element: ".streak-counter"
    },
    {
      title: "Earn Rewards",
      content: "Every 2 questions you answer correctly, you'll earn a video reward! Reach a streak of 5 to earn double rewards.",
      element: ".fixed.top-4.left-4.z-50"
    },
    {
      title: "Watch Rewards",
      content: "Click the rewards button to watch fun short videos as your reward. You can exit rewards at any time.",
      element: ".fixed.top-4.left-4.z-50"
    },
    {
      title: "Time Mode",
      content: "After you've mastered the basics, you'll enter Time Mode where you can earn points for answering quickly!",
      element: ".score-display"
    },
    {
      title: "Ready to Start?",
      content: "You're all set! Let's begin with your first question.",
      element: ".question-container"
    }
  ];

  // Fetch question with retry logic and ensuring no repeats
  const fetchQuestion = useCallback(async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const endpoint = selectedSection === 'funfacts' 
        ? `${API_BASE_URL}/api/questions/random/funfacts`
        : `${API_BASE_URL}/api/questions/random/psychology`;
        
      const response = await axios.get(endpoint);
      
      if (response.data) {
        // Check if question has been used before
        if (usedQuestionIds.has(response.data.id)) {
          // If we've used all questions from the set (60 total), reset the used set
          if (usedQuestionIds.size >= 60) {
            setUsedQuestionIds(new Set());
          } else {
            // Try getting another question
            return fetchQuestion(retryCount);
          }
        }
        
        // Shuffle answer options
        const shuffledQuestion = {...response.data};
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
        setUsedQuestionIds(prev => new Set([...prev, response.data.id]));
        
        setCurrentQuestion(shuffledQuestion);
        setShowQuestion(true);
        setQuestionsAnswered(prev => prev + 1);
      } else {
        throw new Error('No question data received');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      
      if (retryCount < RETRY_ATTEMPTS) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchQuestion(retryCount + 1);
      }
      
      // If all retries failed, set fallback question
      setError('Failed to fetch question. Using fallback question.');
      setCurrentQuestion({
        id: Math.floor(Math.random() * 1000),
        question: "What is the only mammal capable of true flight?",
        options: {
          A: "Bat",
          B: "Flying squirrel",
          C: "Flying fox",
          D: "Sugar glider"
        },
        correctAnswer: "A",
        explanation: "Bats are the only mammals that can truly fly, as opposed to gliding which some other mammals can do."
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedSection, usedQuestionIds]);

  // Load videos on initial mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videos = await YouTubeService.getViralShorts();
        if (videos && videos.length > 0) {
          setVideos(videos);
        } else {
          throw new Error('No videos found');
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        // Set fallback video
        setVideos([{
          id: 'dummyId',
          url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
          title: 'Sample Video'
        }]);
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
  }, []);

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
      
      // Check if we should reward videos based on tutorial or game mode
      if (tutorialMode) {
        // In tutorial mode, give a reward every 2 questions
        if (correctAnswers % 2 === 1) { // Using correctAnswers, not newStreak
          setAvailableVideos(prev => prev + 1);
        }
        
        // Exit tutorial mode after 5 correct answers
        if (correctAnswers + 1 >= 5) {
          setTutorialMode(false);
          setGameMode(true);
          
          // Show time mode intro after tutorial completion
          setTimeout(() => {
            setTimeMode(true);
            setShowTimeIntro(true);
          }, 1000);
        }
      } else {
        // Game mode reward logic
        if (newStreak % 2 === 0) {
          // Standard reward: 1 video every 2 questions
          setAvailableVideos(prev => prev + 1);
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
        
        // Enhance time mode at streak of 15
        if (newStreak === 15 && timeMode) {
          // Could add additional time pressure or scoring bonuses here
        }
      }
      
      SoundEffects.playCorrect();
      
      // Fetch next question after a delay to show explanation
      setTimeout(() => {
        fetchQuestion();
      }, 3000);
    } else {
      setStreak(0);
      SoundEffects.playIncorrect();
    }
  }, [correctAnswers, fetchQuestion, streak, timeMode, tutorialMode]);

  // Get random videos ensuring no repeats
  const getUniqueRandomVideos = useCallback((count) => {
    const availableVideosList = youtubePersonalization && personalizedVideos.length > 0 
      ? personalizedVideos 
      : videos;
    
    if (!availableVideosList || availableVideosList.length === 0) return [];
    
    const unusedVideos = availableVideosList.filter(video => !usedVideoIds.has(video.id));
    
    // If we've used all videos, reset the used set
    if (unusedVideos.length < count) {
      setUsedVideoIds(new Set());
      return getUniqueRandomVideos(count);
    }
    
    // Select random unused videos
    const selectedVideos = [];
    const tempUnusedVideos = [...unusedVideos];
    
    while (selectedVideos.length < count && tempUnusedVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * tempUnusedVideos.length);
      const video = tempUnusedVideos[randomIndex];
      
      // Remove the selected video from the temp array
      tempUnusedVideos.splice(randomIndex, 1);
      
      // Add to selected videos
      selectedVideos.push(video);
      
      // Mark as used
      setUsedVideoIds(prev => new Set([...prev, video.id]));
    }
    
    return selectedVideos;
  }, [personalizedVideos, videos, youtubePersonalization, usedVideoIds]);

  // Start watching all rewards
  const startWatchingAllRewards = useCallback(() => {
    if (availableVideos <= 0) return;
    
    // Get unique videos for all available rewards
    const videosToWatch = getUniqueRandomVideos(availableVideos);
    
    if (videosToWatch.length > 0) {
      setRewardsToWatch(videosToWatch);
      setCurrentVideoIndex(0);
      setCurrentVideo(videosToWatch[0]);
      setWatchingAllRewards(true);
      setShowQuestion(false);
      setAvailableVideos(0); // Reset available videos count
    }
  }, [availableVideos, getUniqueRandomVideos]);

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
      // Single video mode (legacy support)
      setShowQuestion(true);
    }
  }, [watchingAllRewards, currentVideoIndex, rewardsToWatch]);

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
      // Single video mode (legacy support)
      setShowQuestion(true);
    }
  }, [watchingAllRewards, currentVideoIndex, rewardsToWatch]);

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

  // Watch a single reward video (legacy support)
  const watchSingleRewardVideo = useCallback(() => {
    if (availableVideos > 0) {
      const videoToWatch = getUniqueRandomVideos(1)[0];
      if (videoToWatch) {
        setCurrentVideo(videoToWatch);
        setShowQuestion(false);
        setAvailableVideos(prev => prev - 1);
      }
    }
  }, [availableVideos, getUniqueRandomVideos]);

  // Handle tutorial step navigation
  const handleNextTutorialStep = useCallback(() => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
    }
  }, [tutorialStep, tutorialSteps.length]);

  return (
    <div className="app">
      <ClearCacheButton />
      
      {!showWelcome && !showSection && (
        <>
          <YouTubeLogin onLoginStatusChange={handleYouTubeLogin} />
          
          {showQuestion && !isLoading && (
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
              <ProgressBar 
                questionsAnswered={questionsAnswered}
                tutorialMode={tutorialMode}
              />
              
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
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
              
              {showExitConfirmation && (
                <RewardsConfirmation 
                  onConfirm={confirmExitRewards}
                  onCancel={cancelExitRewards}
                  remainingVideos={rewardsToWatch.length - currentVideoIndex - 1}
                />
              )}
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
      
      {/* Error message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default App;
