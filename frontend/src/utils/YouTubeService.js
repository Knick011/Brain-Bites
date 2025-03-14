/**
 * Service for managing YouTube videos
 */
class YouTubeService {
  constructor() {
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes cache
    this.fallbackVideos = []; // Removed fallback videos
  }

  /**
   * Get YouTube Shorts videos for the app
   */
  async getViralShorts(maxResults = 10) {
    try {
      // Use cache if valid
      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getUniqueVideosFromCache(maxResults);
      }

      // Try multiple possible paths with error handling
      let response;
      let successPath;
      const possiblePaths = [
        '/youtube-videos.json',
        './youtube-videos.json',
        `${window.location.origin}/youtube-videos.json`
      ];
      
      for (const path of possiblePaths) {
        try {
          console.log(`Trying to fetch videos from: ${path}`);
          response = await fetch(path, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
          });
          
          if (response.ok) {
            console.log(`Successfully loaded videos from: ${path}`);
            successPath = path;
            break;
          }
        } catch (err) {
          console.warn(`Failed to fetch from ${path}:`, err);
        }
      }
      
      if (!response || !response.ok) {
        console.error('No successful response from video sources');
        throw new Error("Failed to load videos from any source");
      }
      
      // Parse the response as text first to verify it's valid JSON
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error(`Invalid JSON from ${successPath}:`, err);
        console.error('First 100 chars of response:', text.substring(0, 100));
        throw new Error("Invalid video data format");
      }
      
      if (!data.videos || !Array.isArray(data.videos) || data.videos.length === 0) {
        console.error('No videos found in response');
        throw new Error("No videos available");
      }
      
      // Update cache
      this.cache.videos = data.videos;
      this.cache.lastFetched = Date.now();
      this.cache.shownVideos.clear();
      
      localStorage.setItem('youtube_cache', JSON.stringify({
        videos: data.videos.slice(0, 20), // Store a subset to save space
        lastFetched: Date.now()
      }));
      
      return this.getUniqueVideosFromCache(maxResults);
    } catch (error) {
      console.error('Error fetching videos:', error);
      
      // Try to load from localStorage if available
      try {
        const storedCache = localStorage.getItem('youtube_cache');
        if (storedCache) {
          const parsedCache = JSON.parse(storedCache);
          if (parsedCache.videos && parsedCache.videos.length > 0) {
            console.log('Using videos from localStorage');
            this.cache.videos = parsedCache.videos;
            this.cache.lastFetched = parsedCache.lastFetched;
            return this.getUniqueVideosFromCache(Math.min(maxResults, this.cache.videos.length));
          }
        }
      } catch (err) {
        console.error('Error loading from localStorage:', err);
      }
      
      // Throw error instead of returning fallbacks
      throw new Error("Failed to load any videos");
    }
  }

  /**
   * Check if cache is still valid
   */
  isValidCache() {
    return (
      this.cache.lastFetched && 
      this.cache.videos.length > 0 && 
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry &&
      this.cache.videos.length > this.cache.shownVideos.size
    );
  }

  /**
   * Get unique videos from cache
   */
  getUniqueVideosFromCache(count) {
    // Filter out videos that have already been shown
    const availableVideos = this.cache.videos.filter(video => 
      !this.cache.shownVideos.has(video.id)
    );
    
    // If we don't have enough videos, reset the shown videos tracker
    if (availableVideos.length < count) {
      console.log('Not enough videos available, resetting shown videos cache');
      this.cache.shownVideos.clear();
      
      // Return random videos from the full cache
      return this.getRandomVideos(this.cache.videos, count);
    }
    
    // Get random videos from available ones
    return this.getRandomVideos(availableVideos, count);
  }
  
  /**
   * Select random videos from an array
   */
  getRandomVideos(videoArray, count) {
    const results = [];
    const tempAvailable = [...videoArray];
    
    while (results.length < count && tempAvailable.length > 0) {
      const randomIndex = Math.floor(Math.random() * tempAvailable.length);
      const video = tempAvailable[randomIndex];
      
      tempAvailable.splice(randomIndex, 1);
      if (video && video.id) {
        this.cache.shownVideos.add(video.id);
        results.push(video);
      }
    }
    
    return results;
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.videos = [];
    this.cache.lastFetched = null;
    this.cache.shownVideos.clear();
    localStorage.removeItem('youtube_cache');
    console.log('Cache cleared');
  }
}
