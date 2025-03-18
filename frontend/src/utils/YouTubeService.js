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
        // Add a random query parameter to prevent caching
        const cacheBuster = `?_=${Date.now()}`;
        const response = await fetch('/youtube-videos.json' + cacheBuster, {
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
        console.log('Successfully loaded videos text from JSON file');
        
        // Parse the JSON with extensive error handling
        let data;
        try {
          // Try to parse the JSON directly first
          data = JSON.parse(text);
          console.log('Successfully parsed JSON directly');
        } catch (parseError) {
          console.error('Initial JSON parse failed:', parseError);
          
          try {
            // Try to clean the JSON string first
            const cleanedText = text
              .replace(/[^\x20-\x7E]/g, '') // Remove non-printable chars
              .replace(/[\n\r\t]/g, ' ')    // Replace newlines/tabs with spaces
              .replace(/\s+/g, ' ')         // Normalize multiple spaces
              .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
              .trim();
              
            data = JSON.parse(cleanedText);
            console.log('Successfully parsed JSON after cleaning');
          } catch (cleanError) {
            console.error('Cleaned JSON parse failed:', cleanError);
            
            try {
              // Try to extract just the videos array portion
              const regex = /"videos"\s*:\s*(\[[\s\S]*?\])(?=\s*,|\s*})/;
              const match = text.match(regex);
              
              if (match && match[1]) {
                const videosArray = JSON.parse(match[1]);
                data = { videos: videosArray };
                console.log('Successfully extracted videos array from malformed JSON');
              } else {
                throw new Error('Could not extract videos array');
              }
            } catch (extractError) {
              console.error('Failed to extract videos array:', extractError);
              throw new Error('All JSON parsing methods failed');
            }
          }
        }
        
        if (!data || !data.videos || !Array.isArray(data.videos) || data.videos.length === 0) {
          console.warn('No videos found in response, trying localStorage');
          // Try localStorage if response doesn't have videos
          const storedVideos = this.getVideosFromStorage();
          if (storedVideos.length > 0) {
            return storedVideos.slice(0, maxResults);
          }
          throw new Error('No videos available');
        }
        
        // Validate each video object - less strict validation
        const validVideos = data.videos.filter(video => 
          video && 
          typeof video === 'object' && 
          video.id && 
          video.url && 
          video.url.includes('youtube.com')
        );
        
        if (validVideos.length === 0) {
          console.warn('No valid videos in response');
          throw new Error('No valid videos found');
        }
        
        console.log(`Found ${validVideos.length} valid videos`);
        
        // Update cache with valid videos
        this.cache.videos = validVideos;
        this.cache.lastFetched = Date.now();
        this.cache.shownVideos.clear();
        
        // Save to localStorage for backup
        try {
          localStorage.setItem('youtube_cache', JSON.stringify({
            videos: validVideos.slice(0, 20), // Store a subset to save space
            lastFetched: Date.now()
          }));
        } catch (storageErr) {
          console.warn('Could not save to localStorage:', storageErr);
        }
        
        console.log(`Successfully processed ${validVideos.length} valid videos`);
        return this.getUniqueVideosFromCache(maxResults);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('Error fetching videos from JSON file:', fetchError);
        
        // Try localStorage if fetch fails
        const storedVideos = this.getVideosFromStorage();
        if (storedVideos.length > 0) {
          return storedVideos.slice(0, maxResults);
        }
        
        throw new Error('Failed to load videos');
      }
    } catch (error) {
      console.error('Error getting videos:', error);
      throw new Error('Failed to load videos: ' + error.message);
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
