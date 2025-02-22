// utils/YouTubeShortsService.js
class YouTubeShortsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  }

  async getViralShorts({ maxResults = 50, regions = ['US', 'CA'] }) {
    try {
      // Get videos from all specified regions
      const regionalVideosPromises = regions.map(region => 
        this.getRegionShorts(region, Math.ceil(maxResults / regions.length))
      );

      const regionalVideos = await Promise.all(regionalVideosPromises);
      
      // Combine and sort by viewCount
      const allVideos = regionalVideos
        .flat()
        .sort((a, b) => parseInt(b.viewCount) - parseInt(a.viewCount));

      return allVideos.map(video => ({
        ...video,
        isPersonalized: false
      }));
    } catch (error) {
      console.error('Error fetching viral shorts:', error);
      return [];
    }
  }

  async getRegionShorts(regionCode, maxResults) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&maxResults=${maxResults * 2}` + // Request more to account for filtering
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
      
      // Get detailed stats for the videos
      const videos = await this.getVideoDetails(
        data.items.map(item => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle
        }))
      );

      return videos;
    } catch (error) {
      console.error(`Error fetching ${regionCode} Shorts:`, error);
      return [];
    }
  }

  async getVideoDetails(videos) {
    if (!videos.length) return [];

    try {
      const videoIds = videos.map(v => v.videoId).join(',');
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
        `part=statistics,contentDetails` +
        `&id=${videoIds}` +
        `&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch video details');
      }

      const data = await response.json();

      return videos.map(video => {
        const details = data.items.find(item => item.id === video.videoId);
        return {
          ...video,
          url: `https://www.youtube.com/shorts/${video.videoId}`,
          viewCount: details?.statistics?.viewCount || '0',
          likeCount: details?.statistics?.likeCount || '0'
        };
      });
    } catch (error) {
      console.error('Error fetching video details:', error);
      return videos.map(video => ({
        ...video,
        url: `https://www.youtube.com/shorts/${video.videoId}`,
        viewCount: '0',
        likeCount: '0'
      }));
    }
  }
}

export default new YouTubeShortsService();