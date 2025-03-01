// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    // We're not going to try fetching from a JSON file since that's causing errors
    // Instead, we'll use hardcoded videos directly
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
        id: "ZNgKin-PpZA",
        url: "https://www.youtube.com/shorts/ZNgKin-PpZA",
        title: "I spell, therefore it is.",
        channelTitle: "Zach King",
        channelHandle: "ZachKing"
      },
      {
        id: "QBKR12mIdso",
        url: "https://www.youtube.com/shorts/QBKR12mIdso",
        title: "BUZZER BEATER!!! 🚨",
        channelTitle: "Dude Perfect",
        channelHandle: "DudePerfectShorts"
      },
      {
        id: "MlPAmRN-uwg",
        url: "https://www.youtube.com/shorts/MlPAmRN-uwg",
        title: "Well that escalated QUICKLY 😳🎱",
        channelTitle: "Dude Perfect",
        channelHandle: "DudePerfectShorts"
      },
      {
        id: "LhjrX9FoXn0",
        url: "https://www.youtube.com/shorts/LhjrX9FoXn0",
        title: "EPIC Basketball Race!!",
        channelTitle: "How Ridiculous",
        channelHandle: "HowRidiculousShorts"
      },
      {
        id: "SIyvhq3zWLg",
        url: "https://www.youtube.com/shorts/SIyvhq3zWLg",
        title: "The Big Secret to Finding Lasting Love | Bela Gandhi | TEDxChicago",
        channelTitle: "TEDx Talks",
        channelHandle: "LOLClipsShorts"
      },
      {
        id: "IdxH_wTobaE",
        url: "https://www.youtube.com/shorts/IdxH_wTobaE",
        title: "Markiplier Animated | BEAR SIMULATOR",
        channelTitle: "Markiplier",
        channelHandle: "QuickMemeShorts"
      },
      {
        id: "YKmhF5rxjJ4",
        url: "https://www.youtube.com/shorts/YKmhF5rxjJ4",
        title: "OLED Steam Deck vs LCD. What are the key differences?",
        channelTitle: "ShortCircuit",
        channelHandle: "ShortCircuit"
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

  async getViralShorts(maxResults = 10) {
    try {
      // First check if we have valid cached videos
      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getUniqueVideosFromCache(maxResults);
      }

      // Skip trying to fetch from JSON and use hardcoded videos directly
      console.log('Using hardcoded videos');
      const fallbackVideos = this.getFallbackVideos();
      
      // Store in cache for future use
      this.cache = {
        videos: fallbackVideos,
        lastFetched: Date.now(),
        shownVideos: new Set()
      };
      
      return this.getUniqueVideosFromCache(maxResults);
    } catch (error) {
      console.error('Error in getViralShorts:', error);
      console.log('Using fallback videos');
      
      // Use fallback videos and don't even try to cache them if there's an error
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
    try {
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
      // Just return some fallback videos directly if there's an error
      return this.getFallbackVideos().slice(0, count);
    }
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
