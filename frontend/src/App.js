// App.js
import React, { useState, useEffect } from 'react';
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
  const [streak, setStreak] = useState(0);
  const [availableVideos, setAvailableVideos] = useState(0);
  const [timeMode, setTimeMode] = useState(false);
  const [score, setScore] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [showTimeIntro, setShowTimeIntro] = useState(false);
  const [error, setError] = useState(null);

  // Fetch question with retry logic
  const fetchQuestion = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const endpoint = selectedSection === 'funfacts' 
        ? `${API_BASE_URL}/api/questions/random/funfacts`
        : `${API_BASE_URL}/api/questions/random/psychology`;
        
      const response = await axios.get(endpoint);
      
      if (response.data) {
        setCurrentQuestion(response.data);
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
  };

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
  }, []);

  // Handle answer submission
  const handleAnswerSubmit = (isCorrect, answerTime = null) => {
    if (isCorrect) {
      // Calculate score if in time mode
      if (timeMode && answerTime !== null) {
        const timeScore = Math.max(10, Math.floor(100 - (answerTime * 9)));
        setScore(prevScore => prevScore + timeScore);
      }
      
      // Update streak and check milestone
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      if (newStreak >= 5 && newStreak % 5 === 0) {
        setShowMilestone(true);
        setCurrentMilestone(newStreak);
        setAvailableVideos(prev => prev + 1);
        SoundEffects.playStreak();
      }
      
      SoundEffects.playCorrect();
      
      // Check if we should activate time mode
      if (questionsAnswered === 9 && !timeMode) {
        setTimeMode(true);
        setShowTimeIntro(true);
      }
      
      // Fetch next question
      fetchQuestion();
    } else {
      setStreak(0);
      SoundEffects.playIncorrect();
    }
  };

  // Set random video
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

  // Handle video ending
  const handleVideoEnd = () => {
    setShowQuestion(true);
    fetchQuestion();
  };

  // Handle video skip
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

  // Handle section selection
  const handleMainSelection = (section) => {
    SoundEffects.playTransition();
    setSelectedSection(section);
    setShowSection(false);
    fetchQuestion();
  };

  // Handle milestone close
  const handleMilestoneClose = () => {
    setShowMilestone(false);
  };

  // Handle time intro close
  const handleTimeIntroClose = () => {
    setShowTimeIntro(false);
  };

  // Handle YouTube login
  const handleYouTubeLogin = (isLoggedIn, videos = []) => {
    setYoutubePersonalization(isLoggedIn);
    if (isLoggedIn && videos.length > 0) {
      setPersonalizedVideos(videos);
    }
  };

  // Watch reward video
  const watchRewardVideo = () => {
    if (availableVideos > 0) {
      setAvailableVideos(prev => prev - 1);
      setShowQuestion(false);
      setRandomVideo();
    }
  };

  return (
    <div className="app">
      <ClearCacheButton />
      
      {!showWelcome && !showSection && (
        <>
          <YouTubeLogin onLoginStatusChange={handleYouTubeLogin} />
          
          {showQuestion && !isLoading && (
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
              <ProgressBar 
                questionsAnswered={questionsAnswered}
                streak={streak}
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
