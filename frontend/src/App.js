import React, { useState, useEffect } from 'react';
import VideoCard from './components/VQLN/Video/VideoCard';
import QuestionCard from './components/VQLN/Question/QuestionCard';
import LoadingSpinner from './components/VQLN/Layout/LoadingSpinner';
import MainSelection from './components/VQLN/Selection/MainSelection';
import InitialWelcome from './components/VQLN/Welcome/InitialWelcome';
import YouTubeLogin from './components/VQLN/YouTubeLogin';
import SoundEffects from './utils/SoundEffects';
import axios from 'axios';
import './styles/theme.css';

const App = () => {
  // Basic states
  const [showWelcome, setShowWelcome] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [videos, setVideos] = useState([]);

  // Default popular YouTube Shorts
  const defaultVideos = [
    'https://www.youtube.com/shorts/JfbnpYLe3Ms',
    'https://www.youtube.com/shorts/6S-5Z2dDjDE',
    'https://www.youtube.com/shorts/1KFyKwAc5wg',
    'https://www.youtube.com/shorts/5ubcr90MRA8',
    'https://www.youtube.com/shorts/Z34l5Kw7BWE',
    'https://www.youtube.com/shorts/pYqBCuTbXr8',
    'https://www.youtube.com/shorts/Wy3GSS5LAY0',
    'https://www.youtube.com/shorts/Cute2zWbQik',
    'https://www.youtube.com/shorts/XiTdR7JbMBU',
    'https://www.youtube.com/shorts/T4NxRK0Us4A'
  ];

  // Handle login status change
  const handleLoginStatusChange = async (isLoggedIn, personalizedVideos) => {
    setIsSignedIn(isLoggedIn);
    if (isLoggedIn && personalizedVideos.length > 0) {
      setVideos(personalizedVideos);
    } else {
      setVideos(defaultVideos);
    }
  };

  // Initialize with default videos
  useEffect(() => {
    setVideos(defaultVideos);
  }, []);

  const setRandomVideo = () => {
    if (videos.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * videos.length);
    const newUrl = videos[randomIndex];
    setCurrentVideoUrl(newUrl);
    setShowQuestion(false);
  };

  const handleStart = () => {
    SoundEffects.playButtonPress();
    setTimeout(() => {
      SoundEffects.playTransition();
      setShowWelcome(false);
    }, 500);
  };

  const handleMainSelection = (section) => {
    SoundEffects.playButtonPress();
    setTimeout(() => {
      setCorrectAnswers(0);
      setTotalQuestions(0);
      setStreak(0);
      setSelectedSection(section);
      SoundEffects.playTransition();
      fetchQuestion();
    }, 500);
  };

  const handleVideoReady = () => {
    setIsLoading(false);
  };

  const handleVideoEnd = () => {
    SoundEffects.playTransition();
    setTimeout(() => {
      fetchQuestion();
    }, 500);
  };

  const handleVideoSkip = () => {
    handleVideoEnd();
  };

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
      setRandomVideo();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = (isCorrect) => {
    setTimeout(() => {
      if (isCorrect) {
        SoundEffects.playCorrect();
        setCorrectAnswers(prev => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        
        if (newStreak % 5 === 0) {
          setTimeout(() => {
            SoundEffects.playStreak();
          }, 500);
        }
        
        setTimeout(() => {
          SoundEffects.playTransition();
          setTimeout(() => {
            setRandomVideo();
          }, 500);
        }, 1500);
      } else {
        SoundEffects.playIncorrect();
        setStreak(0);
      }
    }, 1000);
  };

  return (
    <div className="app-container">
      <YouTubeLogin 
        onLoginStatusChange={handleLoginStatusChange}
      />
      
      {showWelcome ? (
        <InitialWelcome onStart={handleStart} />
      ) : !selectedSection ? (
        <MainSelection onSelect={handleMainSelection} />
      ) : (
        <>
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-[350px] h-[622px] relative">
              {isLoading && <LoadingSpinner />}
              
              <div>
                {showQuestion ? (
                  <QuestionCard
                    question={currentQuestion}
                    onAnswerSubmit={handleAnswerSubmit}
                  />
                ) : (
                  <div className="video-container">
                    {currentVideoUrl && (
                      <VideoCard
                        key={`video-${currentVideoUrl}`}
                        url={currentVideoUrl}
                        onEnd={handleVideoEnd}
                        onSkip={handleVideoSkip}
                        onReady={handleVideoReady}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="stats-container">
            <div className="streak-counter">
              <span>🔥 {streak}</span>
            </div>
            <div>
              {correctAnswers} / {totalQuestions} Correct
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
