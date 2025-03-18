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
  
  // Transform URL for ReactPlayer compatibility
  const transformYouTubeUrl = (inputUrl) => {
    // Handle case when inputUrl is null, undefined or not a string
    if (!inputUrl || typeof inputUrl !== 'string') {
      console.error('Invalid URL input:', inputUrl);
      return null;
    }
    
    try {
      // If URL is a YouTube Shorts URL, convert it to standard format
      if (inputUrl.includes('youtube.com/shorts/')) {
        const videoIdMatch = inputUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
        if (videoIdMatch && videoIdMatch[1]) {
          return `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
        }
      }
      
      // If already in watch format, return as is
      if (inputUrl.includes('youtube.com/watch?v=')) {
        return inputUrl;
      }
      
      // For any other YouTube URL, try to extract ID
      const generalIdMatch = inputUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (generalIdMatch && generalIdMatch[1]) {
        return `https://www.youtube.com/watch?v=${generalIdMatch[1]}`;
      }
      
      // Simple ID extraction - if URL contains what looks like just an 11-character YouTube ID
      const simpleIdMatch = /^[a-zA-Z0-9_-]{11}$/.test(inputUrl);
      if (simpleIdMatch) {
        return `https://www.youtube.com/watch?v=${inputUrl}`;
      }
      
      console.log("Couldn't transform URL, using original:", inputUrl);
      return inputUrl;
    } catch (error) {
      console.error('Error transforming URL:', error);
      return inputUrl; // Return original on error
    }
  };
  
  // The transformed URL for ReactPlayer
  const playerUrl = transformYouTubeUrl(url);
  
  // Check URL validity first thing in a useEffect
  useEffect(() => {
    console.log("Checking URL validity:", url);
    console.log("Transformed URL:", playerUrl);
    
    // Check if we have a valid transformed URL
    if (!playerUrl) {
      console.error('Invalid or untransformable YouTube URL:', url);
      setIsValidUrl(false);
      
      // Use a ref to track the timeout for cleanup
      skipTimeoutRef.current = setTimeout(() => {
        if (onSkip) onSkip();
      }, 1000); // Slightly longer delay to show the error
    } else {
      console.log("Valid YouTube URL detected:", playerUrl);
      setIsValidUrl(true);
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (skipTimeoutRef.current) {
        clearTimeout(skipTimeoutRef.current);
      }
    };
  }, [url, playerUrl, onSkip]);
  
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
    // Add a small delay before skipping to avoid rapid skipping
    setTimeout(() => {
      if (onSkip) onSkip();
    }, 500);
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
          <p>Loading next video...</p>
          <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto"></div>
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
            {/* Video player with transformed URL */}
            <ReactPlayer
              url={playerUrl}
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
