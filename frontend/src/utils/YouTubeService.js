// utils/YouTubeService.js
const VIDEO_CACHE_KEY = 'brain_bites_videos';

const YouTubeService = {
  getVideos: () => {
    try {
      const cachedVideos = localStorage.getItem(VIDEO_CACHE_KEY);
      return cachedVideos ? JSON.parse(cachedVideos) : [];
    } catch (error) {
      console.error('Error getting cached videos:', error);
      return [];
    }
  },
  
  setVideos: (videos) => {
    try {
      localStorage.setItem(VIDEO_CACHE_KEY, JSON.stringify(videos));
    } catch (error) {
      console.error('Error caching videos:', error);
    }
  },
  
  clearCache: () => {
    try {
      localStorage.removeItem(VIDEO_CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
};

export default YouTubeService;
