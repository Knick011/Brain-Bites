// YouTubeLogin.js
import React, { useState, useEffect } from 'react';
import GoogleAuthService from '../utils/GoogleAuthService';
import { Youtube, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

      <AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="text-orange-500" />
              Important Privacy Notice
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base space-y-2">
              <p>🔒 <strong>Your Privacy Matters:</strong></p>
              <p>
                Brain Bites uses Google's official login system only to show you personalized YouTube Shorts. 
                We never see your password or store any of your personal data.
              </p>
              <p>
                You'll be logging in directly through Google, and you can remove access 
                at any time through your Google Account settings.
              </p>
              <Alert className="mt-4 border-orange-200 bg-orange-50">
                <AlertTitle className="text-orange-800">Beta Version Notice</AlertTitle>
                <AlertDescription className="text-orange-700">
                  This is a beta feature. While we prioritize your privacy and security, 
                  you may want to use a non-primary Google account if you have any concerns.
                </AlertDescription>
              </Alert>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDisclaimerConfirm}>
              Continue with Google
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default YouTubeLogin;
