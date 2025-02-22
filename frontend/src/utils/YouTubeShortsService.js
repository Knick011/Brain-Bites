// utils/YouTubeShortsService.js
class YouTubeShortsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  }

  async getViralShorts({ maxResults = 50, regions = ['US', 'CA'] }) {
    try {
      const allVideos = [];
      
      for (const region of regions) {
        const response = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&maxResults=${maxResults}` +
          `&q=%23shorts` +
          `&type=video` +
          `&videoDuration=short` +
          `&order=viewCount` +
          `&regionCode=${region}` +
          `&key=${this.apiKey}`
        );

        if (!response.ok) {
          throw new Error(`YouTube API request failed for region ${region}`);
        }

        const data = await response.json();
        const videos = data.items.map(item => ({
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          isPersonalized: false
        }));
        
        allVideos.push(...videos);
      }

      // Shuffle the videos
      return this.shuffleArray(allVideos);
    } catch (error) {
      console.error('Error fetching viral shorts:', error);
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

export default new YouTubeShortsService();
