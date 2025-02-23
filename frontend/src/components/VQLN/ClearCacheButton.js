// components/VQLN/ClearCacheButton.js
import React from 'react';
import { Trash2 } from 'lucide-react';

const ClearCacheButton = () => {
  const clearCache = () => {
    // Clear localStorage
    window.localStorage.clear();
    
    // Clear YouTube service cache if it exists
    if (window.YouTubeService) {
      window.YouTubeService.cache = {
        videos: [],
        lastFetched: null
      };
    }
    
    // Log for debugging
    console.log('Cache cleared!');
    
    // Reload the page to fetch fresh content
    window.location.reload();
  };

  return (
    <button
      onClick={clearCache}
      className="fixed top-20 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
      style={{ zIndex: 9999 }} // Ensure it's above other elements
    >
      <Trash2 size={20} />
      <span>Clear Cache</span>
    </button>
  );
};

export default ClearCacheButton;
