// App.js - Main application file
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from './components/VQLN/Video/VideoCard';
import QuestionCard from './components/VQLN/Question/QuestionCard';
import InitialWelcome from './components/VQLN/Welcome/InitialWelcome';
import MainSelection from './components/VQLN/Selection/MainSelection';
import YouTubeLogin from './components/VQLN/YouTubeLogin';
import SoundEffects from './utils/SoundEffects';
import ClearCacheButton from './components/VQLN/ClearCacheButton';
import YouTubeService from './utils/YouTubeService';
import './styles/App.css';

function App() {
  // Existing state variables
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

  // New state variables for the gamification system
  const [tutorialMode, setTutorialMode] = useState(true);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [availableVideos, setAvailableVideos] = useState(0);
  const [timeMode, setTimeMode] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(10); // seconds
  const [score, setScore] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [showTimeIntro, setShowTimeIntro] = useState(false);

  // API base URL - can be configured for development/production
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  // Load videos on initial mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        // Try to get cached videos first
        const cachedVideos = YouTubeService.getVideos();
        if (cachedVideos && cachedVideos.length > 0) {
          setVideos(cachedVideos);
          setIsLoading(false);
          return;
        }

        // If no cached videos, fetch from public file
        const response = await fetch('/youtube-videos.json');
        if (!response.ok) throw new Error('Failed to fetch videos');
        const data = await response.json();
        
        if (data && data.videos && data.videos.length > 0) {
          setVideos(data.videos);
          YouTubeService.setVideos(data.videos);
          setIsLoading(false);
        } else {
          throw new Error('No videos found');
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        setIsLoading(false);
        // Set some dummy data if fetching fails
        setVideos([
          {
            id: 'dummyId',
            url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
            title: 'Sample Video'
          }
        ]);
      }
    };

    loadVideos();
    SoundEffects.preloadSounds();
  }, []);

  // Function to watch a reward video from the accumulated rewards
  const watchRewardVideo = () => {
    if (availableVideos > 0) {
      setAvailableVideos(prev => prev - 1);
      setShowQuestion(false); // Switch to video view
      setRandomVideo(); // Get a random video to play
    }
  };

  // Function to handle milestone achievements (every 5 correct answers)
  const checkMilestone = (newStreak) => {
    if (newStreak >= 5 && newStreak % 5 === 0) {
      setCurrentMilestone(newStreak);
      setShowMilestone(true);
      SoundEffects.playStreak();
      return true;
    }
    return false;
  };

  // Set a random video from the available videos
  const setRandomVideo = () => {
    setVideoReady(false);
    const availableVideosList = youtubePersonalization && personalizedVideos.length > 0 
      ? personalizedVideos 
      : videos;
    
    if (availableVideosList && availableVideosList.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableVideosList.length);
      setCurrentVideo(availableVideosList[randomIndex]);
    }
  };

  // Fetch a random question from the API
  const fetchQuestion = async () => {
    try {
      let endpoint = `${API_BASE_URL}/api/questions/random`;
      
      // Use category-specific endpoint if a section is selected
      if (selectedSection) {
        endpoint = `${API_BASE_URL}/api/questions/random/${selectedSection}`;
      }

      const response = await axios.get(endpoint);
      setCurrentQuestion(response.data);
      
      // Reset timer for time mode
      if (timeMode) {
        setTimeRemaining(10);
        setQuestionStartTime(Date.now());
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      // Fallback question in case API fails
      setCurrentQuestion({
        id: 0,
        question: "What is the capital of France?",
        options: {
          A: "London",
          B: "Paris",
          C: "Berlin",
          D: "Madrid"
        },
        correctAnswer: "B",
        explanation: "Paris is the capital city of France."
      });
    }
  };

  // Modified function to handle answer submission with new logic
  const handleAnswerSubmit = (isCorrect, answerTime = null) => {
    if (isCorrect) {
      // Calculate score if in time mode
      if (timeMode && answerTime !== null) {
        const timeScore = Math.max(10, Math.floor(100 - (answerTime * 9)));
        setScore(prevScore => prevScore + timeScore);
      }
      
      // Increment streak and questions answered
      const newStreak = streak + 1;
      setStreak(newStreak);
      setQuestionsAnswered(prev => prev + 1);
      
      // Check if we're in tutorial mode
      if (tutorialMode) {
        // In tutorial mode, each correct answer grants a video
        setAvailableVideos(prev => prev + 1);
        
        // Exit tutorial mode after 5 questions
        if (questionsAnswered >= 4) {
          setTutorialMode(false);
        }
        
        // In tutorial mode, always show a video after correct answer
        setShowQuestion(false);
        setRandomVideo();
      } 
      // Standard mode streak rewards
      else {
        // Check for milestone and award video
        const isMilestone = checkMilestone(newStreak);
        if (isMilestone) {
          setAvailableVideos(prev => prev + 1);
        }
        
        // In standard mode, continue to next question
        fetchQuestion();
      }
      
      // Enable time mode after 10 questions
      if (questionsAnswered === 9 && !timeMode) {
        setTimeMode(true);
        setShowTimeIntro(true);
      }
      
      // Play success sound
      SoundEffects.playCorrect();
    } else {
      // Wrong answer
      setStreak(0); // Reset streak
      SoundEffects.playIncorrect();
      
      // Stay on the same question (will be handled by QuestionCard)
    }
  };

  // Handle video end - return to questions
  const handleVideoEnd = () => {
    setShowQuestion(true);
    fetchQuestion();
  };

  // Handle video skip (using down arrow)
  const handleVideoSkip = () => {
    setShowQuestion(true);
    fetchQuestion();
  };

  // Handle video ready state
  const handleVideoReady = () => {
    setVideoReady(true);
  };

  // Handle start button click
  const handleStart = () => {
    SoundEffects.playTransition();
    setShowWelcome(false);
    setShowSection(true);
  };

  // Handle section selection (Psychology or Fun Facts)
  const handleMainSelection = (section) => {
    SoundEffects.playTransition();
    setSelectedSection(section);
    setShowSection(false);
    fetchQuestion();
  };

  // Add this for milestone modal
  const handleMilestoneClose = () => {
    setShowMilestone(false);
  };

  // Add this for time mode intro modal
  const handleTimeIntroClose = () => {
    setShowTimeIntro(false);
  };

  // Handle YouTube login status change
  const handleYouTubeLogin = (isLoggedIn, personalizedVideos = []) => {
    setYoutubePersonalization(isLoggedIn);
    if (isLoggedIn && personalizedVideos.length > 0) {
      setPersonalizedVideos(personalizedVideos);
    }
  };

  // RewardsButton component - will be created later
  const RewardsButton = ({ availableVideos, onWatchVideo }) => {
    const [showRewards, setShowRewards] = useState(false);
    
    return (
      <>
        <button 
          onClick={() => setShowRewards(true)}
          className="fixed top-4 left-4 z-50 bg-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
        >
          <span className="icon-video"></span>
          <span>{availableVideos}</span>
        </button>
        
        {showRewards && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Your Rewards</h2>
                <button onClick={() => setShowRewards(false)}>
                  <span className="icon-close"></span>
                </button>
              </div>
              
              <div className="text-center mb-6">
                <span className="icon-video text-4xl text-orange-500"></span>
                <p className="text-2xl font-bold">{availableVideos}</p>
                <p className="text-gray-600">Available Videos</p>
              </div>
              
              {availableVideos > 0 ? (
                <button 
                  onClick={() => {
                    onWatchVideo();
                    setShowRewards(false);
                  }}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium"
                >
                  Watch Now
                </button>
              ) : (
                <p className="text-center text-gray-600">
                  Answer more questions correctly to earn video rewards!
                </p>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  // ProgressBar component - will be created later
  const ProgressBar = ({ questionsAnswered, tutorialMode }) => {
    const barLabel = tutorialMode 
      ? `Tutorial: ${questionsAnswered}/5`
      : `Questions: ${questionsAnswered}`;
    
    const percentage = tutorialMode 
      ? (questionsAnswered / 5) * 100
      : 100;
      
    return (
      <div className="w-full mb-4 px-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{barLabel}</span>
          {tutorialMode && <span>{questionsAnswered}/5</span>}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // ScoreDisplay component - will be created later
  const ScoreDisplay = ({ score, timeMode }) => {
    if (!timeMode) return null;
    
    return (
      <div className="fixed top-4 right-4 z-40 bg-white shadow-md rounded-full px-4 py-2 flex items-center gap-2">
        <span className="icon-award text-orange-500"></span>
        <span className="font-bold">{score}</span>
      </div>
    );
  };

  // MilestoneCelebration component - will be created later
  const MilestoneCelebration = ({ milestone, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }, [onClose]);
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
        <div className="bg-white rounded-xl p-6 text-center max-w-sm mx-4">
          <div className="mb-4 flex justify-center">
            <div className="bg-orange-500 text-white rounded-full p-4">
              <span className="icon-award text-3xl"></span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Streak Milestone!</h2>
          <p className="text-lg mb-4">You've answered {milestone} questions correctly in a row!</p>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="icon-video text-orange-500 text-2xl"></span>
            <span className="icon-arrow-up text-green-500"></span>
            <span className="text-xl font-bold">+1 Video Reward</span>
          </div>
          
          <button 
            onClick={onClose}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  // TimeModeIntro component - will be created later
  const TimeModeIntro = ({ onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }, [onClose]);
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
        <div className="bg-white rounded-xl p-6 text-center max-w-sm mx-4">
          <div className="mb-4 flex justify-center">
            <div className="bg-blue-600 text-white rounded-full p-4">
              <span className="icon-clock text-3xl"></span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Time Mode Activated!</h2>
          <p className="mb-4">You now have 10 seconds to answer each question.</p>
          <p className="mb-4">Answer quickly for more points!</p>
          
          <div className="flex justify-center items-center gap-2 mb-4">
            <span className="icon-zap text-yellow-500 text-2xl"></span>
            <span className="text-lg font-medium">Fast = More Points</span>
          </div>
          
          <div className="w-full bg-gray-200 h-1 mt-4">
            <div className="h-1 bg-orange-500 animate-shrink"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <ClearCacheButton />
      
      {!showWelcome && !showSection && (
        <>
          <YouTubeLogin onLoginStatusChange={handleYouTubeLogin} />
          
          {/* Add rewards button when questions are showing */}
          {showQuestion && !tutorialMode && (
            <RewardsButton 
              availableVideos={availableVideos} 
              onWatchVideo={watchRewardVideo} 
            />
          )}
          
          {/* Add score display */}
          <ScoreDisplay score={score} timeMode={timeMode} />
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
              {/* Add progress bar */}
              <ProgressBar 
                questionsAnswered={questionsAnswered} 
                tutorialMode={tutorialMode} 
              />
              
              {/* Updated QuestionCard with new props */}
              <QuestionCard 
                question={currentQuestion} 
                onAnswerSubmit={handleAnswerSubmit}
                timeMode={timeMode}
                streak={streak}
              />
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

      {/* Modals */}
      {showMilestone && (
        <MilestoneCelebration 
          milestone={currentMilestone} 
          onClose={handleMilestoneClose} 
        />
      )}
      
      {showTimeIntro && (
        <TimeModeIntro onClose={handleTimeIntroClose} />
      )}
    </div>
  );
}

export default App;
