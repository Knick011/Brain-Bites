// App.js
import React, { useState } from 'react';
import VideoCard from './components/VQLN/Video/VideoCard';
import QuestionCard from './components/VQLN/Question/QuestionCard';
import LoadingSpinner from './components/VQLN/Layout/LoadingSpinner';
import MainSelection from './components/VQLN/Selection/MainSelection';
import InitialWelcome from './components/VQLN/Welcome/InitialWelcome';
import SoundEffects from './utils/SoundEffects';
import axios from 'axios';
import './styles/theme.css';

const App = () => {
  // States
  const [showWelcome, setShowWelcome] = useState(true);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [videoCount, setVideoCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const videoUrls = [
    'https://www.youtube.com/shorts/JfbnpYLe3Ms',
    'https://www.youtube.com/shorts/6S-5Z2dDjDE',
    'https://www.youtube.com/shorts/1KFyKwAc5wg',
    'https://www.youtube.com/shorts/5ubcr90MRA8',
    'https://www.youtube.com/shorts/Z34l5Kw7BWE',
    'https://www.youtube.com/shorts/pYqBCuTbXr8',
    'https://www.youtube.com/shorts/Wy3GSS5LAY0',
    'https://www.youtube.com/shorts/Cute2zWbQik',
    'https://www.youtube.com/shorts/XiTdR7JbMBU',
    'https://www.youtube.com/shorts/T4NxRK0Us4A',
    'https://www.youtube.com/shorts/E9IajO3BYiM',
    'https://www.youtube.com/shorts/yTWuk06c1YU',
    'https://www.youtube.com/shorts/982UFH4I3F8',
    'https://www.youtube.com/shorts/cAYp92LaU7k',
    'https://www.youtube.com/shorts/i6jH7V41dxA',
    'https://www.youtube.com/shorts/mnM9kIszddY',
    'https://www.youtube.com/shorts/7ZNWQbMap8M',
    'https://www.youtube.com/shorts/y40Qq4lPjBs',
    'https://www.youtube.com/shorts/DzFg9d6fUaI',
    'https://www.youtube.com/shorts/EX6GoPrpvkU',
    'https://www.youtube.com/shorts/9rSQdWWdaz0',
    'https://www.youtube.com/shorts/fvQ99OpGybw',
    'https://www.youtube.com/shorts/c75q8uQgBSs',
    'https://www.youtube.com/shorts/nyI4U7uLPuU',
  ];

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
      setVideoCount(0);
      setShowQuestion(false);
      setCurrentQuestion(null);
      setCurrentVideoUrl('');
      
      setSelectedSection(section);
      SoundEffects.playTransition();
      fetchQuestion();
    }, 500);
  };

  const setRandomVideo = () => {
    let newUrl;
    do {
      const randomIndex = Math.floor(Math.random() * videoUrls.length);
      newUrl = videoUrls[randomIndex];
    } while (newUrl === currentVideoUrl && videoUrls.length > 1);
    
    window.gtag('event', 'video_shown', {
      'event_category': 'Video',
      'video_url': newUrl
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
const BACKEND_URL = 'https://brain-bites-api.onrender.com';
  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      const endpoint = selectedSection === 'funfacts' 
         ? `${BACKEND_URL}/api/questions/random/funfacts`
      : `${BACKEND_URL}/api/questions/random/psychology`;
        
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
    }, 1000); // Delay after answer selection
  };

  // Render
  return (
    <div className="app-container">
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
