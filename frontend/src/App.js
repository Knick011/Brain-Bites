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
import { Dialog, DialogContent, DialogTitle, Button } from './components/VQLN/Alert';
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
  const [showRewardsFinished, setShowRewardsFinished] = useState(false);

  // Content state
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
  const [rewardVideos, setRewardVideos] = useState([]);

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
          // Filter out non-shorts videos
          const filteredShorts = shorts.filter(video => 
            video.url.includes('/shorts/') &&
            !video.title.toLowerCase().includes('premiere') &&
            !video.title.toLowerCase().includes('live')
          );
          setVideos(filteredShorts);
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

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`https://brain-bites-api.onrender.com/api/questions/random/${selectedSection}`);
      setCurrentQuestion(response.data);
      setShowQuestion(true);
    } catch (error) {
      console.error('Error fetching question:', error);
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
        explanation: "Bats are the only mammals that can truly fly."
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
      const isMilestone = checkMilestone(gameStats.streak + 1);
      
      if (tutorialMode) {
        setAvailableVideos(prev => prev + 1);
        if (gameStats.questionsAnswered >= 4) {
          setTutorialMode(false);
        }
        setShowQuestion(false);
        startRewardSession();
      } else {
        if (isMilestone) {
          setAvailableVideos(prev => prev + 1);
        }
        fetchQuestion();
      }

      if (gameStats.questionsAnswered === 9 && !timeMode) {
        setTimeMode(true);
        setShowTimeIntro(true);
      }

      SoundEffects.playCorrect();
    } else {
      SoundEffects.playIncorrect();
    }
  };

  const startRewardSession = () => {
    const videoCount = availableVideos;
    const selectedVideos = [];
    const availableVideosList = youtubePersonalization && personalizedVideos.length > 0 
      ? personalizedVideos 
      : videos;

    // Select random videos for rewards
    for (let i = 0; i < videoCount; i++) {
      const remainingVideos = availableVideosList.filter(
        video => !selectedVideos.some(selected => selected.id === video.id)
      );
      if (remainingVideos.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * remainingVideos.length);
      selectedVideos.push(remainingVideos[randomIndex]);
    }

    setRewardVideos(selectedVideos);
    setCurrentRewardIndex(0);
    setCurrentVideo(selectedVideos[0]);
    setShowQuestion(false);
    setAvailableVideos(0); // Reset available videos since we're using them all
  };

  const handleVideoEnd = () => {
    if (rewardVideos.length > 0) {
      // If we're watching reward videos
      const nextIndex = currentRewardIndex + 1;
      if (nextIndex < rewardVideos.length) {
        setCurrentRewardIndex(nextIndex);
        setCurrentVideo(rewardVideos[nextIndex]);
      } else {
        // No more reward videos
        setShowRewardsFinished(true);
        setRewardVideos([]);
        setShowQuestion(true);
        fetchQuestion();
      }
    } else {
      // Regular video (tutorial mode)
      setShowQuestion(true);
      fetchQuestion();
    }
  };

  const handleVideoSkip = () => {
    handleVideoEnd(); // Reuse the same logic for skipping
  };

  const handleRewardsFinishedClose = () => {
    setShowRewardsFinished(false);
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

  const handleYouTubeLogin = (isLoggedIn, newVideos = []) => {
    setYoutubePersonalization(isLoggedIn);
    if (isLoggedIn && newVideos.length > 0) {
      const filteredVideos = newVideos.filter(video => 
        video.url.includes('/shorts/') &&
        !video.title.toLowerCase().includes('premiere') &&
        !video.title.toLowerCase().includes('live')
      );
      setPersonalizedVideos(filteredVideos);
    }
  };

  const watchRewardVideo = () => {
    if (availableVideos > 0) {
      startRewardSession();
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
              onReady={() => setVideoReady(true)}
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

      {showRewardsFinished && (
        <Dialog open={showRewardsFinished} onClose={handleRewardsFinishedClose}>
          <DialogContent>
            <DialogTitle>All Rewards Watched!</DialogTitle>
            <p className="mt-4 text-gray-600">
              Answer more questions correctly to earn more video rewards.
            </p>
            <div className="mt-6 flex justify-end">
              <Button variant="primary" onClick={handleRewardsFinishedClose}>
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default App;
