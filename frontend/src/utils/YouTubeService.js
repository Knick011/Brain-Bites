// utils/YouTubeShortsService.js
class YouTubeShortsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  }

  async getViralShorts() {
    try {
      // First get trending videos
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?` +
        `part=snippet` +
        `&chart=mostPopular` +
        `&maxResults=50` +
        `&videoCategoryId=35` + // For short-form content
        `&regionCode=US` +
        `&key=${this.apiKey}`
      );

      if (!response.ok) {
        console.error('Error response:', await response.json());
        throw new Error('Failed to fetch trending videos');
      }

      const data = await response.json();
      return data.items.map(item => ({
        url: `https://www.youtube.com/shorts/${item.id}`,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle
      }));
    } catch (error) {
      console.error('Error fetching viral shorts:', error);
      return [];
    }
  }

  async getPersonalizedShorts(accessToken) {
    try {
      // Get user's watch history and trending shorts
      const [historyResponse, trendingResponse] = await Promise.all([
        fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&maxResults=25` +
          `&q=%23shorts` +
          `&type=video` +
          `&videoDuration=short` +
          `&order=rating` + // Get highly rated shorts
          `&key=${this.apiKey}`,
          {
            headers: accessToken ? {
              'Authorization': `Bearer ${accessToken}`
            } : {}
          }
        ),
        this.getViralShorts()
      ]);

      const historyData = await historyResponse.json();
      
      // Combine personalized and trending videos
      const allVideos = [
        ...(historyData.items || []).map(item => ({
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle
        })),
        ...trendingResponse
      ];

      // Shuffle the array
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
