// App.js - Main application file
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
    setIsLoading(true);
    const endpoint = selectedSection === 'funfacts' 
      ? 'https://brain-bites-api.onrender.com/api/questions/random/funfacts'
      : 'https://brain-bites-api.onrender.com/api/questions/random/psychology';
      
    const response = await axios.get(endpoint);
    setCurrentQuestion(response.data);
    setShowQuestion(true);
    setTotalQuestions(prev => prev + 1);
  } catch (error) {
    console.error('Error fetching question:', error);
    
    // Fallback question if API fails
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
    setShowQuestion(true);
  } finally {
    setIsLoading(false);
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

  // Handle milestone modal close
  const handleMilestoneClose = () => {
    setShowMilestone(false);
  };

  // Handle time mode intro modal close
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
