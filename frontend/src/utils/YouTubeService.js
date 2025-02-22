// utils/YouTubeShortsService.js
class YouTubeShortsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  }

  async getViralShorts() {
    try {
      // Get popular shorts from US and Canada
      const regions = ['US', 'CA'];
      const requests = regions.map(region =>
        fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&maxResults=25` +
          `&q=%23shorts` +
          `&type=video` +
          `&videoDuration=short` +
          `&order=viewCount` + // Sort by view count
          `&regionCode=${region}` +
          `&key=${this.apiKey}`
        ).then(r => r.json())
      );

      const responses = await Promise.all(requests);
      const videos = responses
        .flatMap(data => data.items || [])
        .map(item => ({
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle
        }));

      return this.shuffleArray(videos);
    } catch (error) {
      console.error('Error fetching viral shorts:', error);
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
      
      // Get videos from each channel
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
          `&order=viewCount` + // Get most viewed shorts from each channel
          `&key=${this.apiKey}`
        ).then(r => r.json())
      );

      const videoResponses = await Promise.all(videoPromises);
      const personalizedVideos = videoResponses
        .flatMap(response => response.items || [])
        .map(item => ({
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle
        }));

      // Mix with some viral videos
      const viralVideos = await this.getViralShorts();
      const allVideos = [...personalizedVideos, ...viralVideos.slice(0, 10)];

      return this.shuffleArray(allVideos);
    } catch (error) {
      console.error('Error fetching personalized shorts:', error);
      // Fallback to viral shorts if personalized fails
      return this.getViralShorts();
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

export default new YouTubeShortsService();
