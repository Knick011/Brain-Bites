// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    this.cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours
    this.jsonUrl = '/youtube-videos.json'; // Path to the locally stored JSON file
  }

  getFallbackVideos() {
    // Extended fallback videos to ensure content is always available
    return [
      {
        id: "8_gdcaX9Xqk",
        url: "https://www.youtube.com/shorts/8_gdcaX9Xqk",
        title: "Would You Split Or Steal $250,000?",
        channelTitle: "MrBeast",
        channelHandle: "MrBeast"
      },
      {
        id: "c0YNnrHBARc",
        url: "https://www.youtube.com/shorts/c0YNnrHBARc",
        title: "How I Start My Mornings - Harvest Edition",
        channelTitle: "Zach King",
        channelHandle: "ZachKing"
      },
      // More fallback videos...
    ];
  }

  async getViralShorts(maxResults = 10) {
    try {
      // First check if we have valid cached videos
      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getUniqueVideosFromCache(maxResults);
      }

      // Try to load videos from the locally stored JSON file
      console.log('Fetching videos from JSON file');
      const response = await fetch(this.jsonUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos JSON: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.videos || !Array.isArray(data.videos) || data.videos.length === 0) {
        throw new Error('No videos found in JSON or invalid format');
      }
      
      console.log(`Loaded ${data.videos.length} videos from JSON`);
      
      // Store in cache for future use
      this.cache = {
        videos: data.videos,
        lastFetched: Date.now(),
        shownVideos: new Set()
      };
      
      return this.getUniqueVideosFromCache(maxResults);
    } catch (error) {
      console.error('Error in getViralShorts:', error);
      console.log('Using fallback videos due to error:', error.message);
      
      // Use fallback videos
      const fallbackVideos = this.getFallbackVideos();
      
      // Store fallbacks in cache to avoid repeated errors
      this.cache = {
        videos: fallbackVideos,
        lastFetched: Date.now(),
        shownVideos: new Set()
      };
      
      return fallbackVideos.slice(0, maxResults);
    }
  }

  isValidCache() {
    return (
      this.cache.lastFetched && 
      this.cache.videos && 
      this.cache.videos.length > 0 && 
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry &&
      this.cache.videos.length > this.cache.shownVideos.size
    );
  }

  getUniqueVideosFromCache(count = 10) {
    try {
      // Filter out videos that have already been shown
      const availableVideos = this.cache.videos.filter(video => 
        !this.cache.shownVideos.has(video.id)
      );
      
      // If we don't have enough unique videos, reset the shown videos set
      if (availableVideos.length < count) {
        console.log('Not enough unique videos left, resetting shown videos');
        this.cache.shownVideos.clear();
        return this.getUniqueVideosFromCache(count);
      }
      
      const results = [];
      const tempAvailable = [...availableVideos];
      
      while (results.length < count && tempAvailable.length > 0) {
        const randomIndex = Math.floor(Math.random() * tempAvailable.length);
        const video = tempAvailable[randomIndex];
        
        tempAvailable.splice(randomIndex, 1);
        this.cache.shownVideos.add(video.id);
        results.push(video);
      }
      
      return results;
    } catch (error) {
      console.error('Error getting unique videos from cache:', error);
      // Just return some fallback videos directly if there's an error
      return this.getFallbackVideos().slice(0, count);
    }
  }

  clearCache() {
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    console.log('Cache cleared successfully');
    return true;
  }
}

export default new YouTubeService();
