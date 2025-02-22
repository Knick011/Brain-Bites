// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.VIEW_THRESHOLD = 500000;
    this.LIKE_THRESHOLD = 10000;
    this.REGIONS = ['US', 'CA']; // USA and Canada region codes
    this.MAX_RESULTS_PER_REGION = 25; // Adjust based on your needs
  }

  async getViralShorts() {
    try {
      const allVideos = [];

      // Fetch videos for each region
      for (const regionCode of this.REGIONS) {
        const videos = await this.fetchRegionalShorts(regionCode);
        allVideos.push(...videos);
      }

      return this.shuffleArray(allVideos);
    } catch (error) {
      console.error('Error fetching viral shorts:', error);
      return [];
    }
  }

  async fetchRegionalShorts(regionCode) {
    try {
      // Search for trending Shorts in specific region
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&maxResults=${this.MAX_RESULTS_PER_REGION}` +
        `&q="%23shorts"` + // Search explicitly for #shorts
        `&type=video` +
        `&order=viewCount` +
        `&regionCode=${regionCode}` + // Specify region
        `&relevanceLanguage=en` +
        `&videoCategoryId=17` + // Sports category to help with trending content
        `&key=${this.apiKey}`
      );

      if (!response.ok) throw new Error(`YouTube API request failed for region ${regionCode}`);
      
      const searchData = await response.json();
      const videoIds = searchData.items
        .filter(item => item.id && item.id.videoId)
        .map(item => item.id.videoId);

      if (videoIds.length === 0) return [];

      // Fetch detailed video statistics
      const statsResponse = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?` +
        `part=statistics,snippet,contentDetails,status` + // Added status to check embeddable
        `&id=${videoIds.join(',')}` +
        `&key=${this.apiKey}`
      );

      if (!statsResponse.ok) throw new Error(`Failed to fetch video stats for region ${regionCode}`);

      const statsData = await statsResponse.json();
      const validVideos = statsData.items
        .filter(video => {
          const viewCount = parseInt(video.statistics.viewCount) || 0;
          const likeCount = parseInt(video.statistics.likeCount) || 0;
          
          // Enhanced validation for Shorts
          const isShort = this.validateShort(video);
          
          // Check if video is embeddable and not age-restricted
          const isEmbeddable = video.status.embeddable && !video.contentDetails.contentRating;
          
          return viewCount >= this.VIEW_THRESHOLD &&
                 likeCount >= this.LIKE_THRESHOLD &&
                 isShort &&
                 isEmbeddable;
        })
        .map(video => ({
          id: video.id,
          url: `https://www.youtube.com/shorts/${video.id}`,
          title: video.snippet.title,
          channelTitle: video.snippet.channelTitle,
          viewCount: parseInt(video.statistics.viewCount),
          likeCount: parseInt(video.statistics.likeCount),
          region: regionCode,
          publishedAt: video.snippet.publishedAt,
          thumbnail: video.snippet.thumbnails.high.url
        }));

      return validVideos;
    } catch (error) {
      console.error(`Error fetching shorts for region ${regionCode}:`, error);
      return [];
    }
  }

  validateShort(video) {
    // Enhanced validation for Shorts
    const hasShortsMeta = 
      video.snippet.description.toLowerCase().includes('#shorts') ||
      video.snippet.title.toLowerCase().includes('#shorts');

    // Parse duration string (PT1M30S format)
    const durationStr = video.contentDetails.duration;
    const minutes = (durationStr.match(/(\d+)M/) || [null, 0])[1];
    const seconds = (durationStr.match(/(\d+)S/) || [null, 0])[1];
    const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);

    // Shorts are typically between 15-60 seconds
    const isValidDuration = totalSeconds >= 15 && totalSeconds <= 60;

    return hasShortsMeta && isValidDuration;
  }

  async getPersonalizedShorts(accessToken) {
    try {
      const personalizedVideos = [];

      // Fetch subscriptions for each region
      for (const regionCode of this.REGIONS) {
        const subResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/subscriptions?` +
          `part=snippet` +
          `&mine=true` +
          `&maxResults=20` +
          `&regionCode=${regionCode}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!subResponse.ok) continue;
        
        const subData = await subResponse.json();
        const channelIds = subData.items.map(item => item.snippet.resourceId.channelId);

        for (const channelId of channelIds) {
          const videos = await this.fetchChannelShorts(channelId, regionCode);
          personalizedVideos.push(...videos);
        }
      }

      // Mix with viral videos from the same regions
      const viralVideos = await this.getViralShorts();
      const allVideos = [...personalizedVideos, ...viralVideos.slice(0, 10)];

      return this.shuffleArray(allVideos);
    } catch (error) {
      console.error('Error fetching personalized shorts:', error);
      return this.getViralShorts();
    }
  }

  async fetchChannelShorts(channelId, regionCode) {
    try {
      const searchResponse = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&channelId=${channelId}` +
        `&maxResults=5` +
        `&q="%23shorts"` +
        `&type=video` +
        `&regionCode=${regionCode}` +
        `&relevanceLanguage=en` +
        `&key=${this.apiKey}`
      );

      if (!searchResponse.ok) return [];

      const searchData = await searchResponse.json();
      const videoIds = searchData.items
        .filter(item => item.id && item.id.videoId)
        .map(item => item.id.videoId);

      if (videoIds.length === 0) return [];

      const statsResponse = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?` +
        `part=statistics,snippet,contentDetails,status` +
        `&id=${videoIds.join(',')}` +
        `&key=${this.apiKey}`
      );

      if (!statsResponse.ok) return [];

      const statsData = await statsResponse.json();
      return statsData.items
        .filter(video => {
          const viewCount = parseInt(video.statistics.viewCount) || 0;
          const likeCount = parseInt(video.statistics.likeCount) || 0;
          const isShort = this.validateShort(video);
          const isEmbeddable = video.status.embeddable && !video.contentDetails.contentRating;
          
          return viewCount >= this.VIEW_THRESHOLD &&
                 likeCount >= this.LIKE_THRESHOLD &&
                 isShort &&
                 isEmbeddable;
        })
        .map(video => ({
          id: video.id,
          url: `https://www.youtube.com/shorts/${video.id}`,
          title: video.snippet.title,
          channelTitle: video.snippet.channelTitle,
          viewCount: parseInt(video.statistics.viewCount),
          likeCount: parseInt(video.statistics.likeCount),
          region: regionCode,
          publishedAt: video.snippet.publishedAt,
          thumbnail: video.snippet.thumbnails.high.url
        }));
    } catch (error) {
      console.error(`Error fetching channel shorts for ${channelId}:`, error);
      return [];
    }
  }

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
