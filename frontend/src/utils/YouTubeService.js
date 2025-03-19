/**
 * Enhanced service for managing YouTube videos with strict non-repetition
 */
class YouTubeService {
  constructor() {
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set(),
      videoHistory: [] // Track order of shown videos
    };
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes cache
    this.isLoading = false;
    this.lastVideoId = null;
  }

  /**
   * Get YouTube Shorts videos for the app with robust error handling
   */
  async getViralShorts(maxResults = 10) {
    // Prevent concurrent fetches
    if (this.isLoading) {
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (!this.isLoading) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
      });
      
      if (this.isValidCache()) {
        return this.getUniqueVideosFromCache(maxResults);
      }
    }

    try {
      this.isLoading = true;
      
      // Fetch new videos if we have fewer unshown videos than requested
      // or if cache is expired
      const availableUnshown = this.cache.videos.length - this.cache.shownVideos.size;
      const shouldRefresh = !this.isValidCache() || availableUnshown < maxResults;
      
      if (!shouldRefresh) {
        return this.getUniqueVideosFromCache(maxResults);
      }

      const cacheBuster = `?_=${Date.now()}`;
      const url = '/youtube-videos.json' + cacheBuster;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch videos: HTTP ${response.status}`);
        }
        
        const text = await response.text();
        
        if (!text || text.trim() === '') {
          throw new Error('Empty response received');
        }
        
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          // Try to extract videos array as fallback
          const matches = text.match(/"videos"\s*:\s*(\[[\s\S]*?\])/);
          if (matches && matches[1]) {
            try {
              const videosArray = JSON.parse(matches[1]);
              data = { videos: videosArray };
            } catch (e) {
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
          return [];
        }
        
        // Validate and filter videos
        const validVideos = data.videos.filter(video => 
          video && 
          typeof video === 'object' && 
          video.id && 
          (video.url || `https://www.youtube.com/shorts/${video.id}`)
        );
        
        if (validVideos.length === 0) {
          throw new Error('No valid videos in response');
        }
        
        // Ensure all videos have a URL
        const processedVideos = validVideos.map(video => ({
          ...video,
          url: video.url || `https://www.youtube.com/shorts/${video.id}`
        }));
        
        // Update cache but preserve shown videos to prevent repeats
        this.cache.videos = processedVideos;
        this.cache.lastFetched = Date.now();
        
        // Save to localStorage as backup
        try {
          localStorage.setItem('youtube_cache', JSON.stringify({
            videos: processedVideos.slice(0, 20),
            lastFetched: Date.now(),
            shownVideos: Array.from(this.cache.shownVideos)
          }));
        } catch (storageErr) {
          console.warn('Failed to save to localStorage:', storageErr);
        }
        
        return this.getUniqueVideosFromCache(maxResults);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // Try localStorage backup
        const storedVideos = this.getVideosFromStorage();
        if (storedVideos.length > 0) {
          return storedVideos.slice(0, maxResults);
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error('Error getting videos:', error);
      return []; 
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
          this.cache.videos = parsedCache.videos;
          this.cache.lastFetched = parsedCache.lastFetched;
          
          // Restore shown videos if available
          if (parsedCache.shownVideos) {
            this.cache.shownVideos = new Set(parsedCache.shownVideos);
          }
          
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
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry
    );
  }

  /**
   * Get unique videos from cache with strict non-repetition
   */
  getUniqueVideosFromCache(count) {
    if (!this.cache.videos || this.cache.videos.length === 0) {
      return [];
    }

    // Validate videos
    const validVideos = this.cache.videos.filter(video => 
      video && typeof video === 'object' && video.id
    );
    
    if (validVideos.length === 0) {
      return [];
    }
    
    // If all videos have been shown, reset but remember the most recent ones
    if (this.cache.shownVideos.size >= validVideos.length) {
      // Keep track of the 3 most recently shown videos to avoid immediate repeats
      const recentVideoIds = this.cache.videoHistory.slice(-3);
      this.cache.shownVideos.clear();
      
      // Re-add recent videos to the shown set to prevent immediate repetition
      recentVideoIds.forEach(id => this.cache.shownVideos.add(id));
      console.log(`All videos shown - resetting with ${recentVideoIds.length} recent videos excluded`);
    }
    
    // Filter out shown videos
    const availableVideos = validVideos.filter(video => 
      !this.cache.shownVideos.has(video.id)
    );
    
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
        // Track this video as shown
        this.cache.shownVideos.add(video.id);
        
        // Add to history in order of display
        this.cache.videoHistory.push(video.id);
        
        // Keep history from growing too large
        if (this.cache.videoHistory.length > 100) {
          this.cache.videoHistory = this.cache.videoHistory.slice(-50);
        }
        
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
    this.cache.videoHistory = [];
    localStorage.removeItem('youtube_cache');
  }
}

export default new YouTubeService();
