// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes cache
  }

  async getViralShorts(maxResults = 10) {
    try {
      // Use cache if valid
      if (this.isValidCache()) {
        return this.getUniqueVideosFromCache(maxResults);
      }

      // FIXED: Use the correct path to the JSON file
      const response = await fetch('/youtube-videos.json');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.videos || !Array.isArray(data.videos) || data.videos.length === 0) {
        throw new Error('No videos found in response');
      }
      
      // Update cache
      this.cache.videos = data.videos;
      this.cache.lastFetched = Date.now();
      this.cache.shownVideos.clear();
      
      return this.getUniqueVideosFromCache(maxResults);
    } catch (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
  }

  isValidCache() {
    return (
      this.cache.lastFetched && 
      this.cache.videos.length > 0 && 
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry &&
      this.cache.videos.length > this.cache.shownVideos.size
    );
  }

  getUniqueVideosFromCache(count) {
    // Filter out videos that have already been shown
    const availableVideos = this.cache.videos.filter(video => 
      !this.cache.shownVideos.has(video.id)
    );
    
    // Reset if needed
    if (availableVideos.length < count) {
      this.cache.shownVideos.clear();
      return this.getUniqueVideosFromCache(count);
    }
    
    // Get random videos
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
  }

  clearCache() {
    this.cache.videos = [];
    this.cache.lastFetched = null;
    this.cache.shownVideos.clear();
    console.log('Cache cleared');
  }
}

export default new YouTubeService();
