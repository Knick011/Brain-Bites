// SoundEffects.js
class SoundEffects {
  constructor() {
    // Import all sounds
    this.correct = new Audio('/sounds/correct.mp3');
    this.incorrect = new Audio('/sounds/incorrect.mp3');
    this.streak = new Audio('/sounds/streak.mp3');
    this.transition = new Audio('/sounds/transition.mp3');
    this.buttonPress = new Audio('/sounds/button-press.mp3');
        
    // Pre-load all sounds and set volumes
    this.sounds = [
      this.correct,
      this.incorrect,
      this.streak,
      this.transition,
      this.buttonPress
    ];

    this.sounds.forEach(sound => {
      sound.load();
    });

    // Set individual volumes
    this.correct.volume = 0.4;
    this.incorrect.volume = 0.3;
    this.streak.volume = 0.5;
    this.transition.volume = 0.2;
    this.buttonPress.volume = 0.1;
  }

  playCorrect() {
    this.correct.currentTime = 0;
    this.correct.play().catch(e => console.log('Audio play failed:', e));
  }

  playIncorrect() {
    this.incorrect.currentTime = 0;
    this.incorrect.play().catch(e => console.log('Audio play failed:', e));
  }

  playStreak() {
    this.streak.currentTime = 0;
    this.streak.play().catch(e => console.log('Audio play failed:', e));
  }

  playTransition() {
    this.transition.currentTime = 0;
    this.transition.play().catch(e => console.log('Audio play failed:', e));
  }

  playButtonPress() {
    this.buttonPress.currentTime = 0;
    this.buttonPress.play().catch(e => console.log('Audio play failed:', e));
  }
}

export default new SoundEffects();