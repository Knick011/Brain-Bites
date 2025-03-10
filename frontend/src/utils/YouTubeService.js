// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    this.cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours
    
    // Fix the path - must use absolute path
    this.jsonUrl = `${window.location.origin}/youtube-videos.json`;
  }

  getFallbackVideos() {
    return [];  // Return empty array since we don't want hardcoded videos
  }

  async getViralShorts(maxResults = 10) {
    try {
      // First check if we have valid cached videos
      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getUniqueVideosFromCache(maxResults);
      }

      // Try to load videos from the JSON file
      console.log(`Fetching videos from JSON file: ${this.jsonUrl}`);
      const response = await fetch(this.jsonUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos JSON: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("JSON data successfully loaded:", data);
      
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
      console.log('Failed to load videos from JSON, trying to fix URL...');
      
      // Try alternative paths as fallback
      try {
        // Try other possible paths
        const alternativePaths = [
          `/youtube-videos.json`,
          `./youtube-videos.json`,
          `../youtube-videos.json`,
          `${window.location.origin}/public/youtube-videos.json`
        ];
        
        let data = null;
        
        for (const path of alternativePaths) {
          console.log(`Trying alternative path: ${path}`);
          
          try {
            const altResponse = await fetch(path, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
              },
              cache: 'no-store'
            });
            
            if (altResponse.ok) {
              data = await altResponse.json();
              console.log(`Success with path: ${path}`);
              // Update the correct path for future use
              this.jsonUrl = path;
              break;
            }
          } catch (altError) {
            console.log(`Failed with path: ${path}`);
          }
        }
        
        if (data && data.videos && Array.isArray(data.videos) && data.videos.length > 0) {
          console.log(`Recovered with ${data.videos.length} videos`);
          
          this.cache = {
            videos: data.videos,
            lastFetched: Date.now(),
            shownVideos: new Set()
          };
          
          return this.getUniqueVideosFromCache(maxResults);
        }
      } catch (recoveryError) {
        console.error('Recovery attempt failed:', recoveryError);
      }
      
      // If we get here, all attempts failed
      console.error('All attempts to load videos failed, returning empty array');
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
      // Return an empty array instead of hardcoded fallbacks
      return [];
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
  
  // New debug method to help diagnose issues
  async debugFetchJSON() {
    try {
      const paths = [
        `${window.location.origin}/youtube-videos.json`,
        `/youtube-videos.json`,
        `./youtube-videos.json`,
        `../youtube-videos.json`,
        `${window.location.origin}/public/youtube-videos.json`
      ];
      
      console.log("Attempting to debug JSON fetching...");
      console.log("Current location:", window.location.href);
      
      const results = {};
      
      for (const path of paths) {
        try {
          console.log(`Trying path: ${path}`);
          const response = await fetch(path, { 
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
          });
          
          results[path] = {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            contentType: response.headers.get('content-type')
          };
          
          if (response.ok) {
            try {
              const text = await response.text();
              console.log(`First 100 chars: ${text.substring(0, 100)}`);
              results[path].preview = text.substring(0, 100);
              results[path].isJson = text.trim().startsWith('{');
            } catch (e) {
              results[path].textError = e.message;
            }
          }
        } catch (error) {
          results[path] = { error: error.message };
        }
      }
      
      console.log("Debug results:", results);
      return results;
    } catch (error) {
      console.error("Debug failed:", error);
      return { error: error.message };
    }
  }
}

export default new YouTubeService();
