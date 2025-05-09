# Brain Bites

Brain Bites is an interactive educational platform that combines learning with entertainment. Answer quiz questions correctly to earn video rewards, creating an engaging learn-and-reward cycle that keeps users motivated.

## Overview

Brain Bites delivers short-form educational content through an addictive, TikTok-style interface. Users answer trivia questions from different categories and are rewarded with entertaining short videos. The app features streak mechanics, time-based scoring, and a polished UI with smooth transitions.

![Brain Bites Screenshot](https://example.com/brainbites-screenshot.png)

## Key Features

- **Quiz-based Learning**: Answer questions across multiple knowledge categories
- **Video Rewards**: Earn short, entertaining videos for correct answers
- **Streak System**: Build consecutive correct answers for bonus rewards
- **Time Mode**: Answer quickly for higher points
- **Personalized Experience**: Track progress and stats across sessions
- **TikTok-style Interface**: Modern, swipe-based navigation for an engaging experience
- **Tutorial Mode**: Guided introduction for new users
- **YouTube Integration**: Support for personalized content recommendations (beta)
- **Responsive Design**: Works on mobile and desktop devices

## Architecture

Brain Bites follows a client-server architecture:

### Backend
- **Express.js Server**: Delivers question data through a REST API
- **Question Database**: Structured collection of questions with categories, options, and explanations

### Frontend
- **React**: Component-based UI framework
- **TailwindCSS**: Utility-first CSS framework for styling
- **Local Storage**: Persists user progress and settings

## Game Mechanics

### Question Flow
1. Users select a category (Psychology or Fun Facts)
2. Questions are presented with multiple-choice options
3. Answering correctly:
   - Increases streak count
   - Awards points (more in Time Mode for fast answers)
   - Contributes toward video rewards
4. Answering incorrectly resets streak
5. Detailed explanations are provided for each answer

### Reward System
- **Regular Rewards**: One video for every 2 correct answers
- **Streak Bonuses**: Additional video rewards at milestone streaks (5, 10, 15...)
- **Time Bonuses**: Faster answers in Time Mode earn up to 2x points

### Progress Tracking
- Total questions answered
- Correct answer percentage
- Highest streak achieved
- Total score
- Available video rewards

## Application Flow

### Tutorial Mode
1. User opens the app and sees the welcome screen (`InitialWelcome.js`)
2. User clicks "Get Started" to move to category selection (`MainSelection.js`)
3. User selects a category (Psychology or Fun Facts)
4. Tutorial popup appears with step-by-step guidance (`TutorialPopup.js`)
5. First question is presented with explanation of how to answer
6. User completes 5 tutorial questions to unlock Game Mode
7. Game Mode popup explains full features (`GameModePopup.js`)
8. Time Mode is activated with point scoring system

### Question-to-Video Flow
1. User answers a question correctly in `QuestionCard.js`
2. `SoundEffects.js` plays correct answer sound
3. Points animation shows score increase (`PointsAnimation.js`)
4. Available videos counter is incremented
5. User can access videos via the rewards button (`RewardsButton.js`)
6. When watching, `VideoCard.js` handles playback
7. User can swipe up to navigate between videos
8. After finishing videos, user returns to questions

### Special Events
1. **Streak Milestones**: When reaching a streak of 5, 10, or 15:
   - `MilestoneCelebration.js` shows congratulatory popup
   - Extra video reward is added
   - Confetti animation plays for visual feedback

2. **Time Mode Scoring**:
   - `QuestionTimer.js` counts down from 10 seconds
   - Faster answers earn more points (up to 2x multiplier)
   - Timer changes color as time decreases (green → yellow → red)
   - Points decrease linearly with time used

3. **Rewards Flow**:
   - User can access all earned videos in sequence
   - Progress indicator shows current position
   - Exit button triggers confirmation dialog (`RewardsConfirmation.js`)
   - After watching all videos, completion message appears

## User Interface

### Screens
1. **Welcome Screen**: Introduction with app info and start button
2. **Category Selection**: Choose between Psychology and Fun Facts
3. **Question Screen**: Displays question, options, timer (in Time Mode), and feedback
4. **Video Player**: TikTok-style full-screen video experience
5. **Rewards Hub**: Access and manage earned video rewards

### Navigation
- **Swipe Controls**: Swipe up to navigate between questions and videos
- **Keyboard Shortcuts**:
  - Down Arrow: Skip/Next
  - Space or Enter: Confirm
  - Escape: Exit/Return

### Visual Elements
- **Progress Indicators**: Show tutorial progress, streaks, and rewards
- **Points Animation**: Visual feedback for earned points
- **Streak Counter**: Dynamic counter with milestone highlights
- **Question Timer**: Countdown timer with color indicators

## Files and Directories Structure

### Root Directory
- `.gitignore`: Specifies files and directories to be ignored by Git (e.g., node_modules, build directories)
- `vercel.json`: Configuration for Vercel deployment, including headers for cache control and content types
- `ReadMe.txt`: Project documentation and overview (this file)

### .github Directory
- `workflows/fetch-videos.yml`: GitHub Action that runs every 12 hours to fetch fresh YouTube videos
- `scripts/fetch-videos.js`: Node.js script used by the GitHub Action to fetch and process YouTube videos

### Backend Directory
- `server.js`: Main Express server entry point, defines API routes and server configuration
- `data/questions.js`: Database of questions organized by categories (Psychology and Fun Facts)
- `package.json`: Backend dependencies and scripts configuration

### Frontend Directory

#### Public Folder
- `index.html`: Main HTML template for the React application
- `manifest.json`: Web app manifest for PWA functionality
- `youtube-videos.json`: Cached collection of YouTube videos fetched by the GitHub Action
- `sounds/`: Directory containing audio files for sound effects

#### Src Folder (Frontend Source Code)

##### Core Files
- `index.js`: React application entry point, renders the App component to the DOM
- `App.js`: Main application component with core state management and routing logic
- `index.css`: Base CSS using Tailwind directives and global styles
- `App.css`: App-specific styles

##### Components Directory
Organized by feature with the VQLN (Visual Question Learning Network) namespace:

###### Welcome Components
- `Welcome/InitialWelcome.js`: First screen users see when opening the app
- `Welcome/MainSelection.js`: Category selection screen with progress stats

###### Question Components
- `Question/QuestionCard.js`: Displays questions, options, and handles user answers
- `Question/QuestionTimer.js`: Countdown timer for Time Mode with point calculations
- `Question/StreakCounter.js`: Shows and animates the current streak count
- `Question/PointsAnimation.js`: Animated display of points earned from correct answers

###### Video Components
- `Video/VideoCard.js`: YouTube video player with swipe navigation and controls

###### UI Components
- `Alert.js`: Reusable dialog components for alerts and confirmations
- `ProgressBar.js`: Shows progress through tutorial or questions answered
- `ScoreDisplay.js`: Shows current score in Time Mode
- `SwipeNavigation.js`: Handles swipe gestures for TikTok-style navigation
- `Common/StandardPopup.js`: Reusable popup component used throughout the app

###### Feedback Components
- `MilestoneCelebration.js`: Celebration popup for streak milestones
- `TimeModeIntro.js`: Introduction to Time Mode after tutorial completion
- `RewardNotification.js`: Notification of earned video rewards
- `GameModePopup.js`: Shown when transitioning from tutorial to game mode
- `AllDoneMessage.js`: Displayed when all rewards have been watched
- `AnswerNotification.js`: Feedback on correct/incorrect answers
- `RewardsConfirmation.js`: Confirmation dialog for exiting rewards flow

###### Tutorial Components
- `Tutorial/TutorialPopup.js`: Step-by-step guided introduction for new users

##### Utils Directory (Service Classes)
- `ApiService.js`: Communication with the backend API for question fetching
- `YouTubeService.js`: YouTube video management with caching and non-repetition logic
- `SoundEffects.js`: Audio playback management with callback system
- `StorageService.js`: Local storage persistence for game state and statistics
- `GoogleAuthService.js`: Google/YouTube authentication for personalized content
- `ApiWarmupService.js`: Keeps the backend API warm with periodic requests

##### Styles Directory
- `theme.css`: Main theming with CSS variables and global design system
- `GameStyles.css`: Game-specific animations and interactive elements
- `popup-animations.css`: Animations specific to popup components and transitions

## Setup and Installation

### Prerequisites
- Node.js 14+ and npm
- Backend API server (included) or connection to remote API

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/your-org/brain-bites.git
   cd brain-bites
   ```

2. Install dependencies for both frontend and backend:
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Configure environment variables:
   - Create `.env` file in the frontend directory
   - Add YouTube API key (for video features):
     ```
     REACT_APP_YOUTUBE_API_KEY=your-youtube-api-key
     ```
   - (Optional) Add Google client ID for personalized content:
     ```
     REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
     ```

4. Start the backend server:
   ```
   cd backend
   node server.js
   ```

5. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

6. Access the application at `http://localhost:3000`

## Detailed File Functions

### Backend Files

1. `server.js`
   - Creates an Express server with CORS enabled
   - Defines API endpoints for fetching questions
   - Provides category-specific endpoints (`/api/questions/random/psychology` and `/api/questions/random/funfacts`)
   - Includes error handling and port configuration

2. `data/questions.js`
   - Contains the database of questions with IDs, categories, questions, multiple-choice options, correct answers, and explanations
   - Organized by categories: Psychology (IDs 151-300) and Fun Facts (IDs 1-150)

### Frontend Key Files

1. `App.js`
   - The heart of the application containing the main state management
   - Handles navigation between welcome, section selection, questions, and videos
   - Manages game mechanics like streaks, scores, and rewards
   - Coordinates API calls and service integrations

2. `components/VQLN/Video/VideoCard.js`
   - Handles video playback using ReactPlayer
   - Implements TikTok-style swipe navigation between videos
   - Manages video loading states, errors, and playback controls
   - Supports continuous rewards flow for multiple videos
   - Handles keyboard shortcuts for navigation

3. `components/VQLN/Question/QuestionCard.js`
   - Displays questions with multiple-choice options
   - Handles answer selection and validation
   - Shows feedback with correct/incorrect animations
   - Integrates with timer in Time Mode
   - Displays explanations after answering

4. `utils/ApiService.js`
   - Communicates with the backend API
   - Fetches random questions by category
   - Implements error handling and retry logic
   - Maintains a question cache to reduce API calls
   - Validates questions match requested categories

5. `utils/YouTubeService.js`
   - Fetches and manages YouTube Shorts videos
   - Implements caching to reduce API usage
   - Tracks viewed videos to prevent repetition
   - Handles error recovery and fallback videos
   - Refreshes content automatically

6. `utils/StorageService.js`
   - Persists game state to localStorage
   - Tracks user progress, scores, and achievements
   - Saves available video rewards between sessions
   - Manages tutorial completion status
   - Implements clean data structure with prefixed keys

7. `utils/SoundEffects.js`
   - Preloads and manages audio playback
   - Provides sound effects for correct/incorrect answers, transitions, and milestones
   - Implements callback system for coordinating effects with animations
   - Handles error recovery for audio playback issues

8. `styles/theme.css`
   - Defines the color scheme and design variables
   - Implements responsive layouts and animations
   - Sets up typography, spacing, and component styles
   - Creates consistent visual language across the app

## Deployment

### Backend Deployment
The backend can be deployed to services like Render, Heroku, or any Node.js hosting platform:

```
# Example for Render
render deploy
```

### Frontend Deployment
The frontend can be deployed to services like Vercel, Netlify, or GitHub Pages:

```
# Build production version
cd frontend
npm run build

# Deploy to Vercel
vercel
```

## YouTube Integration

Brain Bites uses YouTube Shorts as its video reward system. The application:

1. Fetches a curated list of YouTube Shorts videos
2. Caches them locally to reduce API calls
3. Tracks viewed videos to prevent repetition
4. Optionally connects to users' YouTube accounts for personalized recommendations

### How Video Fetching Works

1. **GitHub Actions Automation**
   - `.github/workflows/fetch-videos.yml` runs every 12 hours
   - It executes `.github/scripts/fetch-videos.js` to retrieve fresh content
   - Videos are fetched from a curated list of channel IDs defined in the script
   - The script uses the YouTube Data API v3 to search for short-form content

2. **Video Processing**
   - Each video is processed to extract ID, title, channel information, and URL
   - Results are combined with existing videos from previous fetches
   - Duplicates are filtered out to prevent repetition
   - The collection is saved to `frontend/public/youtube-videos.json`

3. **Local Caching System**
   - `utils/YouTubeService.js` loads videos from the JSON file
   - Videos are cached in memory for 30 minutes before refreshing
   - The service tracks which videos have been shown to avoid repetition
   - If all videos have been shown, it resets tracking but remembers recent videos

4. **Personalized Content (Beta)**
   - Users can connect their YouTube account via `components/VQLN/YouTubeLogin.js`
   - This uses `utils/GoogleAuthService.js` to authenticate with OAuth
   - The app fetches videos from channels the user subscribes to
   - These personal recommendations are mixed with the general video pool

5. **Fallback Mechanisms**
   - If API calls fail, the service falls back to cached videos
   - If no cached videos exist, emergency fallback videos are provided
   - The system includes retry logic with exponential backoff
   - Network errors are handled gracefully with user feedback

## Development Guidelines

### Code Structure
- Use functional components with React Hooks
- Keep state management centralized in top-level components
- Implement proper error handling for API calls
- Document complex functions and components

### Styling
- Use TailwindCSS utility classes for styling
- Add custom animations in dedicated CSS files
- Follow the established color scheme and theme variables

### Performance Considerations
- Optimize component re-renders with React.memo where appropriate
- Implement proper cleanup in useEffect hooks
- Use video preloading for smooth transitions

## Features Implementation Details

### Swipe Navigation System
The TikTok-style navigation is implemented through several components working together:

1. `SwipeNavigation.js`: Core component that detects swipe gestures
   - Listens for touchstart/touchmove/touchend events
   - Calculates swipe distance and direction
   - Implements velocity detection for natural feel
   - Provides visual feedback during swipes

2. `App.js`: Coordinates transitions between questions and videos
   - Manages which content is currently displayed
   - Controls transition animations and timing
   - Handles keyboard shortcuts for accessibility

3. CSS classes in `GameStyles.css`:
   - `.swipe-content`: Applied to swipeable containers
   - `.video-transition-active`: Added to body during transitions
   - Animation keyframes for entrance/exit effects

The swipe system supports both upward and downward gestures, with special handling for video player interactions to prevent accidental navigation.

### Streak and Rewards Logic

The streak and rewards systems are primarily managed in `App.js`:

1. **Streak Counting**:
   ```javascript
   const processCorrectAnswer = useCallback(() => {
     // Increment streak
     setStreak(prevStreak => prevStreak + 1);
     
     // Check for milestone
     if (newStreak % 5 === 0) {
       setShowMilestone(true);
       setAvailableVideos(prev => prev + 1);
     }
   }, []);
   ```

2. **Video Rewards**:
   ```javascript
   // Award video for every 2 correct answers
   if (!tutorialMode && newCorrect % 2 === 0) {
     setAvailableVideos(prev => prev + 1);
   }
   ```

3. **Time-based Scoring**:
   ```javascript
   // Apply time multiplier for faster answers
   const timeRatio = 1 - (answerTimeValue / 10);
   const timeMultiplier = 1 + timeRatio; // 1.0 to 2.0 multiplier
   const finalScore = Math.floor(timeScore * timeMultiplier);
   ```

### Storage Persistence

Game state persistence is handled by `StorageService.js`, which creates an abstraction layer over localStorage:

1. **Saving State**:
   ```javascript
   static saveGameState(state) {
     localStorage.setItem(`${this.KEY_PREFIX}gameState`, JSON.stringify(state));
   }
   ```

2. **Loading State**:
   ```javascript
   static loadGameState() {
     return JSON.parse(localStorage.getItem(`${this.KEY_PREFIX}gameState`));
   }
   ```

3. **Specialized Methods**:
   - `saveHighScore(score)`: Updates only if higher than current record
   - `getAvailableVideos()`: Retrieves current reward count
   - `isTutorialCompleted()`: Checks if tutorial has been completed

This system allows the app to remember user progress across sessions and restore state after browser refreshes.

## Troubleshooting

### Common Issues

**API Connection Errors**
- Check if the backend server is running
- Verify API endpoint URLs in `ApiService.js`

**Video Playback Issues**
- Ensure YouTube API key is valid
- Check browser console for CORS errors
- Try clearing the video cache using the reset button

**Performance Problems**
- Reduce animation effects on lower-end devices
- Check for memory leaks in component unmounting
- Optimize video quality based on network conditions

## Credits and Acknowledgements

- **Design Inspiration**: TikTok, Duolingo
- **Icons**: Lucide React Icons
- **Sound Effects**: Various sources, all royalty-free
- **Video Content**: YouTube Shorts API

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For feature requests, bug reports, or contributions, please open an issue on the GitHub repository.

Last Updated: March 24, 2025
