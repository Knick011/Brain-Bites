// YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.cache = {
      videos: [],
      lastFetched: null
    };
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    this.batchSize = 200;
    
    // Content categories to rotate through
    this.contentCategories = [
      'cute animal shorts',
      'funny cat shorts',
      'funny dog shorts',
      'baby animals shorts',
      'cute pets shorts',
      'animal rescue shorts',
      'amazing animals shorts'
    ];
    
    // Enhanced filtering criteria
    this.filters = {
      minViews: 500000, // Lowered slightly to include newer quality content
      minLikes: 50000,
      languages: ['en'],
      // Words that indicate quality animal content
      positiveWords: [
        'cute', 'adorable', 'funny', 'amazing',
        'cat', 'dog', 'puppy', 'kitten', 'pet',
        'animal', 'rescue', 'wildlife'
      ],
      // Filter out potentially problematic content
      forbiddenWords: [
        'prank', 'gone wrong', 'dangerous',
        'spam', 'sub4sub', 'follow', 'subscribe',
        'trauma', 'warning', 'graphic'
      ],
      titleMaxLength: 100
    };
  }

  async getViralShorts() {
    try {
      if (this.isValidCache()) {
        return this.getRandomVideosFromCache();
      }

      // Fetch videos from multiple categories
      const allVideos = await this.fetchFromAllCategories();
      const filteredVideos = this.applyCustomFilters(allVideos);
      
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

  async fetchFromAllCategories() {
    const allVideos = [];
    const videosPerCategory = Math.floor(this.batchSize / this.contentCategories.length);

    // Fetch videos from each category
    for (const category of this.contentCategories) {
      try {
        const videos = await this.fetchVideosForCategory(category, videosPerCategory);
        allVideos.push(...videos);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
      }
    }

    return allVideos;
  }

  async fetchVideosForCategory(category, maxResults) {
    const searchResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?` +
      `part=snippet` +
      `&maxResults=${maxResults}` +
      `&q=${encodeURIComponent(category)}` +
      `&type=video` +
      `&videoDuration=short` +
      `&order=viewCount` +
      `&regionCode=US` +
      `&key=${this.apiKey}`
    );

    if (!searchResponse.ok) throw new Error('Search request failed');
    const searchData = await searchResponse.json();

    // Get video statistics
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const statsResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?` +
      `part=statistics,snippet` +
      `&id=${videoIds}` +
      `&key=${this.apiKey}`
    );

    if (!statsResponse.ok) throw new Error('Stats request failed');
    const statsData = await statsResponse.json();

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
        category,
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
      // Basic stats checks
      if (video.stats.views < this.filters.minViews) return false;
      if (video.stats.likes < this.filters.minLikes) return false;

      // Check title length
      if (video.title.length > this.filters.titleMaxLength) return false;

      // Language check if available
      if (video.language && !this.filters.languages.includes(video.language)) return false;

      // Check for positive indicators in title or description
      const hasPositiveContent = this.filters.positiveWords.some(word => 
        video.title.toLowerCase().includes(word) || 
        video.description.toLowerCase().includes(word)
      );
      if (!hasPositiveContent) return false;

      // Check for forbidden content
      const hasForbiddenContent = this.filters.forbiddenWords.some(word =>
        video.title.toLowerCase().includes(word) ||
        video.description.toLowerCase().includes(word)
      );
      if (hasForbiddenContent) return false;

      // Engagement quality check
      const engagementRate = (video.stats.likes / video.stats.views) * 100;
      if (engagementRate < 1) return false;

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
