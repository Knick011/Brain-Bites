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

function App() {
  // UI state
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSection, setShowSection] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showMilestone, setShowMilestone] = useState(false);
  const [showTimeIntro, setShowTimeIntro] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);

  // Content state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [videoReady, setVideoReady] = useState(false);

  // Game state
  const [tutorialMode, setTutorialMode] = useState(true);
  const [gameStats, setGameStats] = useState({
    questionsAnswered: 0,
    correctAnswers: 0,
    streak: 0,
    score: 0
  });
  const [availableVideos, setAvailableVideos] = useState(0);
  const [timeMode, setTimeMode] = useState(false);

  // YouTube integration state
  const [youtubePersonalization, setYoutubePersonalization] = useState(false);
  const [personalizedVideos, setPersonalizedVideos] = useState([]);

  // Load videos on initial mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const shorts = await YouTubeService.getViralShorts();
        if (shorts && shorts.length > 0) {
          setVideos(shorts);
          setIsLoading(false);
        } else {
          throw new Error('No videos found');
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        setIsLoading(false);
      }
    };

    loadVideos();
    SoundEffects.preloadSounds();
  }, []);

  // Fetch questions from the backend
  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://brain-bites-api.onrender.com/api/questions/random/${selectedSection}`);
      setCurrentQuestion(response.data);
      setShowQuestion(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = (isCorrect, answerTime = null) => {
    setGameStats(prev => {
      const newStats = {
        questionsAnswered: prev.questionsAnswered + 1,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        streak: isCorrect ? prev.streak + 1 : 0,
        score: prev.score + (isCorrect && timeMode && answerTime !== null ? 
          Math.max(10, Math.floor(100 - (answerTime * 9))) : 0)
      };
      return newStats;
    });

    if (isCorrect) {
      // Check for milestone
      const isMilestone = checkMilestone(gameStats.streak + 1);
      
      if (tutorialMode) {
        setAvailableVideos(prev => prev + 1);
        if (gameStats.questionsAnswered >= 4) {
          setTutorialMode(false);
        }
        setShowQuestion(false);
        setRandomVideo();
      } else {
        if (isMilestone) {
          setAvailableVideos(prev => prev + 1);
        }
        fetchQuestion();
      }

      // Enable time mode after 10 questions
      if (gameStats.questionsAnswered === 9 && !timeMode) {
        setTimeMode(true);
        setShowTimeIntro(true);
      }

      SoundEffects.playCorrect();
    } else {
      SoundEffects.playIncorrect();
    }
  };

  const checkMilestone = (newStreak) => {
    if (newStreak >= 5 && newStreak % 5 === 0) {
      setCurrentMilestone(newStreak);
      setShowMilestone(true);
      SoundEffects.playStreak();
      return true;
    }
    return false;
  };

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

  const handleVideoEnd = () => {
    setShowQuestion(true);
    fetchQuestion();
  };

  const handleVideoSkip = () => {
    setShowQuestion(true);
    fetchQuestion();
  };

  const handleVideoReady = () => {
    setVideoReady(true);
  };

  const handleStart = () => {
    SoundEffects.playTransition();
    setShowWelcome(false);
    setShowSection(true);
  };

  const handleMainSelection = (section) => {
    SoundEffects.playTransition();
    setSelectedSection(section);
    setShowSection(false);
    fetchQuestion();
  };

  const handleMilestoneClose = () => {
    setShowMilestone(false);
  };

  const handleTimeIntroClose = () => {
    setShowTimeIntro(false);
  };

  const handleYouTubeLogin = (isLoggedIn, videos = []) => {
    setYoutubePersonalization(isLoggedIn);
    if (isLoggedIn && videos.length > 0) {
      setPersonalizedVideos(videos);
    }
  };

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
          
          {showQuestion && !tutorialMode && (
            <RewardsButton 
              availableVideos={availableVideos} 
              onWatchVideo={watchRewardVideo} 
            />
          )}
          
          <ScoreDisplay score={gameStats.score} timeMode={timeMode} />
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
                questionsAnswered={gameStats.questionsAnswered}
                correctAnswers={gameStats.correctAnswers}
                tutorialMode={tutorialMode}
              />
              
              <QuestionCard 
                question={currentQuestion} 
                onAnswerSubmit={handleAnswerSubmit}
                timeMode={timeMode}
                streak={gameStats.streak}
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
