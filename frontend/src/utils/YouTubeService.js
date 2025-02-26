// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.dataUrl = 'https://brain-bites-api.onrender.com/youtube-videos.json';
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    this.cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  async getViralShorts(maxResults = 10, retryCount = 0) {
    try {
      console.log('Starting getViralShorts');
      
      // Check cache first
      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getUniqueVideosFromCache(maxResults);
      }

      console.log('Fetching videos from API');
      const response = await fetch(this.dataUrl);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Videos fetched:', data.count);
      
      if (!data.videos || !Array.isArray(data.videos) || data.videos.length === 0) {
        throw new Error('Invalid video data received');
      }

      // Update cache
      this.cache = {
        videos: data.videos,
        lastFetched: Date.now(),
        shownVideos: new Set()
      };

      return this.getUniqueVideosFromCache(maxResults);
    } catch (error) {
      console.error('Error fetching shorts:', error);
      
      // Retry logic
      if (retryCount < this.retryAttempts) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${this.retryAttempts}`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.getViralShorts(maxResults, retryCount + 1);
      }

      // If all retries fail, return cached videos if available
      if (this.cache.videos.length > 0) {
        console.log('Using cached videos after fetch failure');
        return this.getUniqueVideosFromCache(maxResults);
      }

      // Return fallback videos if everything fails
      return this.getFallbackVideos();
    }
  }

  isValidCache() {
    const isValid = (
      this.cache.lastFetched && 
      this.cache.videos.length > 0 && 
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry &&
      this.cache.videos.length > this.cache.shownVideos.size
    );
    
    console.log('Cache validity check:', {
      hasLastFetched: !!this.cache.lastFetched,
      videosCount: this.cache.videos.length,
      shownVideosCount: this.cache.shownVideos.size,
      timeSinceLastFetch: this.cache.lastFetched ? (Date.now() - this.cache.lastFetched) : null,
      isValid
    });
    
    return isValid;
  }

  getUniqueVideosFromCache(count = 10) {
    const availableVideos = this.cache.videos.filter(video => 
      !this.cache.shownVideos.has(video.id)
    );
    
    console.log(`Getting ${count} videos from ${availableVideos.length} unwatched videos`);
    
    if (availableVideos.length < count) {
      console.log('Running low on unwatched videos, clearing shown videos list');
      this.cache.shownVideos.clear();
      return this.getUniqueVideosFromCache(count);
    }
    
    const results = [];
    const tempAvailable = [...availableVideos];
    let lastSelectedChannel = null;
    
    while (results.length < count && tempAvailable.length > 0) {
      // Try to avoid consecutive videos from the same channel
      const eligibleVideos = lastSelectedChannel 
        ? tempAvailable.filter(v => v.channelHandle !== lastSelectedChannel)
        : tempAvailable;
      
      const videosToUse = eligibleVideos.length > 0 ? eligibleVideos : tempAvailable;
      
      const randomIndex = Math.floor(Math.random() * videosToUse.length);
      const video = videosToUse[randomIndex];
      
      const indexInTemp = tempAvailable.findIndex(v => v.id === video.id);
      tempAvailable.splice(indexInTemp, 1);
      
      this.cache.shownVideos.add(video.id);
      results.push(video);
      
      lastSelectedChannel = video.channelHandle;
    }
    
    console.log('Selected videos:', results.map(v => ({
      channel: v.channelHandle,
      title: v.title.substring(0, 30) + '...'
    })));
    
    return results;
  }

  getFallbackVideos() {
    console.log('Using fallback videos');
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
      }
    ];
  }

  clearCache() {
    console.log('Clearing cache');
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    console.log('Cache cleared');
    return true;
  }

  // Helper method to validate video URLs
  validateVideoUrl(url) {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'www.youtube.com' && url.includes('/shorts/');
    } catch {
      return false;
    }
  }
}

export default new YouTubeService();
