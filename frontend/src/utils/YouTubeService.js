// YouTubeService.js
class YouTubeService {
  constructor() {
    // Replace with your GitHub username and repository name
    this.dataUrl = 'https://knick011.github.io/Brain-Bites/public/youtube-videos.json';
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    this.cacheExpiry = 6 * 60 * 60 * 1000; // 6 hours
  }

  async getViralShorts(maxResults = 10) {
    try {
      console.log('Starting getViralShorts');
      
      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getUniqueVideosFromCache(maxResults);
      }

      console.log('Fetching videos from GitHub Pages');
      console.log('URL:', this.dataUrl);
      
      const response = await fetch(this.dataUrl);
      console.log('Response status:', response.status);
      
      if (!response.ok) throw new Error(`Failed to fetch videos: ${response.status}`);
      
      const data = await response.json();
      console.log('Videos fetched:', data.count);
      
      this.cache = {
        videos: data.videos || [],
        lastFetched: Date.now(),
        shownVideos: new Set()
      };

      return this.getUniqueVideosFromCache(maxResults);
    } catch (error) {
      console.error('Error fetching shorts:', error);
      return this.cache.videos.length ? 
        this.getUniqueVideosFromCache(maxResults) : 
        this.getFallbackVideos();
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
      shownVideosCount: this.cache.shownVideos ? this.cache.shownVideos.size : 0,
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
}

export default new YouTubeService();
