// VideoCard.js
import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';

const VideoCard = ({ url, onEnd, onSkip, onReady }) => {
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
      </div>
    </div>
  );
};

export default VideoCard;