// Enhanced VideoCard.js with preloading and improved transitions
import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import SwipeNavigation from '../SwipeNavigation';

/**
 * Enhanced video player component with better transitions and preloading
 */
const VideoCard = ({ 
  url, 
  onEnd, 
  onSkip, 
  onReady,
  onExit,
  tutorialMode = false,
  inRewardsFlow = false,
  currentVideoIndex = 1,
  totalVideos = 1,
  autoAdvanceDelay = 0 // Auto-advance after 30 seconds by default (only used if video doesn't end naturally)
}) => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [playerUrl, setPlayerUrl] = useState(null);
  const [playerError, setPlayerError] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [shouldAutoAdvance, setShouldAutoAdvance] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  
  const skipTimeoutRef = useRef(null);
  const autoAdvanceTimerRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  
  // Debug helper
  const debugLog = (message, data) => {
    console.log(`[VideoCard] ${message}`, data);
  };

  // Process and validate URL on mount and when url changes
  useEffect(() => {
    console.log('Processing video URL:', url);
    
    // Reset states when URL changes
    setIsPlayerReady(false);
    setVideoEnded(false);
    setIsPlaying(true);
    setShouldAutoAdvance(false);
    setTransitioning(false);
    setIsEntering(true);
    
    // Set entering class for animation
    if (containerRef.current) {
      containerRef.current.classList.add('entering');
      
      // Set initial position to be coming from bottom
      containerRef.current.style.transform = 'translateY(100%)';
      containerRef.current.style.opacity = '0';
      
      // Force a layout calculation to trigger proper animation
      const height = containerRef.current.offsetHeight; // Intentional recalc to trigger reflow
      
      // Then animate in from the bottom
      setTimeout(() => {
        containerRef.current.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        containerRef.current.style.transform = 'translateY(0)';
        containerRef.current.style.opacity = '1';
        
        // Remove entering class after animation completes
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.classList.remove('entering');
            setIsEntering(false);
          }
        }, 350);
      }, 10);
    }
    
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
      let videoId = null;
      
      // Handle object with id property
      if (typeof url === 'object' && url.id) {
        console.log('URL is an object with ID:', url.id);
        videoUrl = `https://www.youtube.com/watch?v=${url.id}`;
        videoId = url.id;
      }
      // Handle full YouTube URLs
      else if (typeof url === 'string') {
        if (url.includes('youtube.com/shorts/')) {
          const match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
          if (match && match[1]) {
            videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
            videoId = match[1];
          } else {
            videoUrl = url; // Use as is
          }
        }
        else if (url.includes('youtube.com/watch?v=')) {
          const match = url.match(/watch\?v=([a-zA-Z0-9_-]+)/);
          if (match && match[1]) {
            videoId = match[1];
          }
          videoUrl = url; // Already in correct format
        }
        // Handle just the video ID
        else if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
          videoUrl = `https://www.youtube.com/watch?v=${url}`;
          videoId = url;
        }
        else {
          videoUrl = url; // Use as is, ReactPlayer will handle validation
        }
      }
      
      console.log('Processed URL:', videoUrl);
      
      if (!videoUrl) {
        throw new Error('Could not process video URL');
      }
      
      // Preload next thumbnail if we're in rewards flow
      if (inRewardsFlow && videoId) {
        preloadVideoThumbnail(videoId);
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
  }, [url, inRewardsFlow]);
  
  // Function to preload video thumbnails for smoother transitions
  const preloadVideoThumbnail = (videoId) => {
    if (!videoId) return;
    
    // Preload high-quality thumbnail
    const img = new Image();
    img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  };
  
  // Clear any existing timers when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
      if (skipTimeoutRef.current) {
        clearTimeout(skipTimeoutRef.current);
        skipTimeoutRef.current = null;
      }
    };
  }, [url]);
  
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
        skipTimeoutRef.current = null;
      }
    };
  }, [isValidUrl, playerError, onSkip]);
  
  // Set up keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent handling keyboard events while transitioning to avoid double-triggers
      if (transitioning) return;
      
      // Down Arrow to skip
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        handleManualSkip();
      } 
      // Escape to exit 
      else if (event.key === 'Escape') {
        event.preventDefault();
        if (inRewardsFlow) {
          // In rewards flow, Escape shows the confirmation dialog
          if (onExit) onExit();
        } else {
          // Normal mode, Escape skips
          handleManualSkip();
        }
      } 
      // Space to play/pause when video has ended
      else if (event.key === ' ' && videoEnded) {
        event.preventDefault();
        // Reset and replay the video
        handleReplay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoEnded, onExit, inRewardsFlow, transitioning]);

  // Handle player ready
  const handlePlayerReady = () => {
    console.log('Video player ready');
    setIsPlayerReady(true);
    setVideoEnded(false);
    setIsPlaying(true);
    
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
    setVideoEnded(true);
    setIsPlaying(false);
    
    // Don't auto-advance, just show the replay option
    // Let the user decide if they want to move on
  };
  
  // Manually replay the video
  const handleReplay = () => {
    console.log('Replaying video');
    setVideoEnded(false);
    setIsPlaying(true);
    
    // Seek to beginning and play
    if (playerRef.current) {
      try {
        // Some players support seeking
        const player = playerRef.current.getInternalPlayer();
        if (player && typeof player.seekTo === 'function') {
          player.seekTo(0);
        }
      } catch (e) {
        console.log('Seeking not supported, resetting play state');
      }
    }
  };
  
  // Handle manual skip (via button or keyboard)
  const handleManualSkip = () => {
    if (transitioning) return; // Prevent multiple triggers
    
    setTransitioning(true);
    console.log('Manual skip initiated');
    
    // Add transition effect on container - animate current video up and out
    if (containerRef.current) {
      containerRef.current.classList.add('exiting');
      containerRef.current.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      containerRef.current.style.transform = 'translateY(-100%)';
      containerRef.current.style.opacity = '0';
      
      // Add flash effect for transition feedback
      const flash = document.createElement('div');
      flash.className = 'video-transition-flash';
      document.body.appendChild(flash);
      
      // Clean up flash element after animation
      setTimeout(() => {
        if (document.body.contains(flash)) {
          document.body.removeChild(flash);
        }
      }, 300);
    }
    
    // Delay the actual skip to allow for animation
    setTimeout(() => {
      if (onSkip) {
        console.log('Executing skip function after transition');
        onSkip();
      }
      setTransitioning(false);
    }, 350);
  };

  // Handle swipe - now with transition
  const handleSwipe = () => {
    if (transitioning) return; // Prevent multiple triggers
    
    setTransitioning(true);
    console.log("Swipe detected in video");
    
    // Add transition effect on container - animate current video up and out
    if (containerRef.current) {
      containerRef.current.classList.add('exiting');
      containerRef.current.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      containerRef.current.style.transform = 'translateY(-100%)';
      containerRef.current.style.opacity = '0';
      
      // Add flash effect for transition feedback
      const flash = document.createElement('div');
      flash.className = 'video-transition-flash';
      document.body.appendChild(flash);
      
      // Clean up flash element after animation
      setTimeout(() => {
        if (document.body.contains(flash)) {
          document.body.removeChild(flash);
        }
      }, 300);
    }
    
    // Delay the actual navigation to allow for animation
    setTimeout(() => {
      // In rewards flow, we want to use onSkip
      if (inRewardsFlow) {
        console.log("In rewards flow, using onSkip");
        onSkip && onSkip();
      } else {
        console.log("Not in rewards flow, using onExit");
        onExit && onExit();
      }
      setTransitioning(false);
    }, 350);
  };

  // Video rewards progress component - updated to be cleaner
  const VideoRewardsProgress = () => {
    return (
      <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center">
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-4">
          <div className="text-white text-sm">
            <span className="font-bold">{currentVideoIndex}</span>
            <span className="mx-1">/</span>
            <span>{totalVideos}</span>
          </div>
          
          <div className="w-40 h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentVideoIndex / totalVideos) * 100}%` }}
            ></div>
          </div>
          
          <button
            onClick={handleManualSkip}
            className="text-white hover:text-orange-300 transition-colors text-sm"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Error state
  if (!isValidUrl || !playerUrl || playerError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-center p-6 max-w-md">
          <p className="text-xl mb-2">Video Unavailable</p>
          <p className="mb-4">
            {playerError || "We're having trouble loading this video."}
          </p>
          
          <button 
            onClick={handleManualSkip}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors mt-4"
          >
            Skip
          </button>
          
          <div className="text-xs mt-4 text-gray-400">
            Video will automatically skip in a few seconds...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="video-container swipe-content" 
      ref={containerRef}
      style={{
        transform: 'translateY(0)', 
        opacity: 1,
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Add transition styles */}
      <style jsx>{`
        .video-transition-flash {
          position: fixed;
          inset: 0;
          background-color: rgba(255, 255, 255, 0.1);
          z-index: 9999;
          pointer-events: none;
          animation: flash 0.3s forwards;
        }
        
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 0.2; }
          100% { opacity: 0; }
        }
        
        .video-container {
          perspective: 1000px;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        
        .entering, .exiting {
          will-change: transform, opacity;
        }
      `}</style>
      
      {/* Add SwipeNavigation component if not in replay mode */}
      {!videoEnded && (
        <SwipeNavigation 
          onSwipeUp={handleSwipe}
          enabled={true}
          isVideo={true}
          inRewardsFlow={inRewardsFlow}
          autoAdvanceDelay={0} // Disable auto-advance from SwipeNavigation
        />
      )}
      
      {/* Video content */}
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
              ref={playerRef}
              url={playerUrl}
              width="100%"
              height="100%"
              playing={isPlaying}
              controls={false}
              onEnded={handlePlayerEnded}
              onReady={handlePlayerReady}
              onError={handlePlayerError}
              onBuffer={() => console.log('Video buffering...')}
              onBufferEnd={() => console.log('Video buffering ended')}
              // New props for improved performance
              playsinline={true}
              preload="auto"
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    showinfo: 0,
                    rel: 0,
                    iv_load_policy: 3,
                    playsinline: 1,
                    // Enable higher quality and preloading
                    vq: 'hd720',
                    preload: 'auto'
                  },
                  embedOptions: {
                    allowFullScreen: true
                  }
                },
              }}
            />
          </div>
        </div>
        
        {/* Only show rewards progress indicator for rewards flow */}
        {inRewardsFlow && (
          <VideoRewardsProgress />
        )}
        
        {/* Replay overlay when video has ended */}
        {videoEnded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <button 
              onClick={handleReplay}
              className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>Replay Video</span>
            </button>
            
            {/* Skip button */}
            <button
              onClick={handleManualSkip}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-transparent hover:bg-black hover:bg-opacity-30 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              Skip to Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
