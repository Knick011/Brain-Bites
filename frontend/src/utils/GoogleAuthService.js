// utils/GoogleAuthService.js
class GoogleAuthService {
  constructor() {
    this.googleAuth = null;
    this.isInitialized = false;
    this.clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  }

  async initialize() {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          window.google.accounts.oauth2.initTokenClient({
            client_id: this.clientId,
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
            callback: (response) => {
              if (response.access_token) {
                this.accessToken = response.access_token;
                this.isInitialized = true;
                resolve();
              }
            },
          });
          this.isInitialized = true;
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = (error) => reject(error);
      document.body.appendChild(script);
    });
  }

  async signIn() {
    if (!this.isInitialized) await this.initialize();
    return new Promise((resolve) => {
      window.google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
        callback: (response) => {
          this.accessToken = response.access_token;
          resolve(response);
        },
      }).requestAccessToken();
    });
  }

  async signOut() {
    this.accessToken = null;
    window.google?.accounts?.oauth2?.revoke(this.accessToken);
  }

  isSignedIn() {
    return !!this.accessToken;
  }

  async getPersonalizedShorts(maxResults = 50) {
    if (!this.accessToken) return [];

    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=20`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          }
        }
      );

      const data = await response.json();
      const channelIds = data.items.map(item => item.snippet.resourceId.channelId);

      const shortsPromises = channelIds.map(channelId =>
        fetch(
          `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${Math.floor(maxResults / channelIds.length)}&q=%23shorts&type=video&videoDuration=short&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        ).then(r => r.json())
      );

      const shortsResponses = await Promise.all(shortsPromises);
      
      return shortsResponses
        .flatMap(response => response.items || [])
        .map(item => ({
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          isPersonalized: true
        }));
    } catch (error) {
      console.error('Error fetching personalized shorts:', error);
      return [];
    }
  }
}

export default new GoogleAuthService();
