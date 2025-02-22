import React, { useState, useEffect } from 'react';
import VideoCard from './components/VQLN/Video/VideoCard';
import QuestionCard from './components/VQLN/Question/QuestionCard';
import LoadingSpinner from './components/VQLN/Layout/LoadingSpinner';
import MainSelection from './components/VQLN/Selection/MainSelection';
import InitialWelcome from './components/VQLN/Welcome/InitialWelcome';
import YouTubeLogin from './components/VQLN/YouTubeLogin';
import SoundEffects from './utils/SoundEffects';
import YouTubeShortsService from './utils/YouTubeShortsService';
import GoogleAuthService from './utils/GoogleAuthService';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  // Video management states
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [viralVideos, setViralVideos] = useState([]);
  const [personalizedVideos, setPersonalizedVideos] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [videoQueue, setVideoQueue] = useState([]);

  // Initial load of viral videos
  useEffect(() => {
    const fetchViralVideos = async () => {
      try {
        setIsLoading(true);
        const videos = await YouTubeShortsService.getViralShorts({
          maxResults: 50,
          regions: ['US', 'CA'],
          maxAge: 365 // days
        });
        setViralVideos(videos);
        setVideoQueue(videos);
      } catch (error) {
        console.error('Error fetching viral videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViralVideos();
  }, []);

  // Handle login status change
  const handleLoginStatusChange = async (isLoggedIn) => {
    setIsSignedIn(isLoggedIn);
    if (isLoggedIn) {
      try {
        setIsLoading(true);
        const personalized = await GoogleAuthService.getPersonalizedShorts();
        setPersonalizedVideos(personalized);
        
        // Mix personalized and viral videos (simplified ratio handling)
        const mixed = [...personalized];
        for (let i = 0; i < Math.floor(personalized.length / 5); i++) {
          if (viralVideos[i]) {
            mixed.splice(i * 5, 0, viralVideos[i]);
          }
        }
        setVideoQueue(mixed);
      } catch (error) {
        console.error('Error fetching personalized videos:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setVideoQueue(viralVideos);
      setPersonalizedVideos([]);
    }
  };

  // Set next video from queue
  const setNextVideo = () => {
    if (videoQueue.length === 0) {
      console.error('No videos available');
      return;
    }

    const nextVideo = videoQueue[0];
    const newQueue = videoQueue.slice(1);
    
    // If queue is getting low, add more videos
    if (newQueue.length < 5) {
      if (isSignedIn && personalizedVideos.length > 0) {
        newQueue.push(...personalizedVideos);
        if (viralVideos.length > 0) {
          for (let i = 0; i < Math.floor(personalizedVideos.length / 5); i++) {
            newQueue.splice(i * 5, 0, viralVideos[i]);
          }
        }
      } else {
        newQueue.push(...viralVideos);
      }
    }

    setVideoQueue(newQueue);
    setCurrentVideoUrl(nextVideo.url);
    
    window.gtag('event', 'video_shown', {
      'event_category': 'Video',
      'video_url': nextVideo.url,
      'type': nextVideo.isPersonalized ? 'personalized' : 'viral'
    });
  };

  // Handlers
  const handleStart = () => {
    window.gtag('event', 'game_start', {
      'event_category': 'Game',
      'event_label': 'Started Game'
    });
    
    SoundEffects.playButtonPress();
    setTimeout(() => {
      SoundEffects.playTransition();
      setShowWelcome(false);
    }, 500);
  };

  const handleMainSelection = (section) => {
    SoundEffects.playButtonPress();
    setTimeout(() => {
      // Reset states
      setCorrectAnswers(0);
      setTotalQuestions(0);
      setStreak(0);
      setShowQuestion(false);
      setCurrentQuestion(null);
      setCurrentVideoUrl('');
      
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
        ? 'http://localhost:5000/api/questions/random/funfacts'
        : 'http://localhost:5000/api/questions/random/psychology';
        
      const response = await axios.get(endpoint);
      setCurrentQuestion(response.data);
      setShowQuestion(true);
      setTotalQuestions(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching question:', error);
      setNextVideo();
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
          setIsTransitioning(true);
          SoundEffects.playTransition();
          setTimeout(() => {
            setNextVideo();
            setIsTransitioning(false);
          }, 500);
        }, 1500);
      } else {
        SoundEffects.playIncorrect();
        setStreak(0);
      }
    }, 1000);
  };

  // Render
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
              
              <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
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
