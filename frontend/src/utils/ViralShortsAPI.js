// ViralShortsAPI.js
class ViralShortsAPI {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.maxDuration = 120; // Maximum duration in seconds
    this.minLikes = 1000; // Minimum likes threshold
  }

  async getViralShorts(maxResults = 50) {
    try {
      // Get videos from US and Canada in parallel
      const [usVideos, caVideos] = await Promise.all([
        this.getRegionShorts('US', Math.ceil(maxResults/2)),
        this.getRegionShorts('CA', Math.floor(maxResults/2))
      ]);

      // Combine and filter videos
      const allVideos = [...usVideos, ...caVideos];
      
      // Get detailed stats for each video
      const detailedVideos = await this.getVideoDetails(allVideos);
      
      // Filter and sort by criteria
      const filteredVideos = detailedVideos
        .filter(video => {
          const duration = this.parseDuration(video.duration);
          return (
            duration <= this.maxDuration && // Check duration
            parseInt(video.likeCount || 0) >= this.minLikes // Check likes
          );
        })
        .sort((a, b) => parseInt(b.likeCount || 0) - parseInt(a.likeCount || 0)); // Sort by likes

      return this.shuffleArray(filteredVideos);
    } catch (error) {
      console.error('Error fetching viral Shorts:', error);
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
        `&relevanceLanguage=en` +
        `&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API request failed for region ${regionCode}`);
      }

      const data = await response.json();
      
      return data.items.map(item => ({
        videoId: item.id.videoId,
        url: `https://www.youtube.com/shorts/${item.id.videoId}`,
        title: item.snippet.title,
        region: regionCode
      }));
    } catch (error) {
      console.error(`Error fetching ${regionCode} Shorts:`, error);
      return [];
    }
  }

  async getVideoDetails(videos) {
    try {
      // Get video IDs
      const videoIds = videos.map(v => v.videoId).join(',');
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
        `part=contentDetails,statistics` +
        `&id=${videoIds}` +
        `&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch video details');
      }

      const data = await response.json();
      
      // Merge details with original video data
      return videos.map(video => {
        const details = data.items.find(item => item.id === video.videoId);
        return {
          ...video,
          duration: details?.contentDetails?.duration || 'PT0S',
          likeCount: details?.statistics?.likeCount || '0',
          viewCount: details?.statistics?.viewCount || '0'
        };
      });
    } catch (error) {
      console.error('Error fetching video details:', error);
      return videos; // Return original videos if details fetch fails
    }
  }

  // Parse ISO 8601 duration to seconds
  parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Fisher-Yates shuffle algorithm
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export default new ViralShortsAPI();
