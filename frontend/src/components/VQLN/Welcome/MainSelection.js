// Updated MainSelection.js with improved YouTube button
import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, Trophy, Video, CheckCircle, BarChart, Youtube } from 'lucide-react';
import StorageService from '../../../utils/StorageService';

/**
 * Category selection screen with progress stats
 */
const MainSelection = ({ onSelect, onYouTubeLoginStatusChange }) => {
  const [stats, setStats] = useState({
    questionsAnswered: 0,
    correctAnswers: 0,
    highestStreak: 0,
    highScore: 0,
    availableVideos: 0
  });
  
  const [showStats, setShowStats] = useState(false);
  
  useEffect(() => {
    // Load stats from storage
    const questionsAnswered = StorageService.getTotalQuestionsAnswered();
    const correctAnswers = StorageService.getTotalCorrectAnswers();
    const highestStreak = StorageService.getHighestStreak();
    const highScore = StorageService.getHighScore();
    const availableVideos = StorageService.getAvailableVideos();
    
    // Only show stats panel if we have some history
    const hasHistory = questionsAnswered > 0 || highScore > 0;
    
    setStats({
      questionsAnswered,
      correctAnswers,
      highestStreak,
      highScore,
      availableVideos
    });
    
    setShowStats(hasHistory);
  }, []);

  // Handle YouTube login
  const handleYouTubeLogin = () => {
    if (onYouTubeLoginStatusChange) {
      onYouTubeLoginStatusChange(true);
    }
  };

  return (
    <div className="selection-screen">
      {/* YouTube login positioned at the top-right with improved styling */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={handleYouTubeLogin}
          className="bg-white text-gray-800 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Youtube size={16} className="text-red-500" />
          <span>Connect</span>
        </button>
      </div>
      
      <h1 className="selection-title">Choose Your Path</h1>
      
      {/* Stats Panel */}
      {showStats && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 w-full max-w-sm animate-scaleIn">
          <h3 className="text-lg font-semibold text-orange-500 mb-3 flex items-center gap-2">
            <Trophy size={20} />
            Your Progress
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <BarChart size={18} className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Score</p>
                <p className="font-bold">{stats.highScore}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="font-bold">{stats.questionsAnswered}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Best Streak</p>
                <p className="font-bold">{stats.highestStreak}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Video size={18} className="text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Rewards</p>
                <p className="font-bold">{stats.availableVideos}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="selection-container">
        <button 
          className="selection-button funfacts"
          onClick={() => onSelect('funfacts')}
        >
          <div className="selection-icon">
            <Sparkles color="white" size={24} />
          </div>
          <div className="selection-text">
            <h3>Fun Facts</h3>
            <p>Discover fascinating trivia and knowledge</p>
          </div>
        </button>

        <button 
          className="selection-button psychology"
          onClick={() => onSelect('psychology')}
        >
          <div className="selection-icon">
            <Brain color="white" size={24} />
          </div>
          <div className="selection-text">
            <h3>Psychology</h3>
            <p>Test your understanding of the mind</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default MainSelection;
