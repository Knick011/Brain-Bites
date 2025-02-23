// YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.cache = {
      videos: [],
      lastFetched: null
    };
    this.cacheExpiry = 24 * 60 * 60 * 1000;
    
    // Channel IDs (these are more reliable than handles)
    this.channels = [
      { handle: 'LukeDavidson', id: 'UCgukwUkm4KxWtR4NHVIz_aw' },
      { handle: 'Kallmekris', id: 'UCrVxhp3_PsRTCEHV_-bGnmQ' },
      { handle: 'Mythic', id: 'UCjIl9tbIu-FmH8b8UaeLqzw' },
      { handle: 'ZachKing', id: 'UCq8DICunczvLuJJq414110A' },
      { handle: 'MrBeast', id: 'UCX6OQ3DkcsbYNE6H8uQQuVA' }
      // We can add more channels, but let's test with these first
    ];
  }

  async getViralShorts() {
    try {
      console.log('Starting getViralShorts');
      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getRandomVideosFromCache();
      }

      console.log('Cache invalid, fetching new videos');
      const allVideos = await this.fetchFromChannels();
      
      this.cache = {
        videos: allVideos,
        lastFetched: Date.now()
      };

      return this.getRandomVideosFromCache();
    } catch (error) {
      console.error('Error in getViralShorts:', error);
      return this.cache.videos.length ? this.getRandomVideosFromCache() : [];
    }
  }

  async fetchFromChannels() {
    const allVideos = [];

    for (const channel of this.channels) {
      try {
        console.log(`Fetching videos for channel: ${channel.handle}`);
        
        // Get recent shorts from this channel
        const searchResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&channelId=${channel.id}` +
          `&maxResults=10` +
          `&type=video` +
          `&videoDuration=short` +
          `&order=date` + // Get most recent shorts
          `&key=${this.apiKey}`
        );

        if (!searchResponse.ok) {
          console.error(`Search response not OK for ${channel.handle}:`, await searchResponse.text());
          continue;
        }

        const searchData = await searchResponse.json();
        console.log(`Found ${searchData.items?.length || 0} videos for ${channel.handle}`);

        if (!searchData.items?.length) {
          console.log(`No shorts found for ${channel.handle}`);
          continue;
        }

        const channelVideos = searchData.items
          .filter(item => item.id?.videoId) // Make sure we have a video ID
          .map(item => ({
            url: `https://www.youtube.com/shorts/${item.id.videoId}`,
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            channelHandle: channel.handle,
            publishedAt: item.snippet.publishedAt
          }));

        console.log(`Processed ${channelVideos.length} videos for ${channel.handle}`);
        allVideos.push(...channelVideos);

      } catch (error) {
        console.error(`Error processing channel ${channel.handle}:`, error);
      }
    }

    console.log(`Total videos fetched: ${allVideos.length}`);
    return this.shuffleArray(allVideos);
  }

  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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

  clearCache() {
    console.log('Clearing cache');
    this.cache = {
      videos: [],
      lastFetched: null
    };
    console.log('Cache cleared');
  }
}

export default new YouTubeService();
