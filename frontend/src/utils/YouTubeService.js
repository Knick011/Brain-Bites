// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    // Try different possible paths to handle both development and production
    this.videosJsonUrl = './youtube-videos.json'; // Try relative path
    this.fallbackUrls = [
      '/youtube-videos.json',
      './public/youtube-videos.json',
      'youtube-videos.json'
    ];
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    this.cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours
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
      
      {
        id: "J3AAvZjmeI8",
        url: "https://www.youtube.com/shorts/J3AAvZjmeI8",
        title: "Why no aquarium has a great white shark #shorts",
        channelTitle: "Vox",
        channelHandle: "ByteSizedFunShorts"
      }
    ];
  }

  async getVideoData() {
    try {
      console.log('Attempting to fetch YouTube videos from primary JSON path');
      let response = await fetch(this.videosJsonUrl);
      
      // If the primary path fails, try the fallback paths
      if (!response.ok) {
        console.log('Primary JSON path failed, trying fallback paths');
        
        for (const fallbackUrl of this.fallbackUrls) {
          console.log('Trying fallback URL:', fallbackUrl);
          try {
            response = await fetch(fallbackUrl);
            
            if (response.ok) {
              console.log('Successfully fetched videos from fallback URL:', fallbackUrl);
              break;
            }
          } catch (err) {
            console.log(`Fetch failed for ${fallbackUrl}:`, err.message);
          }
        }
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }
      
      // Check content type to avoid parsing HTML as JSON
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        console.warn('Response is not JSON:', contentType);
        // Don't try to parse non-JSON responses
        throw new Error('Response is not valid JSON');
      }
      
      // Safely try to parse the JSON
      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Error parsing JSON:', error);
        throw new Error('Failed to parse response as JSON');
      }
      
      console.log(`Found ${data.videos?.length || 0} videos in JSON`);
      
      if (!data || !data.videos || !data.videos.length) {
        throw new Error('No videos found in response');
      }

      return data.videos;
    } catch (error) {
      console.error('Error fetching video data:', error);
      return null;
    }
  }

  async getViralShorts(maxResults = 10) {
    try {
      // First check if we have valid cached videos
      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getUniqueVideosFromCache(maxResults);
      }

      // Try to fetch videos from the JSON file
      const videos = await this.getVideoData();
      
      if (videos && videos.length > 0) {
        this.cache = {
          videos: videos,
          lastFetched: Date.now(),
          shownVideos: new Set()
        };

        return this.getUniqueVideosFromCache(maxResults);
      } else {
        console.log('Failed to get videos from JSON, using hardcoded videos');
        // Use hardcoded fallback videos
        const fallbackVideos = this.getFallbackVideos();
        
        // Also cache these for future use
        this.cache = {
          videos: fallbackVideos,
          lastFetched: Date.now(),
          shownVideos: new Set()
        };
        
        return this.getUniqueVideosFromCache(maxResults);
      }
    } catch (error) {
      console.error('Error in getViralShorts:', error);
      console.log('Using fallback videos');
      
      // Store fallback videos in cache for future use
      const fallbackVideos = this.getFallbackVideos();
      this.cache = {
        videos: fallbackVideos,
        lastFetched: Date.now(),
        shownVideos: new Set()
      };
      
      return fallbackVideos;
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

  getUniqueVideosFromCache(count = 10) {
    const availableVideos = this.cache.videos.filter(video => 
      !this.cache.shownVideos.has(video.id)
    );
    
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
