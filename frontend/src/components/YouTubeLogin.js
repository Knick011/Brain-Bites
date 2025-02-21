// YouTubeLogin.js
import React, { useState, useEffect } from 'react';
import GoogleAuthService from '../utils/GoogleAuthService';
import { Youtube } from 'lucide-react';
import AlertDialog from './AlertDialog';

const YouTubeLogin = ({ onLoginStatusChange, onPersonalizedVideos }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await GoogleAuthService.initialize();
        const signedIn = GoogleAuthService.isSignedIn();
        setIsSignedIn(signedIn);
        if (signedIn) {
          fetchPersonalizedVideos();
        }
        setLoading(false);
      } catch (error) {
        console.error('Error initializing Google Auth:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchPersonalizedVideos = async () => {
    const videos = await GoogleAuthService.getPersonalizedShorts();
    onPersonalizedVideos?.(videos);
  };

  const handleSignIn = () => {
    setShowDisclaimer(true);
  };

  const handleDisclaimerConfirm = async () => {
    try {
      await GoogleAuthService.signIn();
      setIsSignedIn(true);
      onLoginStatusChange?.(true);
      await fetchPersonalizedVideos();
    } catch (error) {
      console.error('Error signing in:', error);
    }
    setShowDisclaimer(false);
  };

  const handleSignOut = async () => {
    try {
      await GoogleAuthService.signOut();
      setIsSignedIn(false);
      onLoginStatusChange?.(false);
      onPersonalizedVideos?.([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return null;
  }

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

      <AlertDialog
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onConfirm={handleDisclaimerConfirm}
        title="Important Privacy Notice"
        description={
          <div className="space-y-4">
            <p className="font-bold">🔒 Your Privacy Matters:</p>
            <p>
              Brain Bites uses Google's official login system only to show you personalized YouTube Shorts. 
              We never see your password or store any of your personal data.
            </p>
            <p>
              You'll be logging in directly through Google, and you can remove access 
              at any time through your Google Account settings.
            </p>
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="font-bold text-orange-800">Beta Version Notice</p>
              <p className="text-orange-700">
                This is a beta feature. While we prioritize your privacy and security, 
                you may want to use a non-primary Google account if you have any concerns.
              </p>
            </div>
          </div>
        }
      />
    </>
  );
};

export default YouTubeLogin;
