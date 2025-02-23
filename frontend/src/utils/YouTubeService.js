// YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.cache = {
      videos: [],
      lastFetched: null
    };
    this.cacheExpiry = 24 * 60 * 60 * 1000;
    this.channels = [/* ... your channel list ... */];
  }

  async getViralShorts() {
    try {
      console.log('Cache status:', {
        hasCache: this.cache.videos.length > 0,
        lastFetched: this.cache.lastFetched,
        isValid: this.isValidCache()
      });

      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getRandomVideosFromCache();
      }

      console.log('Fetching new videos...');
      const allVideos = await this.fetchFromChannels();
      console.log(`Successfully fetched ${allVideos.length} videos`);
      
      this.cache = {
        videos: allVideos,
        lastFetched: Date.now()
      };

      return this.getRandomVideosFromCache();
    } catch (error) {
      console.error('Error in getViralShorts:', error);
      return [];
    }
  }

  async fetchFromChannels() {
    const allVideos = [];

    for (const channel of this.channels) {
      try {
        console.log(`Fetching videos for channel: ${channel}`);
        
        // Get channel ID first
        const channelResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/channels?` +
          `part=id` +
          `&forHandle=${channel}` +
          `&key=${this.apiKey}`
        );

        if (!channelResponse.ok) {
          console.error(`Channel response not OK for ${channel}:`, await channelResponse.text());
          continue;
        }

        const channelData = await channelResponse.json();
        console.log('Channel data:', channelData);

        if (!channelData.items?.length) {
          console.error(`No channel found for ${channel}`);
          continue;
        }

        const channelId = channelData.items[0].id;
        console.log(`Found channel ID: ${channelId} for ${channel}`);

        // Get shorts from this channel
        const searchResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&channelId=${channelId}` +
          `&maxResults=10` +
          `&q=%23shorts` +
          `&type=video` +
          `&videoDuration=short` +
          `&order=date` +
          `&key=${this.apiKey}`
        );

        if (!searchResponse.ok) {
          console.error(`Search response not OK for ${channel}:`, await searchResponse.text());
          continue;
        }

        const searchData = await searchResponse.json();
        console.log(`Found ${searchData.items?.length || 0} videos for ${channel}`);

        if (!searchData.items?.length) {
          console.log(`No shorts found for ${channel}`);
          continue;
        }

        const channelVideos = searchData.items
          .filter(item => item.id?.videoId) // Make sure we have a video ID
          .map(item => ({
            url: `https://www.youtube.com/shorts/${item.id.videoId}`,
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            channelHandle: channel,
            publishedAt: item.snippet.publishedAt
          }));

        console.log(`Processed ${channelVideos.length} videos for ${channel}`);
        allVideos.push(...channelVideos);

      } catch (error) {
        console.error(`Error processing channel ${channel}:`, error);
      }
    }

    console.log(`Total videos fetched: ${allVideos.length}`);
    return this.shuffleArray(allVideos);
  }

  clearCache() {
    console.log('Clearing cache');
    this.cache = {
      videos: [],
      lastFetched: null
    };
    console.log('Cache cleared');
  }

  isValidCache() {
    const isValid = (
      this.cache.lastFetched && 
      this.cache.videos.length > 0 && 
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry
    );
    console.log('Cache validity check:', {
      hasLastFetched: !!this.cache.lastFetched,
      videosCount: this.cache.videos.length,
      timeSinceLastFetch: this.cache.lastFetched ? (Date.now() - this.cache.lastFetched) : null,
      isValid
    });
    return isValid;
  }

  getRandomVideosFromCache(count = 10) {
    const videos = [...this.cache.videos];
    const results = [];
    
    console.log(`Getting ${count} random videos from cache of ${videos.length} videos`);
    
    while (results.length < count && videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length);
      results.push(videos.splice(randomIndex, 1)[0]);
    }
    
    console.log('Selected videos:', results.map(v => ({
      channel: v.channelHandle,
      title: v.title
    })));
    
    return results;
  }
}

export default new YouTubeService();
