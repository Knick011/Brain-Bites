// VideoCard.js
import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';
import { ChevronDown } from 'lucide-react';

const VideoCard = ({ url, onEnd, onSkip, onReady }) => {
  // Validate URL
  if (!url || !url.includes('youtube.com/shorts/')) {
    console.error('Invalid YouTube Shorts URL:', url);
    onSkip();
    return null;
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown') {
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSkip]);

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
            url={url}
            width="350px"
            height="622px"
            playing={true}
            controls={false}
            onEnded={onEnd}
            onReady={onReady}
            onError={(e) => {
              console.error('Video playback error:', e);
              onSkip();
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
        
        {/* Skip hint */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black bg-opacity-50 px-4 py-2 rounded-full text-white text-sm">
          <ChevronDown size={16} />
          <span>Press ↓ to skip</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
