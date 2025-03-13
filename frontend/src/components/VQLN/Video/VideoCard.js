import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { ChevronDown, X } from 'lucide-react';

/**
 * Video player component
 */
const VideoCard = ({ 
  url, 
  onEnd, 
  onSkip, 
  onReady, 
  onExit,
  watchingAllRewards = false,
  currentIndex = 1,
  totalVideos = 1
}) => {
  // Validate URL
  if (!url || !url.includes('youtube.com/shorts/')) {
    console.error('Invalid YouTube Shorts URL:', url);
    onSkip && onSkip();
    return null;
  }

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

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="relative" style={{ 
        width: '100%', 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Progress indicator for multiple videos */}
        {watchingAllRewards && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-full text-white z-10">
            <span className="font-medium">{currentIndex}</span>
            <span className="text-gray-300"> / {totalVideos}</span>
          </div>
        )}
        
        <div style={{
          width: '350px',
          height: '622px',
          borderRadius: '30px',
          overflow: 'hidden',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}>
          <ReactPlayer
            url={url}
            width="350px"
            height="622px"
            playing={true}
            controls={false}
            onEnded={onEnd}
            onReady={onReady}
            onError={(e) => {
              console.error('Video playback error:', e);
              onSkip && onSkip();
            }}
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
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="flex gap-4">
            {/* Exit button */}
            {watchingAllRewards && (
              <button 
                onClick={onExit}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                <X size={18} />
                <span>Exit</span>
              </button>
            )}
            
            {/* Skip button */}
            <button 
              onClick={onSkip}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-full transition-colors"
            >
              <ChevronDown size={18} />
              <span>{watchingAllRewards ? 'Next' : 'Skip'}</span>
            </button>
          </div>
          
          {/* Keyboard instructions */}
          <div className="text-xs text-white bg-black bg-opacity-50 px-3 py-1 rounded-full">
            Press <span className="font-bold">↓</span> to {watchingAllRewards ? 'next' : 'skip'}, 
            {watchingAllRewards && <> <span className="font-bold">ESC</span> to exit</>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
