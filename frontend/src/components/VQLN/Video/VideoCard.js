// VideoCard.js
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { ChevronDown } from 'lucide-react';

const VideoCard = ({ 
  videos = [], 
  currentIndex = 0,
  onEnd, 
  onReady,
  onFinishAllVideos 
}) => {
  const [isReady, setIsReady] = useState(false);
  const currentVideo = videos[currentIndex];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      onEnd(); // Go to next video
    } else {
      onFinishAllVideos(); // No more videos left
    }
  };

  const handleVideoEnd = () => {
    handleNext();
  };

  const handleVideoReady = () => {
    setIsReady(true);
    onReady?.();
  };

  if (!currentVideo) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="relative" style={{ 
        width: '350px', 
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
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
            url={currentVideo.url}
            width="350px"
            height="622px"
            playing={true}
            controls={false}
            onEnded={handleVideoEnd}
            onReady={handleVideoReady}
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

        {/* Video Progress Indicator */}
        <div className="absolute top-4 left-0 right-0 flex justify-center gap-2">
          {videos.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Videos Remaining Count */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm">
            {videos.length - currentIndex} videos remaining
          </div>
        </div>

        {/* Swipe Indicator */}
        <div className="absolute bottom-20 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm">
            <ChevronDown size={16} />
            Swipe down for next
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
