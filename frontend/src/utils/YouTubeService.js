// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  }

  async getTrendingShorts() {
    try {
      // Search for trending shorts without region restriction
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&maxResults=50` +
        `&q="%23shorts"` + // Search explicitly for #shorts
        `&type=video` +
        `&order=viewCount` +
        `&key=${this.apiKey}`
      );

      if (!response.ok) throw new Error('YouTube API request failed');
      
      const searchData = await response.json();
      const videoIds = searchData.items
        .filter(item => item.id && item.id.videoId)
        .map(item => item.id.videoId);

      if (videoIds.length > 0) {
        const statsResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?` +
          `part=statistics,snippet,contentDetails` +
          `&id=${videoIds.join(',')}` +
          `&key=${this.apiKey}`
        );

        if (!statsResponse.ok) throw new Error('Failed to fetch video stats');

        const statsData = await statsResponse.json();
        const validVideos = statsData.items
          .filter(video => {
            // Check if it's actually a Short by verifying multiple criteria
            const isShort = 
              (video.snippet.description.toLowerCase().includes('#shorts') ||
               video.snippet.title.toLowerCase().includes('#shorts')) &&
              video.contentDetails.duration.match(/PT[0-6][0-9]S/);
            
            return isShort;
          })
          .map(video => ({
            url: `https://www.youtube.com/shorts/${video.id}`,
            title: video.snippet.title,
            channelTitle: video.snippet.channelTitle,
            viewCount: parseInt(video.statistics.viewCount),
            likeCount: video.statistics.likeCount ? parseInt(video.statistics.likeCount) : 0
          }));

        return this.shuffleArray(validVideos);
      }
      return [];
    } catch (error) {
      console.error('Error fetching trending shorts:', error);
      return [];
    }
  }

  async getPersonalizedShorts(accessToken) {
    try {
      // Get user's subscribed channels
      const subResponse = await fetch(
        'https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=20',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!subResponse.ok) throw new Error('Failed to fetch subscriptions');
      const subData = await subResponse.json();
      
      const channelIds = subData.items.map(item => item.snippet.resourceId.channelId);
      const personalizedVideos = [];

      for (const channelId of channelIds) {
        try {
          const searchResponse = await fetch(
            `https://youtube.googleapis.com/youtube/v3/search?` +
            `part=snippet` +
            `&channelId=${channelId}` +
            `&maxResults=5` +
            `&q="%23shorts"` +
            `&type=video` +
            `&key=${this.apiKey}`
          );

          if (!searchResponse.ok) continue;

          const searchData = await searchResponse.json();
          const videoIds = searchData.items
            .filter(item => item.id && item.id.videoId)
            .map(item => item.id.videoId);

          if (videoIds.length > 0) {
            const statsResponse = await fetch(
              `https://youtube.googleapis.com/youtube/v3/videos?` +
              `part=statistics,snippet,contentDetails` +
              `&id=${videoIds.join(',')}` +
              `&key=${this.apiKey}`
            );

            if (!statsResponse.ok) continue;

            const statsData = await statsResponse.json();
            const validVideos = statsData.items
              .filter(video => {
                // Verify it's a Short using the same criteria
                const isShort = 
                  (video.snippet.description.toLowerCase().includes('#shorts') ||
                   video.snippet.title.toLowerCase().includes('#shorts')) &&
                  video.contentDetails.duration.match(/PT[0-6][0-9]S/);
                
                return isShort;
              })
              .map(video => ({
                url: `https://www.youtube.com/shorts/${video.id}`,
                title: video.snippet.title,
                channelTitle: video.snippet.channelTitle,
                viewCount: parseInt(video.statistics.viewCount),
                likeCount: video.statistics.likeCount ? parseInt(video.statistics.likeCount) : 0
              }));

            personalizedVideos.push(...validVideos);
          }
        } catch (error) {
          console.error(`Error fetching shorts for channel ${channelId}:`, error);
          continue;
        }
      }

      // Mix with some trending content
      const trendingShorts = await this.getTrendingShorts();
      const allShorts = [...personalizedVideos, ...trendingShorts.slice(0, 10)];

      return this.shuffleArray(allShorts);
    } catch (error) {
      console.error('Error fetching personalized shorts:', error);
      return this.getTrendingShorts(); // Fallback to trending
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
