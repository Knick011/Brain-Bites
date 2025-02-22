// utils/YouTubeService.js
class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.VIEW_THRESHOLD = 500000;
    this.LIKE_THRESHOLD = 10000;
  }

  async getViralShorts() {
    try {
      // Search specifically for Shorts using hashtag and YouTube Shorts URL pattern
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?` +
        `part=snippet` +
        `&maxResults=50` +
        `&q="%23shorts"` + // Search explicitly for #shorts
        `&type=video` +
        `&order=viewCount` +
        `&relevanceLanguage=en` +
        `&key=${this.apiKey}`
      );

      if (!response.ok) throw new Error('YouTube API request failed');
      
      const searchData = await response.json();
      const videoIds = searchData.items
        .filter(item => item.id && item.id.videoId)
        .map(item => item.id.videoId);

      if (videoIds.length > 0) {
        const statsResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/videos?` +
          `part=statistics,snippet,contentDetails` +
          `&id=${videoIds.join(',')}` +
          `&key=${this.apiKey}`
        );

        if (!statsResponse.ok) throw new Error('Failed to fetch video stats');

        const statsData = await statsResponse.json();
        const validVideos = statsData.items
          .filter(video => {
            const viewCount = parseInt(video.statistics.viewCount) || 0;
            const likeCount = parseInt(video.statistics.likeCount) || 0;
            const isEnglish = video.snippet.defaultLanguage === 'en' ||
                            video.snippet.defaultAudioLanguage === 'en';
            
            // Check if it's actually a Short by verifying multiple criteria
            const isShort = 
              // Must have #shorts in title or description
              (video.snippet.description.toLowerCase().includes('#shorts') ||
               video.snippet.title.toLowerCase().includes('#shorts')) &&
              // Typical YouTube Shorts duration is around 60 seconds
              video.contentDetails.duration.match(/PT[0-6][0-9]S/);
            
            return viewCount >= this.VIEW_THRESHOLD &&
                   likeCount >= this.LIKE_THRESHOLD &&
                   isShort &&
                   isEnglish;
          })
          .map(video => ({
            url: `https://www.youtube.com/shorts/${video.id}`,
            title: video.snippet.title,
            channelTitle: video.snippet.channelTitle,
            viewCount: parseInt(video.statistics.viewCount),
            likeCount: parseInt(video.statistics.likeCount)
          }));

        return this.shuffleArray(validVideos);
      }
      return [];
    } catch (error) {
      console.error('Error fetching viral shorts:', error);
      return [];
    }
  }

  async getPersonalizedShorts(accessToken) {
    try {
      const subResponse = await fetch(
        'https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=20',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!subResponse.ok) throw new Error('Failed to fetch subscriptions');
      const subData = await subResponse.json();
      
      const channelIds = subData.items.map(item => item.snippet.resourceId.channelId);
      const personalizedVideos = [];

      for (const channelId of channelIds) {
        const searchResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&channelId=${channelId}` +
          `&maxResults=5` +
          `&q="%23shorts"` +
          `&type=video` +
          `&relevanceLanguage=en` +
          `&key=${this.apiKey}`
        );

        if (!searchResponse.ok) continue;

        const searchData = await searchResponse.json();
        const videoIds = searchData.items
          .filter(item => item.id && item.id.videoId)
          .map(item => item.id.videoId);

        if (videoIds.length > 0) {
          const statsResponse = await fetch(
            `https://youtube.googleapis.com/youtube/v3/videos?` +
            `part=statistics,snippet,contentDetails` +
            `&id=${videoIds.join(',')}` +
            `&key=${this.apiKey}`
          );

          if (!statsResponse.ok) continue;

          const statsData = await statsResponse.json();
          const validVideos = statsData.items
            .filter(video => {
              const viewCount = parseInt(video.statistics.viewCount) || 0;
              const likeCount = parseInt(video.statistics.likeCount) || 0;
              const isEnglish = video.snippet.defaultLanguage === 'en' ||
                              video.snippet.defaultAudioLanguage === 'en';
              
              // Verify it's a Short using the same criteria
              const isShort = 
                (video.snippet.description.toLowerCase().includes('#shorts') ||
                 video.snippet.title.toLowerCase().includes('#shorts')) &&
                video.contentDetails.duration.match(/PT[0-6][0-9]S/);
              
              return viewCount >= this.VIEW_THRESHOLD &&
                     likeCount >= this.LIKE_THRESHOLD &&
                     isShort &&
                     isEnglish;
            })
            .map(video => ({
              url: `https://www.youtube.com/shorts/${video.id}`,
              title: video.snippet.title,
              channelTitle: video.snippet.channelTitle,
              viewCount: parseInt(video.statistics.viewCount),
              likeCount: parseInt(video.statistics.likeCount)
            }));

          personalizedVideos.push(...validVideos);
        }
      }

      const viralVideos = await this.getViralShorts();
      const allVideos = [...personalizedVideos, ...viralVideos.slice(0, 10)];

      return this.shuffleArray(allVideos);
    } catch (error) {
      console.error('Error fetching personalized shorts:', error);
      return this.getViralShorts();
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

export default new YouTubeService();
