// VideoCard.js
import React, { useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';

const VideoCard = ({ url, onEnd, onSkip }) => {
  // Debug logging
  useEffect(() => {
    console.log('Video data received:', url);
  }, [url]);

  // Safely get video URL
  const getVideoUrl = () => {
    // Log the incoming data
    console.log('Processing URL:', url);
    
    try {
      // If it's null/undefined, throw error
      if (!url) {
        throw new Error('No URL provided');
      }

      // If it's an object with url property
      if (typeof url === 'object') {
        console.log('URL is an object:', url);
        if (!url.url) {
          throw new Error('No URL in object');
        }
        return url.url;
      }

      // If it's a string
      if (typeof url === 'string') {
        console.log('URL is a string:', url);
        return url;
      }

      throw new Error('Invalid URL format');
    } catch (error) {
      console.error('Error processing video URL:', error);
      return null;
    }
  };

  const videoUrl = getVideoUrl();
  console.log('Final video URL:', videoUrl);

  // If no valid URL, show error state
  if (!videoUrl) {
    console.log('No valid URL, showing error state');
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center text-white">
          <p className="mb-4">Unable to load video</p>
          <p className="mb-4 text-sm text-gray-400">Received data: {JSON.stringify(url)}</p>
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
            onEnded={() => {
              console.log('Video ended');
              if (onEnd) onEnd();
            }}
            onError={(error) => {
              console.error('Video playback error:', error);
              if (onSkip) onSkip();
            }}
            onReady={() => console.log('Player ready')}
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
