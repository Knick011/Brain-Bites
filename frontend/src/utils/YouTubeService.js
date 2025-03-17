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

      console.log('Trying to fetch videos from:');
      console.log('/youtube-videos.json');

      // Attempt to fetch the file with a longer timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch('/youtube-videos.json', {
          cache: 'no-store',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to load videos: ${response.status}`);
        }
        
        // Get the text content first to handle potential JSON issues
        const text = await response.text();
        console.log('Successfully loaded videos from:');
        console.log('/youtube-videos.json');
        
        // Manual JSON parsing with error handling
        let data;
        try {
          // First try normal parsing
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Initial JSON parse failed:', parseError);
          
          // Try to fix common JSON issues
          try {
            // Clean the text - remove unexpected characters, normalize whitespace
            const cleanedText = text
              .replace(/[^\x20-\x7E]/g, '') // Remove non-printable chars
              .replace(/[\n\r\t]/g, ' ')    // Replace newlines/tabs with spaces
              .replace(/\s+/g, ' ')         // Normalize multiple spaces
              .trim();
              
            // Check if we need to add missing brackets
            let processedText = cleanedText;
            if (!cleanedText.startsWith('{')) {
              processedText = '{' + processedText;
            }
            if (!cleanedText.endsWith('}')) {
              processedText = processedText + '}';
            }
            
            // Try parsing again
            data = JSON.parse(processedText);
            console.log('Fixed and parsed JSON successfully');
          } catch (fixError) {
            console.error('Failed to fix JSON:', fixError);
            
            // If we still can't parse, try to get videos from localStorage
            throw new Error('Could not parse JSON after cleanup');
          }
        }
        
        if (!data.videos || !Array.isArray(data.videos) || data.videos.length === 0) {
          throw new Error('No videos found in response');
        }
        
        // Update cache
        this.cache.videos = data.videos;
        this.cache.lastFetched = Date.now();
        this.cache.shownVideos.clear();
        
        // Save to localStorage for backup
        try {
          localStorage.setItem('youtube_cache', JSON.stringify({
            videos: data.videos.slice(0, 20), // Store a subset to save space
            lastFetched: Date.now()
          }));
        } catch (storageErr) {
          console.warn('Could not save to localStorage:', storageErr);
        }
        
        return this.getUniqueVideosFromCache(maxResults);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('Error fetching videos from JSON file:', fetchError);
        
        // Try localStorage if fetch fails
        const storedVideos = this.getVideosFromStorage();
        if (storedVideos.length > 0) {
          return storedVideos.slice(0, maxResults);
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('Error getting videos:', error);
      
      // Last resort: check localStorage
      const storedVideos = this.getVideosFromStorage();
      if (storedVideos.length > 0) {
        return storedVideos.slice(0, maxResults);
      }
      
      // If we truly have no videos, return an empty array
      return [];
    }
  }
  
  /**
   * Get videos from localStorage
   */
  getVideosFromStorage() {
    try {
      const storedCache = localStorage.getItem('youtube_cache');
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache);
        if (parsedCache.videos && parsedCache.videos.length > 0) {
          console.log('Using videos from localStorage');
          this.cache.videos = parsedCache.videos;
          this.cache.lastFetched = parsedCache.lastFetched;
          return this.cache.videos;
        }
      }
    } catch (err) {
      console.error('Error loading from localStorage:', err);
    }
    
    return [];
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

export default new YouTubeService();
