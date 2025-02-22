// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.ALLOWED_REGIONS = ['US', 'CA'];
  }

  async getViralShorts() {
    try {
      // Get popular shorts from US and Canada using search endpoint
      const requests = this.ALLOWED_REGIONS.map(region =>
        fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&maxResults=25` +
          `&q=%23shorts` +
          `&type=video` +
          `&videoDuration=short` + // Only short duration videos
          `&order=viewCount` + // Sort by views
          `&regionCode=${region}` +
          `&key=${this.apiKey}`
        ).then(r => r.json())
      );

      const responses = await Promise.all(requests);
      const videos = responses
        .flatMap(data => data.items || [])
        .filter(item => {
          // Additional verification for shorts
          const description = item.snippet.description.toLowerCase();
          const title = item.snippet.title.toLowerCase();
          return (
            (description.includes('#shorts') || title.includes('#shorts')) &&
            item.id && item.id.videoId // Ensure we have a valid video ID
          );
        })
        .map(item => ({
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          region: item.snippet.regionCode
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
      
      // Get shorts from each channel
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
      const personalizedVideos = videoResponses
        .flatMap(response => response.items || [])
        .filter(item => {
          // Verify these are actually shorts
          const description = item.snippet.description.toLowerCase();
          const title = item.snippet.title.toLowerCase();
          return (
            (description.includes('#shorts') || title.includes('#shorts')) &&
            item.id && item.id.videoId
          );
        })
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

export default new YouTubeService();
