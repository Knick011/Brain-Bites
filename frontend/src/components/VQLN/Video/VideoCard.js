// components/VQLN/Video/VideoCard.js
import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';

/**
 * Video player component with auto-advance
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
  tutorialMode = false,
  autoAdvanceDelay = 30000 // Auto-advance after 30 seconds by default
}) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const skipTimeoutRef = useRef(null);
  const autoAdvanceTimerRef = useRef(null);
  
  // Check URL validity first thing in a useEffect
  useEffect(() => {
    if (!url || !url.includes('youtube.com/shorts/')) {
      console.error('Invalid YouTube Shorts URL:', url);
      setIsValidUrl(false);
      
      // Use a ref to track the timeout for cleanup
      skipTimeoutRef.current = setTimeout(() => {
        if (onSkip) onSkip();
      }, 0);
    } else {
      setIsValidUrl(true);
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (skipTimeoutRef.current) {
        clearTimeout(skipTimeoutRef.current);
      }
    };
  }, [url, onSkip]);
  
  // Auto-advance timer
  useEffect(() => {
    console.log("Setting up video auto-advance timer", { autoAdvanceDelay });
    
    // Clear any existing timer
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    
    // Set new timer if we have a valid URL and auto-advance is enabled
    if (isValidUrl && autoAdvanceDelay > 0) {
      autoAdvanceTimerRef.current = setTimeout(() => {
        console.log("Video auto-advance timer triggered");
        if (onSkip) {
          console.log("Calling onSkip from auto-advance timer");
          onSkip();
        }
      }, autoAdvanceDelay);
    }
    
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [isValidUrl, autoAdvanceDelay, onSkip]);
  
  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Down Arrow to skip
      if (event.key === 'ArrowDown') {
        console.log("Down arrow pressed in video, calling onSkip");
        event.preventDefault();
        if (onSkip) onSkip();
      } 
      // Escape to exit when watching all rewards
      else if (event.key === 'Escape') {
        event.preventDefault();
        if (onExit) onExit();
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

  // Handle player ended
  const handlePlayerEnded = () => {
    console.log("Video ended naturally, calling onEnd");
    if (onEnd) onEnd();
  };

  // If URL is invalid, show placeholder
  if (!isValidUrl) {
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
      {/* Touch handler for swipes */}
      <div 
        className="absolute inset-0 z-20"
        onTouchStart={(e) => e.currentTarget.dataset.touchStartY = e.touches[0].clientY}
        onTouchEnd={(e) => {
          const startY = parseFloat(e.currentTarget.dataset.touchStartY || '0');
          const endY = e.changedTouches[0].clientY;
          
          // If swiped up significantly, skip
          if (startY - endY > 50 && onSkip) {
            console.log("Swipe up detected in video, calling onSkip");
            onSkip();
          }
        }}
        onClick={(e) => {
          // Add click handler to prevent touch events from propagating
          e.stopPropagation();
        }}
        style={{ touchAction: 'none' }} 
      />
      
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
              onEnded={handlePlayerEnded}
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
