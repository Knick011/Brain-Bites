// YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.cache = {
      videos: [],
      lastFetched: null
    };
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    
    // List of channel handles
    this.channels = [
      'LukeDavidson',
      'Kallmekris',
      'MDMotivator',
      'sandiction',
      'Mythic',
      'TheMagicMatt',
      'GoldenGully',
      'DokaRyan',
      'Ottawalks',
      'Shangerdanger',
      'Hingaflips',
      'ChrisIvan',
      'BrodieThatDood',
      'AdrianBliss',
      'ZackDFilms',
      'ILYABORZOV',
      'JoJosWorld',
      'KellyClarksonShow',
      'iKnowAyrel',
      'MrBeast',
      'ZachKing',
      'JeenieWeenie',
      'StokesTwins',
      'AlanChikinChow',
      'DanRhodes',
      'FritzProctor',
      'LoicSuberville',
      'TheKoreanVegan',
      'TopperGuild',
      'NathanKessel',
      'AzzyLand',
      'HacksmithIndustries',
      'SISvsBRO',
      'CoreyTonge',
      'CrashAdams',
      'AndreasEskander',
      'AnnaMcNulty',
      'MadFit',
      'NutshellAnimations',
      'SAS-ASMR',
      'ManchurekTriplets',
      'AaronEsser',
      'TwiShorts',
      'LaylaRoblox',
      'NickEh30',
      'NileRed',
      'ElectroBOOM',
      'Gloom',
      'MostAmazingTop10',
      'PapaJake'
    ];
  }

  async getViralShorts() {
    try {
      if (this.isValidCache()) {
        return this.getRandomVideosFromCache();
      }

      const allVideos = await this.fetchFromChannels();
      
      this.cache = {
        videos: allVideos,
        lastFetched: Date.now()
      };

      return this.getRandomVideosFromCache();
    } catch (error) {
      console.error('Error fetching shorts:', error);
      return this.cache.videos.length ? this.getRandomVideosFromCache() : [];
    }
  }

  async fetchFromChannels() {
    const allVideos = [];

    for (const channel of this.channels) {
      try {
        // First get channel ID from handle
        const channelResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&q=@${channel}` +
          `&type=channel` +
          `&key=${this.apiKey}`
        );

        if (!channelResponse.ok) continue;
        const channelData = await channelResponse.json();
        if (!channelData.items?.length) continue;
        
        const channelId = channelData.items[0].id.channelId;

        // Then get shorts from this channel
        const searchResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&channelId=${channelId}` +
          `&maxResults=10` + // Get 10 recent shorts per channel
          `&q=%23shorts` +
          `&type=video` +
          `&videoDuration=short` +
          `&order=date` + // Get most recent shorts
          `&key=${this.apiKey}`
        );

        if (!searchResponse.ok) continue;
        const searchData = await searchResponse.json();
        
        // Process videos
        const channelVideos = searchData.items.map(item => ({
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt
        }));

        allVideos.push(...channelVideos);
      } catch (error) {
        console.error(`Error fetching videos for ${channel}:`, error);
        continue; // Skip to next channel on error
      }
    }

    // Shuffle videos for variety
    return this.shuffleArray(allVideos);
  }

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  isValidCache() {
    return (
      this.cache.lastFetched && 
      this.cache.videos.length > 0 && 
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry
    );
  }

  getRandomVideosFromCache(count = 10) {
    const videos = [...this.cache.videos];
    const results = [];
    
    while (results.length < count && videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      results.push(videos.splice(randomIndex, 1)[0]);
    }
    
    return results;
  }
}

export default new YouTubeService();
