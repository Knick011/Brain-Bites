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

  // Fetch question with retry logic
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
        // In tutorial mode, immediately play a video after each correct answer
        if (videos.length > 0) {
          // Select a random video that hasn't been used recently
          const unusedVideos = videos.filter(v => !usedVideoIds.has(v.id));
          const videoToPlay = unusedVideos.length > 0 
            ? unusedVideos[Math.floor(Math.random() * unusedVideos.length)]
            : videos[Math.floor(Math.random() * videos.length)];
          
          // Mark video as used
          setUsedVideoIds(prev => new Set([...prev, videoToPlay.id]));
          
          // Show video after a delay to let user see the correct answer
          setTimeout(() => {
            setCurrentVideo(videoToPlay);
            setShowQuestion(false);
          }, 3000);
        }
        
        // Exit tutorial mode after 5 correct answers
        if (correctAnswers + 1 >= 5) {
          setTimeout(() => {
            setTutorialMode(false);
            
            // Show time mode intro after tutorial completion
            setTimeout(() => {
              setTimeMode(true);
              setShowTimeIntro(true);
            }, 1000);
          }, 3000);
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
      }
      
      SoundEffects.playCorrect();
      
      // Fetch next question after a delay to show explanation
      // Only if not in tutorial mode - in tutorial we go to video first
      if (!tutorialMode) {
        setTimeout(() => {
          fetchQuestion();
        }, 3000);
      }
    } else {
      setStreak(0);
      SoundEffects.playIncorrect();
      
      // Fetch a new question after a delay
      setTimeout(() => {
        fetchQuestion();
      }, 3000);
    }
  }, [correctAnswers, fetchQuestion, streak, timeMode, tutorialMode, videos, usedVideoIds]);

  // Set random video
  const setRandomVideo = useCallback(() => {
    setVideoReady(false);
    
    if (videos && videos.length > 0) {
      // Select a random video that hasn't been used recently
      const unusedVideos = videos.filter(v => !usedVideoIds.has(v.id));
      const randomVideo = unusedVideos.length > 0 
        ? unusedVideos[Math.floor(Math.random() * unusedVideos.length)]
        : videos[Math.floor(Math.random() * videos.length)];
      
      // Mark video as used
      setUsedVideoIds(prev => new Set([...prev, randomVideo.id]));
      
      setCurrentVideo(randomVideo);
    }
  }, [videos, usedVideoIds]);

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

  // Watch reward video
  const watchRewardVideo = useCallback(() => {
    if (availableVideos > 0) {
      setAvailableVideos(prev => prev - 1);
      setRandomVideo();
      setShowQuestion(false);
    }
  }, [availableVideos, setRandomVideo]);

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
      {!showWelcome && !showSection && (
        <>
          <YouTubeLogin onLoginStatusChange={handleYouTubeLogin} />
          
          {showQuestion && !isLoading && !tutorialMode && (
            <RewardsButton 
              availableVideos={availableVideos} 
              onWatchVideo={watchRewardVideo} 
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
                  tutorialMode={tutorialMode}
                />
              )}
              
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
            <VideoCard 
              url={currentVideo?.url}
              onEnd={handleVideoEnd}
              onSkip={handleVideoSkip}
              onReady={handleVideoReady}
            />
          )}
        </>
      )}

      {/* Tutorial Popup */}
      {showTutorial && (
        <div className="fixed bottom-0 inset-x-0 p-4 bg-white shadow-lg rounded-t-lg border border-gray-200 z-50">
          <h3 className="text-lg font-bold mb-2">{tutorialSteps[tutorialStep].title}</h3>
          <p className="mb-4">{tutorialSteps[tutorialStep].content}</p>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Step {tutorialStep + 1} of {tutorialSteps.length}
            </div>
            <button 
              onClick={handleNextTutorialStep}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
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
