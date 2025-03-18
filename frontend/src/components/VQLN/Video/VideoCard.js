// components/VQLN/Video/VideoCard.js
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

/**
 * Video player component with minimal UI
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
  tutorialMode = false
}) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  
  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Down Arrow to skip
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        onSkip && onSkip();
      } 
      // Escape to exit when watching all rewards
      else if (event.key === 'Escape') {
        event.preventDefault();
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

  // Early check for invalid URL
  if (!url || !url.includes('youtube.com/shorts/')) {
    console.error('Invalid YouTube Shorts URL:', url);
    // Use useEffect for side effects
    useEffect(() => {
      const timer = setTimeout(() => {
        if (onSkip) onSkip();
      }, 0);
      return () => clearTimeout(timer);
    }, [onSkip]);
    
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-center p-4">
          <p>Invalid video URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-container swipe-content">
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Progress indicator for multiple videos */}
        {watchingAllRewards && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-full text-white z-20">
            <span className="font-medium">{currentIndex}</span>
            <span className="text-gray-300"> / {totalVideos}</span>
          </div>
        )}
        
        <div className="w-full max-w-md h-full max-h-screen flex items-center justify-center">
          <div className="relative w-full h-full max-h-[85vh] rounded-lg overflow-hidden">
            {/* Video player */}
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
      </div>
    </div>
  );
};

export default VideoCard;
