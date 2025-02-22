import axios from 'axios';

class YouTubeService {
  constructor() {
    this.apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    this.regions = ['US', 'CA'];
    this.minViews = 100000;
    this.pageSize = 50;
  }

  async getTrendingShorts() {
    try {
      let allShorts = [];
      
      // Fetch from each region
      for (const region of this.regions) {
        // First get trending videos
        const response = await axios.get(
          `https://youtube.googleapis.com/youtube/v3/videos?` +
          `part=snippet,statistics,contentDetails` +
          `&chart=mostPopular` +
          `&maxResults=${this.pageSize}` +
          `&regionCode=${region}` +
          `&key=${this.apiKey}`
        );

        const shorts = response.data.items
          .filter(video => {
            // Filter for Shorts
            const isShortForm = video.snippet.title.includes('#shorts') || 
                               video.snippet.description.includes('#shorts');
            const hasGoodEngagement = parseInt(video.statistics.viewCount) > this.minViews;
            const isReasonableLength = video.contentDetails.duration.match(/PT[0-6][0-9]S/);
            
            return isShortForm && hasGoodEngagement && isReasonableLength;
          })
          .map(video => ({
            id: video.id,
            url: `https://www.youtube.com/shorts/${video.id}`,
            title: video.snippet.title,
            channelTitle: video.snippet.channelTitle,
            views: parseInt(video.statistics.viewCount),
            likes: video.statistics.likeCount ? parseInt(video.statistics.likeCount) : 0,
            region: region
          }));

        allShorts = [...allShorts, ...shorts];
      }

      // Sort by views and take top results
      return allShorts
        .sort((a, b) => b.views - a.views)
        .slice(0, this.pageSize);

    } catch (error) {
      console.error('Error fetching trending shorts:', error);
      return [];
    }
  }

  async getPersonalizedShorts(accessToken) {
    try {
      // Get subscribed channels
      const subResponse = await axios.get(
        'https://youtube.googleapis.com/youtube/v3/subscriptions', {
          params: {
            part: 'snippet',
            mine: true,
            maxResults: 20
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const channelIds = subResponse.data.items.map(
        item => item.snippet.resourceId.channelId
      );

      // Get shorts from each channel
      let personalizedShorts = [];
      for (const channelId of channelIds) {
        try {
          const channelResponse = await axios.get(
            `https://youtube.googleapis.com/youtube/v3/search`, {
              params: {
                part: 'snippet',
                channelId: channelId,
                maxResults: 10,
                order: 'date',
                type: 'video',
                key: this.apiKey
              }
            }
          );

          // Get full video details to check stats and duration
          const videoIds = channelResponse.data.items
            .map(item => item.id.videoId)
            .join(',');

          if (videoIds) {
            const videoResponse = await axios.get(
              `https://youtube.googleapis.com/youtube/v3/videos`, {
                params: {
                  part: 'snippet,statistics,contentDetails',
                  id: videoIds,
                  key: this.apiKey
                }
              }
            );

            const shorts = videoResponse.data.items
              .filter(video => {
                const isShortForm = video.snippet.title.includes('#shorts') || 
                                  video.snippet.description.includes('#shorts');
                const hasGoodEngagement = parseInt(video.statistics.viewCount) > this.minViews;
                const isReasonableLength = video.contentDetails.duration.match(/PT[0-6][0-9]S/);
                
                return isShortForm && hasGoodEngagement && isReasonableLength;
              })
              .map(video => ({
                id: video.id,
                url: `https://www.youtube.com/shorts/${video.id}`,
                title: video.snippet.title,
                channelTitle: video.snippet.channelTitle,
                views: parseInt(video.statistics.viewCount),
                likes: video.statistics.likeCount ? parseInt(video.statistics.likeCount) : 0
              }));

            personalizedShorts = [...personalizedShorts, ...shorts];
          }
        } catch (error) {
          console.error(`Error fetching shorts for channel ${channelId}:`, error);
          continue; // Skip to next channel if one fails
        }
      }

      // Mix with some trending content
      const trendingShorts = await this.getTrendingShorts();
      const allShorts = [...personalizedShorts, ...trendingShorts.slice(0, 10)];
      
      // Shuffle array
      return allShorts
        .sort(() => Math.random() - 0.5)
        .slice(0, this.pageSize);

    } catch (error) {
      console.error('Error fetching personalized shorts:', error);
      return this.getTrendingShorts(); // Fallback to trending
    }
  }
}

export default new YouTubeService();
