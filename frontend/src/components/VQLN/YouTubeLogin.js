// components/VQLN/YouTubeLogin.js
import React, { useState, useEffect } from 'react';
import { Youtube, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from './Alert';

const YouTubeLogin = ({ onLoginStatusChange }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          window.google.accounts.oauth2.initTokenClient({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/youtube.readonly',
            callback: handleAuthResponse,
          });
          setLoading(false);
        };

        document.body.appendChild(script);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleAuthResponse = async (response) => {
    if (response.access_token) {
      setAccessToken(response.access_token);
      setIsSignedIn(true);
      const videos = await fetchPersonalizedShorts(response.access_token);
      onLoginStatusChange(true, videos);
    }
  };

  const fetchPersonalizedShorts = async (token) => {
    try {
      // First get subscribed channels
      const subResponse = await fetch(
        'https://youtube.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=20',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!subResponse.ok) throw new Error('Failed to fetch subscriptions');
      const subData = await subResponse.json();
      
      // Get videos from each channel
      const channelIds = subData.items.map(item => item.snippet.resourceId.channelId);
      const videoPromises = channelIds.map(channelId =>
        fetch(
          `https://youtube.googleapis.com/youtube/v3/search?` +
          `part=snippet` +
          `&channelId=${channelId}` +
          `&maxResults=5` +
          `&q=%23shorts` +
          `&type=video` +
          `&videoDuration=short` +
          `&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        ).then(r => r.json())
      );

      const videoResponses = await Promise.all(videoPromises);
      const videos = videoResponses
        .flatMap(response => response.items || [])
        .map(item => ({
          url: `https://www.youtube.com/shorts/${item.id.videoId}`,
          title: item.snippet.title
        }));

      return videos;
    } catch (error) {
      console.error('Error fetching personalized shorts:', error);
      return [];
    }
  };

  const handleSignIn = () => {
    setShowDisclaimer(true);
  };

  const handleDisclaimerConfirm = () => {
    window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
      callback: handleAuthResponse,
    }).requestAccessToken();
    setShowDisclaimer(false);
  };

  const handleSignOut = async () => {
    if (accessToken) {
      window.google?.accounts?.oauth2?.revoke(accessToken);
    }
    setAccessToken(null);
    setIsSignedIn(false);
    onLoginStatusChange(false, []);
  };

  if (loading) return null;

  return (
    <>
      <div className="absolute top-4 right-4 z-50">
        {isSignedIn ? (
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 transition-colors"
          >
            <Youtube size={20} />
            Sign Out
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-white text-red-500 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-md"
          >
            <Youtube size={20} />
            Sign in with YouTube
          </button>
        )}
      </div>

      <Dialog open={showDisclaimer} onClose={() => setShowDisclaimer(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <AlertCircle className="text-orange-500" />
              Important Privacy Notice
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-4">
                <p className="font-semibold">🔒 Your Privacy Matters:</p>
                <p>
                  Brain Bites uses Google's official login system only to show you personalized YouTube Shorts. 
                  We never see your password or store any of your personal data.
                </p>
                <p>
                  You'll be logging in directly through Google, and you can remove access 
                  at any time through your Google Account settings.
                </p>
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="font-semibold text-orange-800">Beta Version Notice</p>
                  <p className="text-orange-700">
                    This is a beta feature. While we prioritize your privacy and security, 
                    you may want to use a non-primary Google account if you have any concerns.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowDisclaimer(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDisclaimerConfirm}>
              Continue with Google
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YouTubeLogin;
