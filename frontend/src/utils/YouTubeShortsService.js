// YouTubeShortsService.js
class YouTubeShortsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.oneYearAgo = new Date();
    this.oneYearAgo.setFullYear(this.oneYearAgo.getFullYear() - 1);
  }

  async getViralShorts(maxResults = 50) {
    try {
      // Only get shorts from US and Canada
      const [usShorts, caShorts] = await Promise.all([
        this.getRegionalShorts('US', maxResults),
        this.getRegionalShorts('CA', maxResults)
      ]);

      console.log('Fetched shorts - US:', usShorts.length, 'CA:', caShorts.length);

      const allShorts = [...usShorts, ...caShorts]
        .filter(video => {
          const publishDate = new Date(video.publishedAt);
          return publishDate >= this.oneYearAgo;
        })
        .sort((a, b) => parseInt(b.viewCount) - parseInt(a.viewCount));

      console.log('Combined and filtered shorts:', allShorts.length);
      return allShorts;
    } catch (error) {
      console.error('Error fetching viral shorts:', error);
      return [];
    }
  }

  async getRegionalShorts(regionCode, maxResults) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&maxResults=${maxResults}` +
        `&q=%23shorts` +
        `&type=video` +
        `&videoDuration=short` +
        `&order=viewCount` +
        `&regionCode=${regionCode}` +
        `&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API request failed for region ${regionCode}`);
      }

      const data = await response.json();
      console.log(`${regionCode} API response received:`, data.items?.length || 0, 'items');
      
      // Get video details including view counts
      const videoIds = data.items.map(item => item.id.videoId).join(',');
      const statsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
        `part=statistics,snippet` +
        `&id=${videoIds}` +
        `&key=${this.apiKey}`
      );

      const statsData = await statsResponse.json();

      return data.items.map(item => {
        const stats = statsData.items.find(v => v.id === item.id.videoId);
        return {
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title,
          publishedAt: item.snippet.publishedAt,
          viewCount: stats?.statistics?.viewCount || '0',
          region: regionCode,
          type: 'viral'
        };
      });
    } catch (error) {
      console.error(`Error fetching ${regionCode} shorts:`, error);
      return [];
    }
  }

  async getMixedShorts(personalizedVideos, maxResults = 50) {
    const personalizedCount = Math.floor(maxResults * (5/6));
    const viralCount = maxResults - personalizedCount;

    const viralShorts = await this.getViralShorts(viralCount);

    const mixedShorts = [
      ...personalizedVideos.slice(0, personalizedCount),
      ...viralShorts
    ];

    return this.shuffleArray(mixedShorts);
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

export default new YouTubeShortsService();
