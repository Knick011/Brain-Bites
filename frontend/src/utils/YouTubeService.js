// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  }

  async getPopularShorts() {
    try {
      console.log('Fetching popular shorts...');
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&maxResults=50` +
        `&q=%23shorts` +
        `&type=video` +
        `&videoDuration=short` +
        `&order=viewCount` +
        `&regionCode=US` +
        `&key=${this.apiKey}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('YouTube API Error:', errorData);
        throw new Error(`YouTube API failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Received videos:', data);

      return data.items.map(item => ({
        url: `https://www.youtube.com/shorts/${item.id.videoId}`,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle
      }));
    } catch (error) {
      console.error('Error in getPopularShorts:', error);
      throw error;
    }
  }

  async getPersonalizedShorts(accessToken) {
    try {
      console.log('Fetching subscriptions...');
      const subResponse = await fetch(
        'https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=20',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!subResponse.ok) {
        const errorData = await subResponse.json();
        console.error('Subscription API Error:', errorData);
        throw new Error('Failed to fetch subscriptions');
      }

      const subData = await subResponse.json();
      console.log('Received subscriptions:', subData);

      const channelIds = subData.items.map(item => item.snippet.resourceId.channelId);
      const videoPromises = channelIds.map(channelId =>
        fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&channelId=${channelId}` +
          `&maxResults=5` +
          `&q=%23shorts` +
          `&type=video` +
          `&videoDuration=short` +
          `&key=${this.apiKey}`
        ).then(r => r.json())
      );

      const videoResponses = await Promise.all(videoPromises);
      return videoResponses
        .flatMap(response => response.items || [])
        .map(item => ({
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle
        }));
    } catch (error) {
      console.error('Error in getPersonalizedShorts:', error);
      throw error;
    }
  }
}

export default new YouTubeService();
