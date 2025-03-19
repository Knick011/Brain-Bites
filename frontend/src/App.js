// App.js
import React, { useState, useEffect, useCallback } from 'react';
import VideoCard from './components/VQLN/Video/VideoCard';
import QuestionCard from './components/VQLN/Question/QuestionCard';
import InitialWelcome from './components/VQLN/Welcome/InitialWelcome';
import MainSelection from './components/VQLN/Welcome/MainSelection';
import RewardsButton from './components/VQLN/RewardsButton';
import SoundEffects from './utils/SoundEffects';
import ApiService from './utils/ApiService';
import SwipeNavigation from './components/VQLN/SwipeNavigation';
import TutorialPopup from './components/VQLN/Tutorial/TutorialPopup';
import GameModePopup from './components/VQLN/GameModePopup';
import MilestoneCelebration from './components/VQLN/MilestoneCelebration';
import PointsAnimation from './components/VQLN/Question/PointsAnimation';
import './styles/theme.css';
import './styles/GameStyles.css';
import './styles/popup-animations.css';

function App() {
  // State variables
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSection, setShowSection] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [availableVideos, setAvailableVideos] = useState(0);
  const [timeMode, setTimeMode] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [tutorialMode, setTutorialMode] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showGameModePopup, setShowGameModePopup] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [swipeEnabled, setSwipeEnabled] = useState(false);
  const [explanationVisible, setExplanationVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerTime, setAnswerTime] = useState(null);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  // Tutorial steps definition
  const tutorialSteps = [
    {
      title: "Welcome to Brain Bites!",
      content: "Answer quiz questions and watch entertaining videos as rewards. Swipe up or press the Down Arrow key to navigate between questions and videos!"
    },
    {
      title: "Answer Questions",
      content: "Select the correct answer from the options. The faster you answer, the more points you'll earn in Time Mode!"
    },
    {
      title: "Earn Video Rewards",
      content: "Every 2 correct answers earns you a video reward. Reach streak milestones (5, 10, 15...) for bonus videos!"
    },
    {
      title: "Time Mode",
      content: "After the tutorial, Time Mode activates! Answer quickly for more points - up to 2x for super-fast answers!"
    }
  ];

  // Load videos on component mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        console.log('Loading videos...');
        const response = await fetch('/youtube-videos.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Loaded videos:', data);

        if (data && data.videos && data.videos.length > 0) {
          setVideos(data.videos);
          setIsLoading(false);
        } else {
          throw new Error('No videos in response');
        }
      } catch (error) {
        console.error('Error loading videos:', error);
        setError('Failed to load videos');
        setIsLoading(false);
      }
    };

    // Initialize
    SoundEffects.preloadSounds();
    loadVideos();
  }, []);

  // Get random video
  const getRandomVideo = useCallback(() => {
    if (!videos || videos.length === 0) {
      console.log('No videos available');
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * videos.length);
    const selectedVideo = videos[randomIndex];
    console.log('Selected video:', selectedVideo);
    return selectedVideo;
  }, [videos]);

  // Fetch question
  const fetchQuestion = useCallback(async () => {
    if (!selectedSection) {
      console.warn('No section selected');
      return;
    }

    try {
      setIsQuestionLoading(true);
      console.log('Fetching question for section:', selectedSection);
      
      const question = await ApiService.getRandomQuestion(selectedSection);
      
      if (!question) {
        throw new Error('No question received');
      }

      console.log('Received question:', question);
      setCurrentQuestion(question);
      setShowQuestion(true);
      
    } catch (error) {
      console.error('Error fetching question:', error);
      setError('Failed to fetch question');
    } finally {
      setIsQuestionLoading(false);
    }
  }, [selectedSection]);

  // Watch video
  const watchVideo = useCallback(async () => {
    if (availableVideos <= 0) {
      console.log('No available videos');
      return;
    }

    try {
      console.log('Starting video playback');
      const video = getRandomVideo();

      if (!video) {
        throw new Error('No video available');
      }

      console.log('Playing video:', video);
      setCurrentVideo(video);
      setShowQuestion(false);
      setAvailableVideos(prev => prev - 1);

    } catch (error) {
      console.error('Error playing video:', error);
      setError('Error playing video');
      fetchQuestion();
    }
  }, [availableVideos, getRandomVideo, fetchQuestion]);

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    console.log('Video ended');
    if (!tutorialMode) {
      setShowQuestion(true);
    }
  }, [tutorialMode]);

  // Handle video skip
  const handleVideoSkip = useCallback(() => {
    console.log('Video skipped');
    setShowQuestion(true);
    
    if (tutorialMode) {
      fetchQuestion();
    }
  }, [tutorialMode, fetchQuestion]);

  // Handle answer submit
  const handleAnswerSubmit = useCallback((isCorrect, answerTimeValue = null) => {
    console.log('Answer submitted:', { isCorrect, answerTimeValue });
    
    if (tutorialMode) {
      setSwipeEnabled(true);
    }

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Handle tutorial mode
      if (tutorialMode) {
        const videoToPlay = getRandomVideo();
        if (videoToPlay) {
          setCurrentVideo(videoToPlay);
        }

        if (correctAnswers + 1 >= 5) {
          setTimeout(() => {
            setTutorialMode(false);
            setShowGameModePopup(true);
            setTimeout(() => {
              setTimeMode(true);
            }, 3000);
          }, 1000);
        }
      } else {
        // Regular mode rewards
        if (newStreak % 2 === 0) {
          setAvailableVideos(prev => prev + 1);
        }

        if (newStreak > 0 && newStreak % 5 === 0) {
          setCurrentMilestone(newStreak);
          setShowMilestone(true);
          setAvailableVideos(prev => prev + 1);
          SoundEffects.playStreak();
        }

        setTimeout(() => {
          fetchQuestion();
        }, 1500);
      }
    } else {
      setStreak(0);
      setTimeout(() => {
        fetchQuestion();
      }, 1500);
    }
  }, [correctAnswers, fetchQuestion, getRandomVideo, streak, tutorialMode]);

  // Handle start button click
  const handleStart = useCallback(() => {
    SoundEffects.playTransition();
    SoundEffects.playButtonPress();
    setShowWelcome(false);
    setShowSection(true);
  }, []);

  // Handle section selection
  const handleMainSelection = useCallback((section) => {
    SoundEffects.playTransition();
    SoundEffects.playButtonPress();
    setSelectedSection(section);
    setShowSection(false);
    setTutorialStep(0);
    setShowTutorial(true);
    fetchQuestion();
  }, [fetchQuestion]);

  return (
    <div className="app">
      {/* Login/Rewards buttons */}
      {!showWelcome && !showSection && (
        <>
          {showQuestion && !isLoading && !tutorialMode && (
            <RewardsButton 
              availableVideos={availableVideos} 
              onWatchVideo={watchVideo} 
            />
          )}
          
          {timeMode && (
            <div className="fixed top-4 right-4 z-40 bg-white shadow-md rounded-full px-4 py-2 flex items-center gap-2">
              <span className="font-bold text-lg">Score: {score}</span>
            </div>
          )}
        </>
      )}

      {/* Welcome Screen */}
      {showWelcome && (
        <InitialWelcome onStart={handleStart} isLoading={isLoading} />
      )}

      {/* Section Selection */}
      {showSection && (
        <MainSelection onSelect={handleMainSelection} />
      )}

      {/* Tutorial Popup */}
      {showTutorial && (
        <TutorialPopup 
          step={tutorialSteps[tutorialStep]}
          onNext={() => {
            SoundEffects.playButtonPress();
            if (tutorialStep < tutorialSteps.length - 1) {
              setTutorialStep(prev => prev + 1);
            } else {
              setShowTutorial(false);
            }
          }}
          currentStep={tutorialStep + 1}
          totalSteps={tutorialSteps.length}
        />
      )}

      {/* Game Mode Popup */}
      {showGameModePopup && (
        <GameModePopup 
          onClose={() => setShowGameModePopup(false)}
        />
      )}

      {/* Milestone Celebration */}
      {showMilestone && (
        <MilestoneCelebration 
          milestone={currentMilestone}
          onClose={() => {
            setShowMilestone(false);
            fetchQuestion();
          }}
        />
      )}

      {/* Main Content Area */}
      {!showWelcome && !showSection && (
        <>
          {!showQuestion ? (
            <>
              {/* Debug output */}
              {process.env.NODE_ENV === 'development' && (
                <div className="fixed top-0 left-0 bg-black bg-opacity-50 text-white p-2 z-50">
                  <pre>{JSON.stringify(currentVideo, null, 2)}</pre>
                </div>
              )}
              
              {/* Video Player */}
              {currentVideo ? (
                <VideoCard
                  url={currentVideo}
                  onEnd={() => {
                    console.log('Video ended, currentVideo:', currentVideo);
                    handleVideoEnd();
                  }}
                  onSkip={() => {
                    console.log('Video skipped, currentVideo:', currentVideo);
                    handleVideoSkip();
                  }}
                />
              ) : (
                <div className="fixed inset-0 flex items-center justify-center bg-black">
                  <div className="text-center text-white">
                    <p className="mb-4">No video data available</p>
                    <button
                      onClick={handleVideoSkip}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                    >
                      Return to Questions
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="question-container">
              {/* Tutorial Progress */}
              {tutorialMode && (
                <div className="w-full bg-orange-500 text-white py-2 px-4 text-center font-bold">
                  Tutorial Mode: Question {questionsAnswered} of 5
                </div>
              )}

              {/* Points Animation */}
              {showPointsAnimation && (
                <PointsAnimation 
                  points={pointsEarned}
                  isTimeMode={timeMode}
                  answerTime={answerTime}
                  maxTime={10}
                />
              )}

              {/* Question Display */}
              {isQuestionLoading ? (
                <div className="flex items-center justify-center h-full my-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : currentQuestion ? (
                <QuestionCard 
                  question={currentQuestion}
                  onAnswerSubmit={handleAnswerSubmit}
                  timeMode={timeMode}
                  streak={streak}
                  onSelectAnswer={setSelectedAnswer}
                  tutorialMode={tutorialMode}
                  onExplanationShow={setExplanationVisible}
                />
              ) : (
                <div className="w-full h-full bg-white p-4 rounded-lg text-center my-20">
                  <p>No question available. Please try a different category or check your connection.</p>
                  <button
                    onClick={() => setShowSection(true)}
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                  >
                    Go Back To Categories
                  </button>
                </div>
          )}
        </>
      )}

      {/* Error message */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              {typeof error === 'object' ? 'Error' : 'Something went wrong'}
            </h3>
            <p className="text-gray-700 mb-4">
              {typeof error === 'string' ? error : error.message}
            </p>
            <button 
              onClick={() => {
                setError(null);
                if (selectedSection) {
                  fetchQuestion();
                } else {
                  setShowSection(true);
                }
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Debug button - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => {
            setError({
              message: 'Reset the application state?',
              isConfirm: true,
              onConfirm: () => {
                setShowWelcome(true);
                setShowSection(false);
                setSelectedSection(null);
                setCurrentQuestion(null);
                setTutorialMode(true);
                setQuestionsAnswered(0);
                setCorrectAnswers(0);
                setStreak(0);
                setAvailableVideos(0);
                setTimeMode(false);
                setScore(0);
                setError(null);
              },
              onCancel: () => setError(null)
            });
          }}
          className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-50 hover:opacity-100"
        >
          Reset
        </button>
      )}

      {/* Video protection styles */}
      <style jsx>{`
        #video-protection-overlay,
        #video-swipe-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          cursor: default;
          touch-action: none;
        }

        .video-container iframe {
          pointer-events: none !important;
        }

        .video-container .react-player > div > div {
          pointer-events: none !important;
        }

        .swipe-content {
          position: relative;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                    opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (max-width: 768px) {
          .video-container .react-player {
            max-height: 80vh !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
