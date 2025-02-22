// utils/GoogleAuthService.js
class GoogleAuthService {
  constructor() {
    this.googleAuth = null;
    this.isInitialized = false;
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.scope = 'https://www.googleapis.com/auth/youtube.readonly';
  }

  async initialize() {
    if (this.isInitialized) return;

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      
      script.onload = () => {
        window.gapi.load('client:auth2', async () => {
          await window.gapi.client.init({
            clientId: this.clientId,
            scope: this.scope,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
          });
          
          this.googleAuth = window.gapi.auth2.getAuthInstance();
          this.isInitialized = true;
          resolve();
        });
      };
      
      document.body.appendChild(script);
    });
  }

  async signIn() {
    if (!this.isInitialized) await this.initialize();
    return this.googleAuth.signIn();
  }

  async signOut() {
    if (!this.isInitialized) return;
    return this.googleAuth.signOut();
  }

  isSignedIn() {
    return this.googleAuth?.isSignedIn.get() || false;
  }

  async getPersonalizedShorts(maxResults = 50) {
    if (!this.isSignedIn()) return [];

    try {
      // Get user's subscribed channels
      const subResponse = await window.gapi.client.youtube.subscriptions.list({
        part: 'snippet',
        mine: true,
        maxResults: 20
      });

      const channelIds = subResponse.result.items.map(item => 
        item.snippet.resourceId.channelId
      );

      // Get shorts from each channel
      const shortsPromises = channelIds.map(channelId =>
        window.gapi.client.youtube.search.list({
          part: 'snippet',
          channelId: channelId,
          maxResults: Math.floor(maxResults / channelIds.length),
          q: '#shorts',
          type: 'video',
          videoDuration: 'short',
          order: 'date'
        })
      );

      const shortsResponses = await Promise.all(shortsPromises);
      
      const shorts = shortsResponses
        .flatMap(response => response.result.items || [])
        .map(item => ({
          videoId: item.id.videoId,
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          isPersonalized: true
        }));

      // Get detailed stats
      return this.getVideoDetails(shorts);
    } catch (error) {
      console.error('Error fetching personalized shorts:', error);
      return [];
    }
  }

  async getVideoDetails(videos) {
    if (!videos.length) return [];

    try {
      const videoIds = videos.map(v => v.videoId).join(',');
      
      const response = await window.gapi.client.youtube.videos.list({
        part: 'statistics,contentDetails',
        id: videoIds
      });

      return videos.map(video => {
        const details = response.result.items?.find(item => item.id === video.videoId);
        return {
          ...video,
          viewCount: details?.statistics?.viewCount || '0',
          likeCount: details?.statistics?.likeCount || '0'
        };
      });
    } catch (error) {
      console.error('Error fetching video details:', error);
      return videos;
    }
  }
}

export default new GoogleAuthService();