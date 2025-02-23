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
    
    // Specific content we want to fetch
    this.searchQueries = [
      'cute kitten shorts',
      'funny puppy shorts',
      'cute baby animals shorts',
      'funny cat compilation shorts',
      'happy dog shorts',
      'playful pets shorts',
      'adorable animals shorts',
      'cat and dog friends shorts',
      'rescue animals shorts',
      'animal friendship shorts'
    ];
  }

  async getViralShorts() {
    try {
      if (this.isValidCache()) {
        return this.getRandomVideosFromCache();
      }

      const allVideos = await this.fetchQualityContent();
      
      // Sort by views in descending order
      allVideos.sort((a, b) => b.stats.views - a.stats.views);
      
      this.cache = {
        videos: allVideos,
        lastFetched: Date.now()
      };

      return this.getRandomVideosFromCache();
    } catch (error) {
      console.error('Error fetching shorts:', error);
      return this.cache.videos.length ? this.getRandomVideosFromCache() : [];
    }
  }

  async fetchQualityContent() {
    const allVideos = [];
    const videosPerQuery = Math.floor(this.batchSize / this.searchQueries.length);

    for (const query of this.searchQueries) {
      try {
        const searchResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&maxResults=${videosPerQuery}` +
          `&q=${encodeURIComponent(query)}` +
          `&type=video` +
          `&videoDuration=short` +
          `&regionCode=US` +
          `&relevanceLanguage=en` +
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

        const processedVideos = statsData.items
          .map(video => {
            const searchItem = searchData.items.find(item => item.id.videoId === video.id);
            return {
              url: `https://www.youtube.com/shorts/${video.id}`,
              title: video.snippet.title,
              description: video.snippet.description,
              channelTitle: video.snippet.channelTitle,
              publishedAt: video.snippet.publishedAt,
              query, // Store the search query that found this video
              stats: {
                views: parseInt(video.statistics.viewCount) || 0,
                likes: parseInt(video.statistics.likeCount) || 0,
                comments: parseInt(video.statistics.commentCount) || 0
              }
            };
          })
          .filter(video => {
            // Basic quality filters
            if (video.stats.views < 100000) return false; // Minimum views
            if (video.stats.likes < 10000) return false;  // Minimum likes
            
            // Filter out likely spam/unwanted content
            const lowercaseTitle = video.title.toLowerCase();
            const lowercaseDesc = video.description.toLowerCase();
            
            const spamWords = ['sub4sub', 'follow4follow', 'subscribe', 'link in bio'];
            if (spamWords.some(word => lowercaseTitle.includes(word) || lowercaseDesc.includes(word))) {
              return false;
            }

            // Check for relevant content indicators
            const qualityIndicators = ['cute', 'funny', 'adorable', 'pet', 'animal', 'kitten', 'puppy', 'cat', 'dog'];
            return qualityIndicators.some(word => 
              lowercaseTitle.includes(word) || lowercaseDesc.includes(word)
            );
          });

        allVideos.push(...processedVideos);
      } catch (error) {
        console.error(`Error fetching ${query}:`, error);
      }
    }

    // Remove duplicates (same video might appear in different searches)
    const uniqueVideos = Array.from(new Map(allVideos.map(video => [video.url, video])).values());
    
    // Sort by views in descending order
    return uniqueVideos.sort((a, b) => b.stats.views - a.stats.views);
  }

  isValidCache() {
    return (
      this.cache.lastFetched && 
      this.cache.videos.length > 0 && 
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry
    );
  }

  getRandomVideosFromCache(count = 10) {
    // Get top 50 videos by views
    const topVideos = this.cache.videos.slice(0, 50);
    const results = [];
    
    // Select random videos from top 50
    while (results.length < count && topVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * topVideos.length);
      results.push(topVideos.splice(randomIndex, 1)[0]);
    }
    
    return results;
  }
}

export default new YouTubeService();
