import React from 'react';
import { Trash2 } from 'lucide-react';

const ClearCacheButton = () => {
  const clearCache = () => {
    // Clear the YouTube service cache
    if (window.YouTubeService) {
      window.YouTubeService.cache = {
        videos: [],
        lastFetched: null
      };
    }
    // Clear localStorage
    window.localStorage.clear();
    // Reload the page to fetch fresh content
    window.location.reload();
  };

  return (
    <button
      onClick={clearCache}
      className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg flex items-center gap-2"
    >
      <Trash2 size={20} />
      <span>Clear Cache</span>
    </button>
  );
};

export default ClearCacheButton;
