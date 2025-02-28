// Fix for utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.videosJsonUrl = '/youtube-videos.json'; // Change this to use local path
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    this.cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours
  }

  getFallbackVideos() {
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

  async getVideoData() {
    try {
      console.log('Attempting to fetch YouTube videos JSON');
      const response = await fetch(this.videosJsonUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }
      
      const data = await response.json();
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
        throw new Error('Failed to get videos from JSON');
      }
    } catch (error) {
      console.error('Error in getViralShorts:', error);
      console.log('Using fallback videos');
      // Return fallback videos if cached videos aren't available
      return this.getFallbackVideos();
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
