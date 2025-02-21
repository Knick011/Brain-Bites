// ViralShortsAPI.js
class ViralShortsAPI {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.maxDuration = 60; // Maximum duration in seconds
    this.minLikes = 1000; // Lowered threshold for testing
    this.cachedVideos = []; // Cache for videos
  }

  async getViralShorts(maxResults = 50) {
    try {
      // If we have enough cached videos, use them
      if (this.cachedVideos.length > maxResults) {
        console.log('Using cached videos:', this.cachedVideos.length);
        return this.shuffleArray(this.cachedVideos.slice(0, maxResults));
      }

      console.log('Fetching new videos...');
      // Get videos from US and Canada in parallel
      const [usVideos, caVideos] = await Promise.all([
        this.getRegionShorts('US', maxResults),
        this.getRegionShorts('CA', maxResults)
      ]);

      console.log('Retrieved videos:', {
        US: usVideos.length,
        CA: caVideos.length
      });

      // Combine videos
      const allVideos = [...usVideos, ...caVideos];
      console.log('Total videos before filtering:', allVideos.length);

      // Get detailed stats for each video
      const detailedVideos = await this.getVideoDetails(allVideos);
      console.log('Got details for videos:', detailedVideos.length);

      // Filter and sort by criteria
      const filteredVideos = detailedVideos
        .filter(video => {
          if (!video.duration) return false;
          const duration = this.parseDuration(video.duration);
          const likes = parseInt(video.likeCount || 0);
          const isValid = duration <= this.maxDuration && likes >= this.minLikes;
          return isValid;
        })
        .sort((a, b) => parseInt(b.likeCount || 0) - parseInt(a.likeCount || 0));

      console.log('Videos after filtering:', filteredVideos.length);

      // Cache the results
      this.cachedVideos = filteredVideos;

      // Return shuffled subset
      return this.shuffleArray(filteredVideos.slice(0, maxResults));
    } catch (error) {
      console.error('Error in getViralShorts:', error);
      // Return cached videos if available, otherwise empty array
      return this.cachedVideos.length > 0 ? this.shuffleArray(this.cachedVideos) : [];
    }
  }

  async getRegionShorts(regionCode, maxResults) {
    try {
      console.log(`Fetching ${regionCode} shorts...`);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&maxResults=${maxResults * 2}` +
        `&q=%23shorts` +
        `&type=video` +
        `&videoDuration=short` +
        `&order=viewCount` +
        `&regionCode=${regionCode}` +
        `&relevanceLanguage=en` +
        `&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API request failed for region ${regionCode}: ${response.status}`);
      }

      const data = await response.json();
      console.log(`${regionCode} API response:`, data.items?.length || 0, 'items');
      
      return (data.items || []).map(item => ({
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
    if (!videos.length) return [];
    
    try {
      // Split videos into chunks of 50 (API limit)
      const chunks = this.chunkArray(videos, 50);
      let allDetails = [];

      for (const chunk of chunks) {
        const videoIds = chunk.map(v => v.videoId).join(',');
        console.log('Fetching details for videos:', videoIds);
        
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?` +
          `part=contentDetails,statistics` +
          `&id=${videoIds}` +
          `&key=${this.apiKey}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch video details: ' + response.status);
        }

        const data = await response.json();
        
        // Merge details with original video data
        const detailedChunk = chunk.map(video => {
          const details = data.items?.find(item => item.id === video.videoId);
          return {
            ...video,
            duration: details?.contentDetails?.duration || null,
            likeCount: details?.statistics?.likeCount || '0',
            viewCount: details?.statistics?.viewCount || '0'
          };
        });

        allDetails = [...allDetails, ...detailedChunk];
      }

      return allDetails;
    } catch (error) {
      console.error('Error fetching video details:', error);
      return videos; // Return original videos if details fetch fails
    }
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  parseDuration(duration) {
    if (!duration) return 0;
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    return hours * 3600 + minutes * 60 + seconds;
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

export default new ViralShortsAPI();
