/**
 * Service for managing sound effects with callback system - FIXED VERSION
 */
class SoundEffects {
  static sounds = {
    correct: null,
    incorrect: null,
    buttonPress: null,
    transition: null,
    streak: null
  };

  // Add callback tracking - but simplify the implementation
  static correctCallbacks = [];

  static preloadSounds() {
    try {
      // Only load sounds if we're in a browser environment with Audio support
      if (typeof Audio !== 'undefined') {
        console.log('Attempting to preload sound effects');
        
        // Create audio objects for each sound
        this.sounds.correct = new Audio('/sounds/correct.mp3');
        this.sounds.incorrect = new Audio('/sounds/incorrect.mp3');
        this.sounds.buttonPress = new Audio('/sounds/button-press.mp3');
        this.sounds.transition = new Audio('/sounds/transition.mp3');
        this.sounds.streak = new Audio('/sounds/streak.mp3');
        
        // Preload all sounds
        Object.entries(this.sounds).forEach(([name, sound]) => {
          if (sound) {
            console.log(`Preloading sound: ${name}`);
            sound.load();
            
            // Add error handler for each sound
            sound.addEventListener('error', (e) => {
              console.error(`Error loading sound '${name}':`, e);
            });
          }
        });

        console.log('Sound effects preloaded successfully');
      }
    } catch (error) {
      console.warn('Error preloading sounds:', error);
    }
  }

  // Register a callback for correct answers - SIMPLIFIED
  static onCorrectAnswer(callback) {
    console.log("Registering correct answer callback");
    
    // Only register if function
    if (typeof callback === 'function') {
      this.correctCallbacks.push(callback);
    }
    
    // Return a function to unregister
    return () => {
      console.log("Unregistering correct answer callback");
      this.correctCallbacks = this.correctCallbacks.filter(cb => cb !== callback);
    };
  }

  static playSound(sound) {
    try {
      console.log(`Attempting to play sound: ${sound}`);
      if (this.sounds[sound]) {
        // Create a clone to allow overlapping sounds
        const soundClone = this.sounds[sound].cloneNode();
        soundClone.volume = 0.7;
        
        // Create a promise to play the sound and catch any errors
        const playPromise = soundClone.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`Successfully playing sound: ${sound}`);
            })
            .catch(err => {
              console.warn(`Error playing sound '${sound}':`, err);
              
              // If autoplay is blocked, try playing on user interaction
              document.addEventListener('click', () => {
                soundClone.play().catch(e => console.warn('Still failed to play sound:', e));
              }, { once: true });
            });
        }
      } else {
        console.warn(`Sound '${sound}' not found or not loaded`);
      }
    } catch (error) {
      console.warn(`Error playing ${sound} sound:`, error);
    }
  }

  // FIXED: Only play the sound, don't update state here
  static playCorrect() {
    console.log('Playing correct sound');
    this.playSound('correct');
    
    // Call all registered callbacks
    this.correctCallbacks.forEach(callback => {
      try {
        console.log("Triggering correct answer callback");
        callback();
      } catch (error) {
        console.error('Error in correct answer callback:', error);
      }
    });
  }

  static playIncorrect() {
    console.log('Playing incorrect sound');
    this.playSound('incorrect');
  }

  static playButtonPress() {
    console.log('Playing button press sound');
    this.playSound('buttonPress');
  }

  static playTransition() {
    console.log('Playing transition sound');
    this.playSound('transition');
  }

  static playStreak() {
    console.log('Playing streak sound');
    this.playSound('streak');
  }
}

export default SoundEffects;
