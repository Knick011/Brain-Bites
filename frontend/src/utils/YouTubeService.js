/**
 * Enhanced service for managing YouTube videos with improved error handling
 */
class YouTubeService {
  constructor() {
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes cache
    this.isLoading = false;
  }

  /**
   * Get YouTube Shorts videos for the app with robust error handling
   */
  async getViralShorts(maxResults = 10) {
    // Prevent concurrent fetches
    if (this.isLoading) {
      console.log('Already fetching videos, waiting...');
      // Wait for current fetch to complete
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!this.isLoading) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
      
      // Return cached videos if available after waiting
      if (this.isValidCache()) {
        console.log('Using cached videos after waiting for fetch');
        return this.getUniqueVideosFromCache(maxResults);
      }
    }

    try {
      this.isLoading = true;
      
      // Use cache if valid
      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getUniqueVideosFromCache(maxResults);
      }

      console.log('Fetching videos from youtube-videos.json');
      
      // Add cache buster to prevent browser caching
      const cacheBuster = `?_=${Date.now()}`;
      const url = '/youtube-videos.json' + cacheBuster;
      
      // Set up timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
          cache: 'no-store',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: HTTP ${response.status}`);
        }
        
        // Get response as text first to handle potential JSON parse errors
        const text = await response.text();
        
        if (!text || text.trim() === '') {
          throw new Error('Empty response received');
        }
        
        console.log(`Received ${text.length} bytes of data`);
        console.log('Response preview:', text.substring(0, 100) + '...');
        
        // Parse JSON with error handling
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          
          // Try to extract videos array from malformed JSON as fallback
          const matches = text.match(/"videos"\s*:\s*(\[[\s\S]*?\])/);
          if (matches && matches[1]) {
            try {
              const videosArray = JSON.parse(matches[1]);
              data = { videos: videosArray };
              console.log('Extracted videos array from malformed JSON');
            } catch (e) {
              console.error('Failed to extract videos array:', e);
              throw new Error('Invalid JSON response');
            }
          } else {
            throw new Error('Failed to parse response as JSON');
          }
        }
        
        // Validate data structure
        if (!data || !data.videos || !Array.isArray(data.videos)) {
          throw new Error('Invalid data structure: missing videos array');
        }
        
        if (data.videos.length === 0) {
          console.warn('No videos found in response');
          return [];
        }
        
        // Validate and filter videos
        const validVideos = data.videos.filter(video => 
          video && 
          typeof video === 'object' && 
          video.id && 
          (video.url || `https://www.youtube.com/shorts/${video.id}`)
        );
        
        console.log(`Found ${validVideos.length} valid videos out of ${data.videos.length}`);
        
        if (validVideos.length === 0) {
          throw new Error('No valid videos in response');
        }
        
        // Ensure all videos have a URL
        const processedVideos = validVideos.map(video => ({
          ...video,
          url: video.url || `https://www.youtube.com/shorts/${video.id}`
        }));
        
        // Update cache
        this.cache.videos = processedVideos;
        this.cache.lastFetched = Date.now();
        this.cache.shownVideos.clear();
        
        // Save to localStorage as backup
        try {
          localStorage.setItem('youtube_cache', JSON.stringify({
            videos: processedVideos.slice(0, 20), // Store a subset
            lastFetched: Date.now()
          }));
        } catch (storageErr) {
          console.warn('Failed to save to localStorage:', storageErr);
        }
        
        return this.getUniqueVideosFromCache(maxResults);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('Fetch error:', fetchError);
        
        // Try localStorage backup
        const storedVideos = this.getVideosFromStorage();
        if (storedVideos.length > 0) {
          console.log('Using videos from localStorage backup');
          return storedVideos.slice(0, maxResults);
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('Error getting videos:', error);
      return []; // Return empty array instead of throwing
    } finally {
      this.isLoading = false;
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
          console.log('Loading videos from localStorage');
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
    // Ensure we have videos in cache
    if (!this.cache.videos || this.cache.videos.length === 0) {
      console.warn('No videos in cache');
      return [];
    }

    // Validate videos
    const validVideos = this.cache.videos.filter(video => 
      video && typeof video === 'object' && video.id
    );
    
    if (validVideos.length === 0) {
      console.warn('No valid videos in cache');
      return [];
    }
    
    // Filter out shown videos
    const availableVideos = validVideos.filter(video => 
      !this.cache.shownVideos.has(video.id)
    );
    
    // If we don't have enough videos, reset shown videos
    if (availableVideos.length < count) {
      console.log('Resetting shown videos cache');
      this.cache.shownVideos.clear();
      return this.getRandomVideos(validVideos, count);
    }
    
    return this.getRandomVideos(availableVideos, count);
  }
  
  /**
   * Select random videos from an array
   */
  getRandomVideos(videoArray, count) {
    if (!videoArray || !Array.isArray(videoArray) || videoArray.length === 0) {
      return [];
    }
    
    const results = [];
    const available = [...videoArray];
    
    while (results.length < count && available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      const video = available.splice(randomIndex, 1)[0];
      
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
  }
}

export default new YouTubeService();
