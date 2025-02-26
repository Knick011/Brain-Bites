// utils/SoundEffects.js
class SoundEffects {
  static sounds = {
    correct: null,
    incorrect: null,
    buttonPress: null,
    transition: null,
    streak: null
  };

  static preloadSounds() {
    try {
      // Only load sounds if we're in a browser environment
      if (typeof Audio !== 'undefined') {
        this.sounds.correct = new Audio('/sounds/correct.mp3');
        this.sounds.incorrect = new Audio('/sounds/incorrect.mp3');
        this.sounds.buttonPress = new Audio('/sounds/button-press.mp3');
        this.sounds.transition = new Audio('/sounds/transition.mp3');
        this.sounds.streak = new Audio('/sounds/streak.mp3');
        
        // Preload all sounds
        Object.values(this.sounds).forEach(sound => {
          if (sound) {
            sound.load();
          }
        });
      }
    } catch (error) {
      console.error('Error preloading sounds:', error);
    }
  }

  static playSound(sound) {
    try {
      if (this.sounds[sound]) {
        // Create a clone to allow overlapping sounds
        const soundClone = this.sounds[sound].cloneNode();
        soundClone.volume = 0.7;
        soundClone.play().catch(err => console.error('Error playing sound:', err));
      }
    } catch (error) {
      console.error(`Error playing ${sound} sound:`, error);
    }
  }

  static playCorrect() {
    this.playSound('correct');
  }

  static playIncorrect() {
    this.playSound('incorrect');
  }

  static playButtonPress() {
    this.playSound('buttonPress');
  }

  static playTransition() {
    this.playSound('transition');
  }

  static playStreak() {
    this.playSound('streak');
  }
}

export default SoundEffects;
