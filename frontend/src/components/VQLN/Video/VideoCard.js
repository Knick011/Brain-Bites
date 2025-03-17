// components/VQLN/Video/VideoCard.js
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { ChevronDown, X, ChevronUp } from 'lucide-react';

/**
 * Video player component with swipe capabilities
 */
const VideoCard = ({ 
  url, 
  onEnd, 
  onSkip, 
  onReady, 
  onExit,
  watchingAllRewards = false,
  currentIndex = 1,
  totalVideos = 1,
  tutorialMode = false // Added tutorial mode flag
}) => {
  const [showControls, setShowControls] = useState(true);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  
  // Auto-hide controls after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show controls on touch
  const handleTouch = (e) => {
    // Don't trigger controls for swipe movements
    if (e.type === 'touchstart') {
      setShowControls(true);
      
      // Hide controls again after 3 seconds
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  };
  
  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        onSkip && onSkip();
      } else if (event.key === 'Escape') {
        onExit && onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip, onExit]);

  // Handle player ready
  const handlePlayerReady = () => {
    setIsPlayerReady(true);
    if (onReady) onReady();
  };

  // Handle player error
  const handlePlayerError = (error) => {
    console.error('Video playback error:', error);
    if (onSkip) onSkip();
  };

  // Early return for invalid URL
  if (!url || !url.includes('youtube.com/shorts/')) {
    console.error('Invalid YouTube Shorts URL:', url);
    setTimeout(() => onSkip && onSkip(), 0);
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-center p-4">
          <p>Invalid video URL.</p>
          <button 
            onClick={onSkip}
            className="mt-4 bg-white text-black px-4 py-2 rounded-lg"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-container swipe-content" onTouchStart={handleTouch}>
      <div className="relative flex items-center justify-center w-full h-full">
          {/* Progress indicator for multiple videos */}
          {watchingAllRewards && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-full text-white z-10">
              <span className="font-medium">{currentIndex}</span>
              <span className="text-gray-300"> / {totalVideos}</span>
            </div>
          )}
          
          {/* Swipe indicator for tutorial mode */}
          {tutorialMode && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none animate-pulse">
              <div className="bg-black bg-opacity-50 px-4 py-2 rounded-full text-white flex items-center gap-2">
                <ChevronUp size={20} />
                <span>Swipe up to continue</span>
              </div>
            </div>
          )}
          
          <div className="w-full max-w-md h-full max-h-screen flex items-center justify-center">
            <div className="relative w-full h-full max-h-[85vh] rounded-lg overflow-hidden">
              <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                playing={true}
                controls={false}
                onEnded={onEnd}
                onReady={handlePlayerReady}
                onError={handlePlayerError}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      showinfo: 0,
                      rel: 0,
                      iv_load_policy: 3,
                    },
                  },
                }}
              />
            </div>
          </div>
          
          {/* Controls */}
          {showControls && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 z-10">
              <div className="flex gap-4">
                {/* Exit button */}
                {watchingAllRewards && (
                  <button 
                    onClick={onExit}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors shadow-md"
                  >
                    <X size={18} />
                    <span>Exit</span>
                  </button>
                )}
                
                {/* Skip button */}
                <button 
                  onClick={onSkip}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-full transition-colors shadow-md"
                >
                  <ChevronDown size={18} />
                  <span>{watchingAllRewards ? 'Next' : 'Skip'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;>
          {/* Progress
