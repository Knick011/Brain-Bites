// VideoCard.js
import React from 'react';
import ReactPlayer from 'react-player/youtube';

const VideoCard = ({ url, onEnd, onSkip }) => {
  // Get the video URL - if url is an object, use url.url, otherwise use the string
  const videoUrl = typeof url === 'object' ? url.url : url;

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

  if (!videoUrl) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <p className="mb-4">Unable to load video</p>
          <button
            onClick={onSkip}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-4xl aspect-video">
          <ReactPlayer
            url={videoUrl}
            width="100%"
            height="100%"
            playing
            controls
            onEnded={onEnd}
            onError={onSkip}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0
                }
              }
            }}
          />
        </div>
      </div>

      <div
        className="absolute inset-0"
        onClick={e => e.stopPropagation()}
        onTouchStart={e => {
          e.currentTarget.dataset.touchY = e.touches[0].clientY;
        }}
        onTouchEnd={e => {
          const startY = parseFloat(e.currentTarget.dataset.touchY || '0');
          const endY = e.changedTouches[0].clientY;
          if (startY - endY > 50 && onSkip) {
            onSkip();
          }
        }}
      />
    </div>
  );
};

export default VideoCard;
