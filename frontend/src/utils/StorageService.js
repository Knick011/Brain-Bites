// utils/StorageService.js
/**
 * Service for managing localStorage-based game state persistence
 */
class StorageService {
  static KEY_PREFIX = 'brainBites_';
  
  /**
   * Save game state to localStorage
   */
  static saveGameState(state) {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(`${this.KEY_PREFIX}gameState`, serializedState);
      console.log('Game state saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving game state:', error);
      return false;
    }
  }
  
  /**
   * Load game state from localStorage
   */
  static loadGameState() {
    try {
      const serializedState = localStorage.getItem(`${this.KEY_PREFIX}gameState`);
      if (!serializedState) {
        return null;
      }
      return JSON.parse(serializedState);
    } catch (error) {
      console.error('Error loading game state:', error);
      return null;
    }
  }
  
  /**
   * Save specific stat to localStorage
   */
  static saveStat(key, value) {
    try {
      localStorage.setItem(`${this.KEY_PREFIX}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      return false;
    }
  }
  
  /**
   * Load specific stat from localStorage
   */
  static loadStat(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(`${this.KEY_PREFIX}${key}`);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  }
  
  /**
   * Set tutorial completed flag
   */
  static setTutorialCompleted(completed = true) {
    return this.saveStat('tutorialCompleted', completed);
  }
  
  /**
   * Check if tutorial has been completed
   */
  static isTutorialCompleted() {
    return this.loadStat('tutorialCompleted', false);
  }
  
  /**
   * Save user's current score
   */
  static saveScore(score) {
    return this.saveStat('currentScore', score);
  }
  
  /**
   * Save user's highest score
   */
  static saveHighScore(score) {
    const currentHigh = this.loadStat('highScore', 0);
    if (score > currentHigh) {
      return this.saveStat('highScore', score);
    }
    return false;
  }
  
  /**
   * Get user's current score
   */
  static getScore() {
    return this.loadStat('currentScore', 0);
  }
  
  /**
   * Get user's highest score
   */
  static getHighScore() {
    return this.loadStat('highScore', 0);
  }
  
  /**
   * Save available video rewards
   */
  static saveAvailableVideos(count) {
    return this.saveStat('availableVideos', count);
  }
  
  /**
   * Get available video rewards
   */
  static getAvailableVideos() {
    return this.loadStat('availableVideos', 0);
  }
  
  /**
   * Save highest streak
   */
  static saveHighestStreak(streak) {
    const currentHigh = this.loadStat('highestStreak', 0);
    if (streak > currentHigh) {
      return this.saveStat('highestStreak', streak);
    }
    return false;
  }
  
  /**
   * Get highest streak
   */
  static getHighestStreak() {
    return this.loadStat('highestStreak', 0);
  }
  
  /**
   * Save total questions answered
   */
  static saveTotalQuestionsAnswered(count) {
    return this.saveStat('totalQuestionsAnswered', count);
  }
  
  /**
   * Get total questions answered
   */
  static getTotalQuestionsAnswered() {
    return this.loadStat('totalQuestionsAnswered', 0);
  }
  
  /**
   * Save total correct answers
   */
  static saveTotalCorrectAnswers(count) {
    return this.saveStat('totalCorrectAnswers', count);
  }
  
  /**
   * Get total correct answers
   */
  static getTotalCorrectAnswers() {
    return this.loadStat('totalCorrectAnswers', 0);
  }
  
  /**
   * Clear all stored data
   */
  static clearAllData() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      console.log('All storage data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing storage data:', error);
      return false;
    }
  }
}

export default StorageService;
