// utils/GoogleAnalyticsService.js
class GoogleAnalyticsService {
  constructor() {
    this.initialized = false;
    this.measurementId = "G-" + "YPXNLCRM9H"; // Your GA4 measurement ID
    this.sessionStart = null;
    this.isActive = false;
    this.lastActiveTime = null;
    this.activityInterval = null;
    this.pageViewSent = false;
  }

  /**
   * Initialize Google Analytics
   */
  initialize() {
    if (this.initialized) {
      console.log('Google Analytics already initialized');
      return;
    }

    try {
      // Add Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        send_page_view: false // We'll trigger page views manually
      });

      // Mark as initialized
      this.initialized = true;
      
      // Set up session tracking
      this.startSession();
      
      // Set up activity tracking
      this.setupActivityTracking();
      
      console.log('Google Analytics initialized with measurement ID:', this.measurementId);
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }

  /**
   * Send event to Google Analytics
   */
  sendEvent(eventName, parameters = {}) {
    if (!this.initialized) {
      console.warn('Google Analytics not initialized, event not sent:', eventName);
      return;
    }

    try {
      // Ensure session is active
      this.updateActivity();
      
      // Send event to GA4
      window.gtag('event', eventName, parameters);
      console.log('GA event sent:', eventName, parameters);
    } catch (error) {
      console.error('Error sending GA event:', error);
    }
  }

  /**
   * Send page view to Google Analytics
   */
  sendPageView(pagePath, pageTitle) {
    if (!this.initialized) {
      console.warn('Google Analytics not initialized, page view not sent:', pagePath);
      return;
    }

    try {
      // Update activity and session
      this.updateActivity();
      
      // Send page view to GA4
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
      
      this.pageViewSent = true;
      console.log('GA page view sent:', pagePath);
    } catch (error) {
      console.error('Error sending GA page view:', error);
    }
  }

  /**
   * Start a new session
   */
  startSession() {
    this.sessionStart = new Date();
    this.lastActiveTime = new Date();
    this.isActive = true;
    
    // Send session start event
    this.sendEvent('session_start', {
      session_id: this.generateSessionId()
    });
    
    // Store session ID in localStorage for persistence
    localStorage.setItem('brain_bites_session_id', this.generateSessionId());
    localStorage.setItem('brain_bites_session_start', this.sessionStart.toISOString());
    
    // Send initial page view
    if (!this.pageViewSent) {
      this.sendPageView(window.location.pathname);
    }
  }

  /**
   * End the current session
   */
  endSession() {
    if (!this.sessionStart) return;
    
    const sessionDuration = Math.round((new Date() - this.sessionStart) / 1000);
    
    // Send session end event
    this.sendEvent('session_end', {
      session_id: this.getSessionId(),
      session_duration: sessionDuration
    });
    
    this.isActive = false;
    console.log(`Session ended (duration: ${sessionDuration}s)`);
    
    // Clear session storage
    localStorage.removeItem('brain_bites_session_id');
    localStorage.removeItem('brain_bites_session_start');
  }

  /**
   * Generate a unique session ID
   */
  generateSessionId() {
    return 'ss_' + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) + 
           '_' + new Date().getTime();
  }

  /**
   * Get current session ID
   */
  getSessionId() {
    return localStorage.getItem('brain_bites_session_id') || this.generateSessionId();
  }

  /**
   * Setup activity tracking for session management
   */
  setupActivityTracking() {
    // Track user activity events
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach(eventType => {
      window.addEventListener(eventType, () => this.updateActivity());
    });
    
    // Check for inactivity every minute
    this.activityInterval = setInterval(() => {
      const now = new Date();
      const inactiveTime = (now - this.lastActiveTime) / 1000;
      
      // If inactive for more than 30 minutes, end session
      if (inactiveTime > 1800) {
        if (this.isActive) {
          this.endSession();
        }
      }
    }, 60000);
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.handlePageHide();
      } else {
        this.handlePageShow();
      }
    });
    
    // Handle page close/navigate away
    window.addEventListener('beforeunload', () => {
      this.handlePageHide();
    });
  }

  /**
   * Update the last active time
   */
  updateActivity() {
    this.lastActiveTime = new Date();
    
    // If session was inactive, restart it
    if (!this.isActive) {
      this.startSession();
    }
  }

  /**
   * Handle page becoming hidden
   */
  handlePageHide() {
    // Record session duration up to this point
    if (this.sessionStart && this.isActive) {
      const sessionDuration = Math.round((new Date() - this.sessionStart) / 1000);
      
      // Send event for partial session duration
      this.sendEvent('app_background', {
        session_id: this.getSessionId(),
        duration: sessionDuration
      });
    }
  }

  /**
   * Handle page becoming visible again
   */
  handlePageShow() {
    // Update activity to keep session alive
    this.updateActivity();
    
    // Send event for returning to app
    this.sendEvent('app_foreground', {
      session_id: this.getSessionId()
    });
  }

  // Custom tracking methods for Brain Bites

  /**
   * Track question answered
   */
  trackQuestionAnswered(category, isCorrect, timeToAnswer = null) {
    this.sendEvent('question_answered', {
      category: category,
      is_correct: isCorrect,
      time_to_answer: timeToAnswer
    });
  }

  /**
   * Track when a video is watched
   */
  trackVideoWatched(videoId, duration, source = 'youtube') {
    this.sendEvent('video_watched', {
      video_id: videoId,
      duration: duration,
      source: source
    });
  }

  /**
   * Track streak milestone
   */
  trackStreakMilestone(streakCount) {
    this.sendEvent('streak_milestone', {
      streak_count: streakCount
    });
  }

  /**
   * Track score update
   */
  trackScoreUpdate(newScore, pointsEarned) {
    this.sendEvent('score_update', {
      score: newScore,
      points_earned: pointsEarned
    });
  }

  /**
   * Track tutorial completion
   */
  trackTutorialCompleted() {
    this.sendEvent('tutorial_completed');
  }

  /**
   * Track section selection
   */
  trackSectionSelected(section) {
    this.sendEvent('section_selected', {
      section: section
    });
  }

  /**
   * Track app start
   */
  trackAppStart() {
    this.sendEvent('app_start');
  }
  
  /**
   * Track reward earned
   */
  trackRewardEarned(rewardType = 'video', count = 1, source = 'correct_answer') {
    this.sendEvent('reward_earned', {
      reward_type: rewardType,
      count: count,
      source: source
    });
  }
}

export default new GoogleAnalyticsService();
