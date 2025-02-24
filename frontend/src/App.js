// YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.cache = {
      viralVideos: [],
      lastFetched: null
    };
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    
    // Track played videos to prevent repeats
    this.playedVideos = new Set();
    
    // Load played videos from localStorage
    this.loadPlayedVideos();
  }

  // Get viral shorts for non-logged-in users
  async getViralShorts() {
    try {
      console.log('Getting viral shorts');
      if (this.isViralCacheValid()) {
        console.log('Using cached viral videos');
        // Filter out already played videos
        const unplayedVideos = this.cache.viralVideos.filter(
          video => !this.playedVideos.has(video.url)
        );
        
        console.log(`Found ${unplayedVideos.length} unplayed videos out of ${this.cache.viralVideos.length} cached videos`);
        
        // If we're running low on unplayed videos (less than 20), fetch new ones
        if (unplayedVideos.length < 20) {
          console.log('Running low on unplayed videos, fetching new ones');
          const newShorts = await this.fetchViralShorts();
          
          // Update cache with new videos
          this.cache = {
            viralVideos: [...unplayedVideos, ...newShorts.filter(v => !this.playedVideos.has(v.url))],
            lastFetched: Date.now()
          };
          
          return this.cache.viralVideos;
        }
        
        return unplayedVideos;
      }

      console.log('Fetching new viral videos');
      const shorts = await this.fetchViralShorts();
      
      // Filter out any videos that might have been played in a previous session
      const unplayedShorts = shorts.filter(video => !this.playedVideos.has(video.url));
      
      this.cache = {
        viralVideos: unplayedShorts,
        lastFetched: Date.now()
      };

      return unplayedShorts;
    } catch (error) {
      console.error('Error getting viral shorts:', error);
      return this.cache.viralVideos.length ? 
        this.cache.viralVideos.filter(video => !this.playedVideos.has(video.url)) : 
        [];
    }
  }

  // Get personalized shorts for logged-in users (mixed with viral)
  async getPersonalizedShorts(accessToken) {
    try {
      console.log('Getting personalized shorts');
      // First get user's subscribed channels
      const channels = await this.fetchSubscribedChannels(accessToken);
      
      if (channels.length === 0) {
        console.log('No subscribed channels found, returning viral shorts');
        return this.getViralShorts();
      }
      
      // Get shorts from user's channels
      const personalShorts = await this.fetchShortsFromChannels(channels);
      console.log(`Found ${personalShorts.length} personalized shorts`);
      
      // Filter out already played videos
      const unplayedPersonalShorts = personalShorts.filter(
        video => !this.playedVideos.has(video.url)
      );
      console.log(`Found ${unplayedPersonalShorts.length} unplayed personalized shorts`);
      
      // Mix with viral shorts (80% personal, 20% viral)
      const viralShorts = await this.getViralShorts();
      
      const result = this.mixVideos(unplayedPersonalShorts, viralShorts, 0.8);
      return result;
    } catch (error) {
      console.error('Error getting personalized shorts:', error);
      return this.getViralShorts(); // Fallback to viral videos
    }
  }
  
  // Mark a video as played
  markVideoAsPlayed(videoUrl) {
    if (videoUrl) {
      console.log(`Marking video as played: ${videoUrl}`);
      this.playedVideos.add(videoUrl);
      
      // Save to localStorage for persistence across refreshes
      this.savePlayedVideos();
    }
  }
  
  // Save played videos to localStorage
  savePlayedVideos() {
    try {
      const playedVideosArray = Array.from(this.playedVideos);
      localStorage.setItem('playedVideos', JSON.stringify(playedVideosArray));
    } catch (error) {
      console.error('Error saving played videos to localStorage:', error);
    }
  }
  
  // Load played videos from localStorage
  loadPlayedVideos() {
    try {
      const playedVideosString = localStorage.getItem('playedVideos');
      if (playedVideosString) {
        const playedVideosArray = JSON.parse(playedVideosString);
        this.playedVideos = new Set(playedVideosArray);
        console.log(`Loaded ${this.playedVideos.size} played videos from localStorage`);
      }
    } catch (error) {
      console.error('Error loading played videos from localStorage:', error);
    }
  }

  // Fetch viral shorts from US and Canada
  async fetchViralShorts() {
    try {
      const regions = ['US', 'CA'];
      const allVideos = [];
      
      for (const region of regions) {
        console.log(`Fetching viral shorts for region ${region}`);
        
        const searchResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&maxResults=100` + // Max allowed by API
          `&q=%23shorts` +
          `&type=video` +
          `&videoDuration=short` +
          `&order=viewCount` + // Sort by views
          `&regionCode=${region}` +
          `&key=${this.apiKey}`
        );

        if (!searchResponse.ok) {
          console.error(`Search failed for region ${region}`);
          continue;
        }

        const searchData = await searchResponse.json();
        
        // Filter for proper shorts and format
        const shortsUrls = searchData.items
          .filter(item => item.id?.videoId)
          .map(item => ({
            url: `https://www.youtube.com/shorts/${item.id.videoId}`,
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            isPersonalized: false,
            region
          }));
        
        allVideos.push(...shortsUrls);
      }
      
      // Remove duplicates and shuffle
      const uniqueVideos = this.removeDuplicates(allVideos);
      return this.shuffleArray(uniqueVideos);
    } catch (error) {
      console.error('Error fetching viral shorts:', error);
      return [];
    }
  }

  // Get user's subscribed channels
  async fetchSubscribedChannels(accessToken) {
    try {
      const response = await fetch(
        'https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch subscriptions');
        return [];
      }
      
      const data = await response.json();
      return data.items.map(item => ({
        id: item.snippet.resourceId.channelId,
        title: item.snippet.title
      }));
    } catch (error) {
      console.error('Error fetching subscribed channels:', error);
      return [];
    }
  }

  // Fetch shorts from specified channels
  async fetchShortsFromChannels(channels) {
    try {
      const allShorts = [];
      const maxPerChannel = Math.floor(200 / channels.length);
      
      for (const channel of channels) {
        try {
          console.log(`Fetching shorts for channel ${channel.title}`);
          
          const searchResponse = await fetch(
            `https://youtube.googleapis.com/youtube/v3/search?` +
            `part=snippet` +
            `&channelId=${channel.id}` +
            `&maxResults=${maxPerChannel}` +
            `&q=%23shorts` +
            `&type=video` +
            `&videoDuration=short` +
            `&key=${this.apiKey}`
          );

          if (!searchResponse.ok) continue;
          
          const searchData = await searchResponse.json();
          
          if (!searchData.items?.length) continue;
          
          const channelShorts = searchData.items
            .filter(item => item.id?.videoId)
            .map(item => ({
              url: `https://www.youtube.com/shorts/${item.id.videoId}`,
              title: item.snippet.title,
              channelTitle: item.snippet.channelTitle,
              publishedAt: item.snippet.publishedAt,
              isPersonalized: true
            }));
          
          allShorts.push(...channelShorts);
        } catch (error) {
          console.error(`Error fetching channel ${channel.title}:`, error);
        }
      }
      
      return this.shuffleArray(allShorts);
    } catch (error) {
      console.error('Error fetching shorts from channels:', error);
      return [];
    }
  }

  // Mix personal and viral videos with a given ratio
  mixVideos(personalVideos, viralVideos, personalRatio) {
    const totalCount = 200;
    const personalCount = Math.min(Math.floor(totalCount * personalRatio), personalVideos.length);
    const viralCount = Math.min(totalCount - personalCount, viralVideos.length);
    
    const selectedPersonal = this.getRandomVideos(personalVideos, personalCount);
    const selectedViral = this.getRandomVideos(viralVideos, viralCount);
    
    // Interleave personal and viral videos
    const result = [];
    const maxLength = Math.max(selectedPersonal.length, selectedViral.length);
    
    for (let i = 0; i < maxLength; i++) {
      // Add 4 personal videos, then 1 viral
      const personalIndex = i * 4;
      for (let j = 0; j < 4 && personalIndex + j < selectedPersonal.length; j++) {
        result.push(selectedPersonal[personalIndex + j]);
      }
      
      if (i < selectedViral.length) {
        result.push(selectedViral[i]);
      }
    }
    
    return this.shuffleArray(result);
  }

  // Get random videos from array
  getRandomVideos(videos, count) {
    const shuffled = this.shuffleArray([...videos]);
    return shuffled.slice(0, count);
  }

  // Remove duplicate videos by URL
  removeDuplicates(videos) {
    return Array.from(new Map(videos.map(video => [video.url, video])).values());
  }

  // Check if viral video cache is valid
  isViralCacheValid() {
    return (
      this.cache.lastFetched && 
      this.cache.viralVideos.length > 0 && 
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry
    );
  }

  // Clear cache and played videos
  clearCache() {
    this.cache = {
      viralVideos: [],
      lastFetched: null
    };
    
    // Clear played videos
    this.playedVideos.clear();
    localStorage.removeItem('playedVideos');
    
    console.log('Cache and played videos history cleared');
  }

  // Fisher-Yates shuffle
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

export default new YouTubeService();
