// components/VQLN/Video/VideoCard.js
import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';

/**
 * Enhanced video player component with better error handling and URL processing
 */
const VideoCard = ({ 
  url, 
  onEnd, 
  onSkip, 
  onReady,
  onExit,
  tutorialMode = false,
  autoAdvanceDelay = 30000 // Auto-advance after 30 seconds by default
}) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [playerUrl, setPlayerUrl] = useState(null);
  const [playerError, setPlayerError] = useState(null);
  const skipTimeoutRef = useRef(null);
  const autoAdvanceTimerRef = useRef(null);
  
  // Process and validate URL on mount and when url changes
  useEffect(() => {
    console.log('Processing video URL:', url);
    
    if (!url) {
      console.error('No URL provided');
      setIsValidUrl(false);
      setPlayerUrl(null);
      setPlayerError('No video URL provided');
      return;
    }
    
    try {
      // Process the URL based on format
      let videoUrl = null;
      
      // Handle object with id property
      if (typeof url === 'object' && url.id) {
        console.log('URL is an object with ID:', url.id);
        videoUrl = `https://www.youtube.com/watch?v=${url.id}`;
      }
      // Handle full YouTube URLs
      else if (typeof url === 'string') {
        if (url.includes('youtube.com/shorts/')) {
          const match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
          if (match && match[1]) {
            videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
          } else {
            videoUrl = url; // Use as is
          }
        }
        else if (url.includes('youtube.com/watch?v=')) {
          videoUrl = url; // Already in correct format
        }
        // Handle just the video ID
        else if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
          videoUrl = `https://www.youtube.com/watch?v=${url}`;
        }
        else {
          videoUrl = url; // Use as is, ReactPlayer will handle validation
        }
      }
      
      console.log('Processed URL:', videoUrl);
      
      if (!videoUrl) {
        throw new Error('Could not process video URL');
      }
      
      setPlayerUrl(videoUrl);
      setIsValidUrl(true);
      setPlayerError(null);
    } catch (error) {
      console.error('Error processing video URL:', error);
      setIsValidUrl(false);
      setPlayerUrl(null);
      setPlayerError(error.message);
    }
  }, [url]);
  
  // Set up auto-advance timer
  useEffect(() => {
    // Clear any existing timer
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    
    // Set new timer if valid URL and auto-advance enabled
    if (isValidUrl && autoAdvanceDelay > 0) {
      console.log(`Setting auto-advance timer for ${autoAdvanceDelay}ms`);
      autoAdvanceTimerRef.current = setTimeout(() => {
        console.log('Auto-advance timer triggered');
        if (onSkip) {
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
  
  // Error timer to skip video after error
  useEffect(() => {
    if (!isValidUrl && playerError) {
      // Use a ref to track the timeout for cleanup
      skipTimeoutRef.current = setTimeout(() => {
        console.log('Skipping video due to error');
        if (onSkip) onSkip();
      }, 3000);
    }
    
    return () => {
      if (skipTimeoutRef.current) {
        clearTimeout(skipTimeoutRef.current);
      }
    };
  }, [isValidUrl, playerError, onSkip]);
  
  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Down Arrow to skip
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (onSkip) onSkip();
      } 
      // Escape to exit 
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
    console.log('Video player ready');
    setIsPlayerReady(true);
    if (onReady) onReady();
  };

  // Handle player error
  const handlePlayerError = (error) => {
    console.error('Video playback error:', error);
    setPlayerError(`Playback error: ${error}`);
    setIsValidUrl(false);
  };

  // Handle player ended
  const handlePlayerEnded = () => {
    console.log('Video ended naturally');
    if (onEnd) onEnd();
  };

  // If URL is invalid or there's an error, show error state
  if (!isValidUrl || !playerUrl || playerError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-center p-6 max-w-md">
          <p className="text-xl mb-2">Video Unavailable</p>
          <p className="mb-4">
            {playerError || "We're having trouble loading this video."}
          </p>
          
          <button 
            onClick={() => onSkip && onSkip()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors mt-4"
          >
            Skip to Next Question
          </button>
          
          <div className="text-xs mt-4 text-gray-400">
            Video will automatically skip in a few seconds...
          </div>
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
            console.log("Swipe up detected in video");
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
        {/* Loading indicator when player not ready */}
        {!isPlayerReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
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
              onBuffer={() => console.log('Video buffering...')}
              onBufferEnd={() => console.log('Video buffering ended')}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    showinfo: 0,
                    rel: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                  },
                  embedOptions: {
                    allowFullScreen: true
                  }
                },
              }}
            />
          </div>
        </div>
        
        {/* Skip button */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => onSkip && onSkip()}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-5 py-2 rounded-full transition-colors backdrop-blur-sm"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
