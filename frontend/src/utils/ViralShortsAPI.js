// ViralShortsAPI.js
class ViralShortsAPI {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  }

  async getViralShorts(maxResults = 50) {
    try {
      // Search for most viewed #shorts
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&maxResults=${maxResults}` +
        `&q=%23shorts` +
        `&type=video` +
        `&videoDuration=short` +
        `&order=viewCount` + // This gets the most viewed videos
        `&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('YouTube API request failed');
      }

      const data = await response.json();
      
      // Convert to Shorts URLs
      return data.items.map(item => ({
        url: `https://www.youtube.com/shorts/${item.id.videoId}`,
        title: item.snippet.title
      }));
    } catch (error) {
      console.error('Error fetching viral Shorts:', error);
      return [];
    }
  }
}

export default new ViralShortsAPI();
