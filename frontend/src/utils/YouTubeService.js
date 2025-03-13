// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    this.cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours
  }

  async getViralShorts(maxResults = 10) {
    try {
      // First check if we have valid cached videos
      if (this.isValidCache()) {
        return this.getUniqueVideosFromCache(maxResults);
      }

      // Attempt to fetch directly from the public directory
      const response = await fetch('/youtube-videos.json', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.videos || !Array.isArray(data.videos) || data.videos.length === 0) {
        throw new Error('No videos found in response');
      }
      
      // Store in cache for future use
      this.cache = {
        videos: data.videos,
        lastFetched: Date.now(),
        shownVideos: new Set()
      };
      
      return this.getUniqueVideosFromCache(maxResults);
    } catch (error) {
      console.error('Error loading videos:', error);
      return [];
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
      return [];
    }
  }

  clearCache() {
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    return true;
  }
}

export default new YouTubeService();
