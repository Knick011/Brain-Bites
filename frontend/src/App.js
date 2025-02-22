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

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
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

  // Fetch popular videos for non-logged-in users
 const fetchPopularShorts = async () => {
    try {
      const VIEW_THRESHOLD = 500000;
      const LIKE_THRESHOLD = 10000;

      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&maxResults=50` +
        `&q="%23shorts"` +
        `&type=video` +
        `&order=viewCount` +
        `&relevanceLanguage=en` +
        `&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) throw new Error('YouTube API request failed');

      const data = await response.json();
      const videoIds = data.items
        .filter(item => item.id && item.id.videoId)
        .map(item => item.id.videoId);

      if (videoIds.length > 0) {
        const statsResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?` +
          `part=statistics,snippet,contentDetails` +
          `&id=${videoIds.join(',')}` +
          `&key=${YOUTUBE_API_KEY}`
        );

        if (!statsResponse.ok) throw new Error('Failed to fetch video stats');

        const statsData = await statsResponse.json();
        const validVideos = statsData.items
          .filter(video => {
            const viewCount = parseInt(video.statistics.viewCount) || 0;
            const likeCount = parseInt(video.statistics.likeCount) || 0;
            const isEnglish = video.snippet.defaultLanguage === 'en' ||
                            video.snippet.defaultAudioLanguage === 'en';
            
            // Verify it's a Short using multiple criteria
            const isShort = 
              (video.snippet.description.toLowerCase().includes('#shorts') ||
               video.snippet.title.toLowerCase().includes('#shorts')) &&
              video.contentDetails.duration.match(/PT[0-6][0-9]S/);
            
            return viewCount >= VIEW_THRESHOLD &&
                   likeCount >= LIKE_THRESHOLD &&
                   isShort &&
                   isEnglish;
          })
          .map(video => `https://www.youtube.com/shorts/${video.id}`);

        const shuffledVideos = shuffleArray(validVideos);
        setVideos(shuffledVideos);
        if (shuffledVideos.length > 0) {
          setCurrentVideoUrl(shuffledVideos[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching popular shorts:', error);
    }
  };
  // Initialize with popular videos
  useEffect(() => {
    fetchPopularShorts();
  }, []);

  // API Warmup Effect
  useEffect(() => {
    const warmupAPI = async () => {
      try {
        console.log('Warming up API...');
        // Make parallel requests to both endpoints
        await Promise.all([
          axios.get('https://brain-bites-api.onrender.com/api/questions/random/funfacts'),
          axios.get('https://brain-bites-api.onrender.com/api/questions/random/psychology')
        ]);
        console.log('API warmup successful');
      } catch (error) {
        console.error('API warmup failed:', error);
      }
    };
    // Initial warmup
    warmupAPI();
    // Set up interval for periodic warmup
    const intervalId = setInterval(warmupAPI, WARMUP_INTERVAL);
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle login status change and personalized videos
  const handleLoginStatusChange = async (isLoggedIn, personalizedVideos) => {
    setIsSignedIn(isLoggedIn);
    if (isLoggedIn && personalizedVideos.length > 0) {
      const videoUrls = personalizedVideos.map(video => video.url);
      setVideos(videoUrls);
      setCurrentVideoUrl(videoUrls[0]);
    } else {
      fetchPopularShorts();
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
