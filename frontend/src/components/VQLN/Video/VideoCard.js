// components/VQLN/Video/VideoCard.js
import React from 'react';
import ReactPlayer from 'react-player';

const VideoCard = ({ url, onEnd, onSkip }) => {
  // Function to get proper YouTube URL
  const getVideoUrl = (inputUrl) => {
    if (!inputUrl) return null;
    
    // Handle object with id
    if (typeof inputUrl === 'object' && inputUrl.id) {
      return `https://www.youtube.com/watch?v=${inputUrl.id}`;
    }
    
    // Handle string URL
    if (typeof inputUrl === 'string') {
      // Handle Shorts URL
      if (inputUrl.includes('/shorts/')) {
        const id = inputUrl.split('/shorts/')[1];
        return `https://www.youtube.com/watch?v=${id}`;
      }
      
      // Already a watch URL
      if (inputUrl.includes('watch?v=')) {
        return inputUrl;
      }
      
      // Direct video ID
      if (/^[a-zA-Z0-9_-]{11}$/.test(inputUrl)) {
        return `https://www.youtube.com/watch?v=${inputUrl}`;
      }
    }
    
    return inputUrl;
  };

  const playerUrl = getVideoUrl(url);

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' && onSkip) {
        e.preventDefault();
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

  if (!playerUrl) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <p>Unable to load video</p>
          <button 
            onClick={onSkip}
            className="mt-4 px-4 py-2 bg-orange-500 rounded-lg"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-3xl aspect-video">
          <ReactPlayer
            url={playerUrl}
            width="100%"
            height="100%"
            playing={true}
            controls={true}
            onEnded={onEnd}
            onError={onSkip}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0
                }
              }
            }}
          />
        </div>
      </div>

      {/* Swipe/click area for navigation */}
      <div
        className="absolute inset-0 z-10"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.currentTarget.dataset.touchY = e.touches[0].clientY}
        onTouchEnd={(e) => {
          const startY = parseFloat(e.currentTarget.dataset.touchY || '0');
          const endY = e.changedTouches[0].clientY;
          if (startY - endY > 50 && onSkip) {
            onSkip();
          }
        }}
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};

export default VideoCard;
