import React, { useState, useEffect } from 'react';
import VideoCard from './components/VQLN/Video/VideoCard';
import QuestionCard from './components/VQLN/Question/QuestionCard';
import LoadingSpinner from './components/VQLN/Layout/LoadingSpinner';
import MainSelection from './components/VQLN/Selection/MainSelection';
import InitialWelcome from './components/VQLN/Welcome/InitialWelcome';
import YouTubeLogin from './components/VQLN/YouTubeLogin';
import SoundEffects from './utils/SoundEffects';
import YouTubeService from './utils/YouTubeService';


const WARMUP_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds

const App = () => {
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

  // API Warmup Effect
  useEffect(() => {
    const warmupAPI = async () => {
      try {
        console.log('Warming up API...');
        await Promise.all([
          axios.get('https://brain-bites-api.onrender.com/api/questions/random/funfacts'),
          axios.get('https://brain-bites-api.onrender.com/api/questions/random/psychology')
        ]);
        console.log('API warmup successful');
      } catch (error) {
        console.error('API warmup failed:', error);
      }
    };
    warmupAPI();
    const intervalId = setInterval(warmupAPI, WARMUP_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  // Initialize videos with YouTubeService
  const loadVideos = async (isPersonalized = false, accessToken = null) => {
    setIsLoading(true);
    try {
      const shorts = isPersonalized
        ? await YouTubeService.getPersonalizedShorts(accessToken)
        : await YouTubeService.getTrendingShorts();
      
      const videoUrls = shorts.map(short => short.url);
      setVideos(videoUrls);
      if (videoUrls.length > 0) {
        setCurrentVideoUrl(videoUrls[0]);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial video load
  useEffect(() => {
    if (!isSignedIn) {
      loadVideos();
    }
  }, []);

  const handleLoginStatusChange = async (isLoggedIn, accessToken) => {
    setIsSignedIn(isLoggedIn);
    if (isLoggedIn) {
      await loadVideos(true, accessToken);
    } else {
      await loadVideos();
    }
  };

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
    <VideoProvider>
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
    </VideoProvider>
  );
};

export default App;
