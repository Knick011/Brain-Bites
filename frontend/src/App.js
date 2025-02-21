// App.js
import React, { useState, useEffect } from 'react';
import VideoCard from './components/VQLN/Video/VideoCard';
import QuestionCard from './components/VQLN/Question/QuestionCard';
import LoadingSpinner from './components/VQLN/Layout/LoadingSpinner';
import MainSelection from './components/VQLN/Selection/MainSelection';
import InitialWelcome from './components/VQLN/Welcome/InitialWelcome';
import YouTubeLogin from './components/YouTubeLogin';
import SoundEffects from './utils/SoundEffects';
import YouTubeShortsService from './utils/YouTubeShortsService';
import axios from 'axios';
import './styles/theme.css';

const App = () => {
  // States
  const [showWelcome, setShowWelcome] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [videoUrls, setVideoUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [isPersonalized, setIsPersonalized] = useState(false);

  // Load initial viral videos
  useEffect(() => {
    const loadViralVideos = async () => {
      const viralShorts = await YouTubeShortsService.getViralShorts();
      setVideoUrls(viralShorts);
    };

    loadViralVideos();
  }, []);

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
    window.gtag('event', 'section_selected', {
      'event_category': 'Navigation',
      'section_name': section
    });

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

  const handlePersonalizedVideos = async (videos) => {
    if (videos.length > 0) {
      setIsPersonalized(true);
      setVideoUrls(videos);
    } else {
      setIsPersonalized(false);
      const viralShorts = await YouTubeShortsService.getViralShorts();
      setVideoUrls(viralShorts);
    }
  };

  const setRandomVideo = () => {
    if (videoUrls.length === 0) {
      console.error('No videos available');
      return;
    }
    
    let newUrl;
    do {
      const randomIndex = Math.floor(Math.random() * videoUrls.length);
      const video = videoUrls[randomIndex];
      newUrl = video.url;
    } while (newUrl === currentVideoUrl && videoUrls.length > 1);
    
    window.gtag('event', 'video_shown', {
      'event_category': 'Video',
      'video_url': newUrl,
      'type': isPersonalized ? 'personalized' : 'viral'
    });

    setIsLoading(true);
    setCurrentVideoUrl(newUrl);
    setShowQuestion(false);
  };

  const handleVideoReady = () => {
    setIsLoading(false);
  };

  const handleVideoEnd = () => {
    window.gtag('event', 'video_completed', {
      'event_category': 'Video',
      'video_url': currentVideoUrl
    });

    SoundEffects.playTransition();
    setTimeout(() => {
      fetchQuestion();
    }, 500);
  };

  const handleVideoSkip = () => {
    window.gtag('event', 'video_skipped', {
      'event_category': 'Video',
      'video_url': currentVideoUrl
    });

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

      window.gtag('event', 'question_shown', {
        'event_category': 'Question',
        'question_category': selectedSection,
        'question_id': response.data.id
      });

      setShowQuestion(true);
      setTotalQuestions(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching question:', error);
      
      window.gtag('event', 'question_fetch_error', {
        'event_category': 'Error',
        'error_message': error.message
      });

      setRandomVideo();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = (isCorrect) => {
    setTimeout(() => {
      if (isCorrect) {
        window.gtag('event', 'question_answered', {
          'event_category': 'Question',
          'question_id': currentQuestion.id,
          'category': currentQuestion.category,
          'correct': true,
          'streak': streak + 1
        });

        SoundEffects.playCorrect();
        setCorrectAnswers(prev => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        
        if (newStreak % 5 === 0) {
          window.gtag('event', 'streak_milestone', {
            'event_category': 'Achievement',
            'streak_count': newStreak
          });

          setTimeout(() => {
            SoundEffects.playStreak();
          }, 500);
        }
        
        setTimeout(() => {
          setIsTransitioning(true);
          SoundEffects.playTransition();
          setTimeout(() => {
            setRandomVideo();
            setIsTransitioning(false);
          }, 500);
        }, 1500);
      } else {
        window.gtag('event', 'question_answered', {
          'event_category': 'Question',
          'question_id': currentQuestion.id,
          'category': currentQuestion.category,
          'correct': false,
          'streak_lost': streak
        });

        SoundEffects.playIncorrect();
        setStreak(0);
      }
    }, 1000);
  };

  // Render
  return (
    <div className="app-container">
      <YouTubeLogin 
        onLoginStatusChange={(isLoggedIn) => {
          if (!isLoggedIn) {
            setIsPersonalized(false);
          }
        }}
        onPersonalizedVideos={handlePersonalizedVideos}
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
