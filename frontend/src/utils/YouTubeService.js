// YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.cache = {
      videos: [],
      lastFetched: null
    };
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    this.batchSize = 200; // Get maximum videos at once
    
    // Filtering criteria
    this.filters = {
      minViews: 1000000,
      minLikes: 100000,
      languages: ['en'], // English content
      forbiddenWords: ['spam', 'sub4sub', 'follow4follow', 'subscribe'], // Filter out spam
      titleMaxLength: 100, // Filter out overly long titles that might be spam
      requiredTags: ['#shorts'], // Must have these tags
    };
  }

  async getViralShorts() {
    try {
      // Check cache first
      if (this.isValidCache()) {
        return this.getRandomVideosFromCache();
      }

      // Fetch new batch if cache expired
      const videos = await this.fetchAndProcessVideos();
      
      // Apply our custom filtering
      const filteredVideos = this.applyCustomFilters(videos);
      
      // Update cache with filtered videos
      this.cache = {
        videos: filteredVideos,
        lastFetched: Date.now()
      };

      return this.getRandomVideosFromCache();
    } catch (error) {
      console.error('Error fetching viral shorts:', error);
      return this.cache.videos.length ? this.getRandomVideosFromCache() : [];
    }
  }

  async fetchAndProcessVideos() {
    // Initial search with minimal filtering to get maximum results
    const searchResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?` +
      `part=snippet` +
      `&maxResults=${this.batchSize}` +
      `&q=%23shorts` +
      `&type=video` +
      `&videoDuration=short` +
      `&order=viewCount` +
      `&regionCode=US` +
      `&key=${this.apiKey}`
    );

    if (!searchResponse.ok) throw new Error('Search request failed');
    const searchData = await searchResponse.json();

    // Get statistics in one batch request
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const statsResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?` +
      `part=statistics,snippet` + // Get both stats and full snippet
      `&id=${videoIds}` +
      `&key=${this.apiKey}`
    );

    if (!statsResponse.ok) throw new Error('Stats request failed');
    const statsData = await statsResponse.json();

    // Combine search and stats data
    return statsData.items.map(video => {
      const searchItem = searchData.items.find(item => item.id.videoId === video.id);
      return {
        url: `https://www.youtube.com/shorts/${video.id}`,
        title: video.snippet.title,
        description: video.snippet.description,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        language: video.snippet.defaultLanguage || video.snippet.defaultAudioLanguage,
        tags: video.snippet.tags || [],
        stats: {
          views: parseInt(video.statistics.viewCount),
          likes: parseInt(video.statistics.likeCount),
          comments: parseInt(video.statistics.commentCount)
        }
      };
    });
  }

  applyCustomFilters(videos) {
    return videos.filter(video => {
      // Check minimum views and likes
      if (video.stats.views < this.filters.minViews) return false;
      if (video.stats.likes < this.filters.minLikes) return false;

      // Check language (if available)
      if (video.language && !this.filters.languages.includes(video.language)) return false;

      // Check title length
      if (video.title.length > this.filters.titleMaxLength) return false;

      // Check for required tags
      const hasRequiredTags = this.filters.requiredTags.some(tag => 
        video.title.toLowerCase().includes(tag) || 
        video.description.toLowerCase().includes(tag) ||
        video.tags.some(videoTag => videoTag.toLowerCase().includes(tag))
      );
      if (!hasRequiredTags) return false;

      // Check for forbidden words
      const hasForbiddenWords = this.filters.forbiddenWords.some(word =>
        video.title.toLowerCase().includes(word) ||
        video.description.toLowerCase().includes(word)
      );
      if (hasForbiddenWords) return false;

      // Calculate engagement rate (likes/views ratio)
      const engagementRate = (video.stats.likes / video.stats.views) * 100;
      if (engagementRate < 1) return false; // Filter out potentially fake/botted videos

      return true;
    });
  }

  isValidCache() {
    return (
      this.cache.lastFetched && 
      this.cache.videos.length > 0 && 
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry
    );
  }

  getRandomVideosFromCache(count = 10) {
    const videos = [...this.cache.videos];
    const results = [];
    
    while (results.length < count && videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      results.push(videos.splice(randomIndex, 1)[0]);
    }
    
    return results;
  }
}

export default new YouTubeService();
