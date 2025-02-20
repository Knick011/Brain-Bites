# Brain Bites - Complete Documentation

## Backend Documentation

### Directory Structure
```
/backend
├── /data
│   └── questions.js    # Question database
├── node_modules/       # Dependencies
├── package.json        # Project configuration
├── package-lock.json   # Dependency lock file
└── server.js          # Express server
```

### Component Details

#### 1. server.js
```javascript
// Main server file handling:
- Express server setup
- CORS configuration
- API endpoints for questions
- Error handling
- Server port configuration
```

Key Features:
- Random question selection
- Category-based filtering (Psychology/Fun Facts)
- CORS enabled for frontend communication
- Error handling middleware
- Port configuration (default: 5000)

#### 2. questions.js
```javascript
// Question database structure:
{
  id: number,
  question: string,
  options: {
    A: string,
    B: string,
    C: string,
    D: string
  },
  correctAnswer: string,
  explanation: string,
  category: string
}
```

Categories:
- Psychology (IDs 1-30)
- Fun Facts (IDs 31-60)

## Frontend Documentation

### Directory Structure
```
/frontend
├── /public
│   ├── /sounds            # Sound effects
│   ├── index.html
│   └── manifest.json
└── /src
    ├── /components/VQLN   # Main components
    ├── /styles            # CSS files
    ├── /utils             # Utilities
    ├── App.js             # Main component
    └── index.js           # Entry point
```

### Core Components

#### 1. App.js (Main Application)
State Management:
```javascript
- showWelcome: boolean    // Welcome screen display
- showQuestion: boolean   // Question/video toggle
- currentQuestion: object // Current question data
- videoCount: number     // Video counter
- isLoading: boolean     // Loading state
- correctAnswers: number // Correct answer counter
- totalQuestions: number // Total questions attempted
- streak: number        // Current streak
- selectedSection: string // Current section
```

Key Functions:
- handleStart(): Initiates app
- handleMainSelection(): Handles section selection
- setRandomVideo(): Selects random video
- fetchQuestion(): Fetches random question
- handleAnswerSubmit(): Processes answer submission

#### 2. VideoCard.js (Video Player)
Props:
```javascript
{
  url: string,          // YouTube Short URL
  onEnd: function,      // Video end handler
  onSkip: function,     // Skip handler
  onReady: function     // Ready state handler
}
```

Features:
- Full-screen video display
- Skip functionality (down arrow)
- Auto-play support
- Loading state handling

#### 3. QuestionCard.js (Question Display)
Props:
```javascript
{
  question: object,     // Question data
  onAnswerSubmit: function // Answer handler
}
```

State Management:
- selectedAnswer: Selected option
- showExplanation: Explanation visibility
- showResult: Result display delay
- canProceed: Proceed state

Features:
- Delayed result display
- Sound effect integration
- Visual feedback
- Explanation display

#### 4. SoundEffects.js (Audio Management)
Sound Types:
- correct.mp3: Correct answer
- incorrect.mp3: Wrong answer
- streak.mp3: Streak milestone
- transition.mp3: Screen transitions
- button-press.mp3: Button interactions

Features:
- Sound preloading
- Volume control
- Error handling
- Automatic cleanup

### Styling (theme.css)
Color Scheme:
```css
:root {
  --primary-orange: #FF9F1C
  --secondary-orange: #FFB347
  --light-orange: #FFE5B4
  --warm-yellow: #FFD700
  --bg-light: #FFF8E7
  --text-dark: #333333
}
```

Key Features:
- Responsive design
- Animation support
- Consistent theming
- Component-specific styles

## Integration Points

### Backend to Frontend Communication
Endpoints:
1. GET /api/questions/random/psychology
   - Returns random psychology question
2. GET /api/questions/random/funfacts
   - Returns random fun fact question

Response Format:
```javascript
{
  id: number,
  question: string,
  options: {A, B, C, D},
  correctAnswer: string,
  explanation: string
}
```

### User Flow
1. Welcome Screen → Section Selection
2. Question Display (15s timer)
3. Answer Selection (1s delay)
4. Feedback Display
5. Video Reward
6. Repeat from step 2

## Development Setup

### Backend Setup
```bash
cd backend
npm install
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Technical Requirements
- Node.js 14+
- React 18+
- Modern browser support
- Audio capability
- Internet connection (for videos)

Would you like me to expand on any specific area or provide more detailed documentation for certain components?