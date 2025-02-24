// YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set() // Track shown videos to prevent repeats
    };
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    
    // All channels with their IDs
    this.channels = [
      { handle: 'LukeDavidson', id: 'UCgukwUkm4KxWtR4NHVIz_aw' },
      { handle: 'Kallmekris', id: 'UCrVxhp3_PsRTCEHV_-bGnmQ' },
      { handle: 'MDMotivator', id: 'UCO0F_MB6xTV_BY5AZT-OVJQ' },
      { handle: 'sandiction', id: 'UCQkA7PsZm6G9QXJPQhz9_sA' },
      { handle: 'Mythic', id: 'UCjIl9tbIu-FmH8b8UaeLqzw' },
      { handle: 'TheMagicMatt', id: 'UCtc2iRmzJA_y2aV-F6LNVHQ' },
      { handle: 'GoldenGully', id: 'UCjtB3JF_FYXJTnLl-lRN_5Q' },
      { handle: 'DokaRyan', id: 'UCrxnUEw7w3rWyvazn_QAjjQ' },
      { handle: 'Ottawalks', id: 'UCdOvlULrkZHlgpOCiYKYEfQ' },
      { handle: 'Shangerdanger', id: 'UC3EKIGYCjfKg8qK1KlceBLw' },
      { handle: 'Hingaflips', id: 'UCORjlzGBYCeJvspCUJMzvzA' },
      { handle: 'ChrisIvan', id: 'UCLbMTQR7TXzPAYJ0FsAL2xw' },
      { handle: 'BrodieThatDood', id: 'UCLt2UjGcHpzvQGCDxlV-P-g' },
      { handle: 'AdrianBliss', id: 'UCGv3KG_qIWQuIZn1GCATuOQ' },
      { handle: 'ZackDFilms', id: 'UCiMnriUF5hZg8llQWq6FzCg' },
      { handle: 'ILYABORZOV', id: 'UC_iQvdDV3r9lqJtvdAtHk6Q' },
      { handle: 'JoJosWorld', id: 'UCqjvlcXH4CbMgv9QqAUvxZw' },
      { handle: 'KellyClarksonShow', id: 'UCmFu4PNQdMc1qDqHtdBYB1Q' },
      { handle: 'iKnowAyrel', id: 'UCH0C-wHzZKvL9s7XTxpXD_Q' },
      { handle: 'MrBeast', id: 'UCX6OQ3DkcsbYNE6H8uQQuVA' },
      { handle: 'ZachKing', id: 'UCq8DICunczvLuJJq414110A' },
      { handle: 'JeenieWeenie', id: 'UClw0M9qyDxc_h_biGG7Ay5g' },
      { handle: 'StokesTwins', id: 'UC4NndlbP8qzF9tC9PgKcBcg' },
      { handle: 'AlanChikinChow', id: 'UC_9vN1gLWexhqaX9I5P_mwQ' },
      { handle: 'DanRhodes', id: 'UC1ySlYiQjYUmUlD52ZGUVgw' },
      { handle: 'FritzProctor', id: 'UCZCLrz01Hl4bV84SHjClK7w' },
      { handle: 'LoicSuberville', id: 'UCy1PpKdRu0UC7FCtTUkZxnA' },
      { handle: 'TheKoreanVegan', id: 'UCyn3RR2Zbzk1LK-F8HBtHjw' },
      { handle: 'TopperGuild', id: 'UC5T3PbKmz1zw_4zGYf4lFJw' },
      { handle: 'NathanKessel', id: 'UCs7fWU7dWqvdLzTcnfXs-gw' },
      { handle: 'AzzyLand', id: 'UCzeB_0FNcPIyUSjL_TL5lEw' },
      { handle: 'HacksmithIndustries', id: 'UCjgpFI5dU-D5_ftJD9SYRJQ' },
      { handle: 'SISvsBRO', id: 'UCFAtXHD2_qs-sTDOAUE-yIw' },
      { handle: 'CoreyTonge', id: 'UC3E5-_fjN7Je_l1DfV0xmWg' },
      { handle: 'CrashAdams', id: 'UCEJHdGMlGIaDfCfw-xYqPIA' },
      { handle: 'AndreasEskander', id: 'UC9MPfqmxj-52qihjIYSPYkw' },
      { handle: 'AnnaMcNulty', id: 'UCeSKaUd5E_KXEgEcxGLxsAA' },
      { handle: 'MadFit', id: 'UCpQ34afVgk8cRQBjSJ1xuJQ' },
      { handle: 'NutshellAnimations', id: 'UCsaEBhRsI6tmmz12fkSEYdw' },
      { handle: 'SAS-ASMR', id: 'UCp4LfMtDfoa29kTlLnqEg5g' },
      { handle: 'ManchurekTriplets', id: 'UCJwn1w8QRZ3-VbJU3Dna-iA' },
      { handle: 'AaronEsser', id: 'UCabr1XnvE_tQcQHTbezG4QQ' },
      { handle: 'TwiShorts', id: 'UCTLcNP0soBZz_sFb8X-elrQ' },
      { handle: 'LaylaRoblox', id: 'UCrNg4XtbG4F89aQPsmnzXHQ' },
      { handle: 'NickEh30', id: 'UCt9nYeSz90lnOnaVFjxFJsw' },
      { handle: 'NileRed', id: 'UCFhXFikryT4aFcLkLw2LBLA' },
      { handle: 'ElectroBOOM', id: 'UCJ0-OtVpF0wOKEqT2Z1HEtA' },
      { handle: 'Gloom', id: 'UCQ9npS-QvXoNh_UNtKsLCdA' },
      { handle: 'MostAmazingTop10', id: 'UCBINYCmwE29fBXCpUI8DgTA' },
      { handle: 'PapaJake', id: 'UC16ridNZ56R5WUQ9MEYv5jQ' }
    ];
  }

  async getViralShorts() {
    try {
      console.log('Starting getViralShorts');
      
      // Check if cache is valid
      if (this.isValidCache()) {
        console.log('Using cached videos');
        return this.getUniqueVideosFromCache();
      }

      console.log('Cache invalid, fetching new videos');
      const allVideos = await this.fetchFromChannels();
      
      this.cache = {
        videos: allVideos,
        lastFetched: Date.now(),
        shownVideos: new Set() // Reset shown videos when refreshing cache
      };

      return this.getUniqueVideosFromCache();
    } catch (error) {
      console.error('Error in getViralShorts:', error);
      return this.cache.videos.length ? this.getUniqueVideosFromCache() : [];
    }
  }

  async fetchFromChannels() {
    const allVideos = [];
    const videosPerChannel = 5; // Get 5 videos per channel to ensure variety

    for (const channel of this.channels) {
      try {
        console.log(`Fetching videos for channel: ${channel.handle}`);
        
        // Get shorts from this channel
        const searchResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&channelId=${channel.id}` +
          `&maxResults=${videosPerChannel}` +
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
            id: item.id.videoId, // Store ID separately for tracking
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
      (Date.now() - this.cache.lastFetched) < this.cacheExpiry &&
      // Make sure we still have unwatched videos
      this.cache.videos.length > this.cache.shownVideos.size
    );
    
    console.log('Cache validity check:', {
      hasLastFetched: !!this.cache.lastFetched,
      videosCount: this.cache.videos.length,
      shownVideosCount: this.cache.shownVideos ? this.cache.shownVideos.size : 0,
      timeSinceLastFetch: this.cache.lastFetched ? (Date.now() - this.cache.lastFetched) : null,
      isValid
    });
    
    return isValid;
  }

  getUniqueVideosFromCache(count = 10) {
    // Filter out already shown videos
    const availableVideos = this.cache.videos.filter(video => 
      !this.cache.shownVideos.has(video.id)
    );
    
    console.log(`Getting ${count} videos from ${availableVideos.length} unwatched videos`);
    
    // If we're running low on videos, refresh the list
    if (availableVideos.length < count) {
      console.log('Running low on unwatched videos, clearing shown videos list');
      this.cache.shownVideos.clear();
      return this.getUniqueVideosFromCache(count);
    }
    
    const results = [];
    const tempAvailable = [...availableVideos];
    
    // Get random videos from unwatched set
    while (results.length < count && tempAvailable.length > 0) {
      const randomIndex = Math.floor(Math.random() * tempAvailable.length);
      const video = tempAvailable.splice(randomIndex, 1)[0];
      
      // Add to shown videos set
      this.cache.shownVideos.add(video.id);
      results.push(video);
    }
    
    console.log('Selected videos:', results.map(v => ({
      channel: v.channelHandle,
      title: v.title.substring(0, 30) + '...'
    })));
    
    return results;
  }

  clearCache() {
    console.log('Clearing cache');
    this.cache = {
      videos: [],
      lastFetched: null,
      shownVideos: new Set()
    };
    console.log('Cache cleared');
    return true;
  }
}

export default new YouTubeService();
