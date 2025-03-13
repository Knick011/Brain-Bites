/**
 * Service for API interactions
 */
class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || 'https://brain-bites-api.onrender.com';
    this.isReady = false;
    this.retryAttempts = 3;
    this.retryDelay = 2000; // 2 seconds
    this.questionCache = {
      psychology: [],
      funfacts: []
    };
  }

  /**
   * Check if the API is available
   */
  async checkAvailability() {
    try {
      console.log(`Checking API availability at ${this.baseUrl}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseUrl}/`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('API is available');
        this.isReady = true;
        return true;
      } else {
        console.warn(`API returned ${response.status}: ${response.statusText}`);
        return false;
      }
    } catch (error) {
      console.error('API check failed:', error);
      return false;
    }
  }

  /**
   * Get a random question
   */
  async getRandomQuestion(category) {
    if (!category) {
      throw new Error('Category is required');
    }
    
    try {
      // Check if we have cached questions
      if (this.questionCache[category] && this.questionCache[category].length > 0) {
        console.log(`Using cached ${category} question`);
        const randomIndex = Math.floor(Math.random() * this.questionCache[category].length);
        const question = this.questionCache[category][randomIndex];
        
        // Remove the used question from cache
        this.questionCache[category] = this.questionCache[category].filter((_, index) => index !== randomIndex);
        
        return question;
      }
      
      // No cached questions, fetch from API
      console.log(`Fetching ${category} question from API`);
      
      // Convert category to proper API endpoint format
      // Both "funfacts" and "psychology" should work with the API
      const apiCategory = category.toLowerCase().trim();
      const endpoint = `/api/questions/random/${apiCategory}`;
      const url = `${this.baseUrl}${endpoint}`;
      
      console.log(`Request URL: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.error(`API request failed: ${response.status} ${response.statusText}`);
          throw new Error(`API request failed: ${response.status}`);
        }
        
        const question = await response.json();
        return question;
      } catch (fetchError) {
        console.error(`Error with direct fetch: ${fetchError}`);
        
        // Try a backup endpoint without category
        console.log("Trying fallback endpoint without category");
        const fallbackResponse = await fetch(`${this.baseUrl}/api/questions/random`, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (fallbackResponse.ok) {
          const question = await fallbackResponse.json();
          return question;
        }
        
        throw fetchError;
      }
    } catch (error) {
      console.error(`Error fetching question for ${category}:`, error);
      
      // Return a fallback question if all else fails
      return this.getFallbackQuestion(category);
    }
  }

  /**
   * Fetch and cache multiple questions in the background
   */
  async prefetchQuestions(category, count = 5) {
    try {
      if (!this.questionCache[category]) {
        this.questionCache[category] = [];
      }
      
      console.log(`Prefetching ${count} ${category} questions...`);
      
      const endpoint = `/api/questions/random/${category}`;
      const promises = [];
      
      for (let i = 0; i < count; i++) {
        promises.push(
          fetch(`${this.baseUrl}${endpoint}`)
            .then(response => {
              if (!response.ok) throw new Error(`API request failed: ${response.status}`);
              return response.json();
            })
            .then(question => this.questionCache[category].push(question))
            .catch(err => console.warn(`Failed to prefetch question ${i}:`, err))
        );
        
        // Add a small delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      await Promise.allSettled(promises);
      console.log(`Cached ${this.questionCache[category].length} ${category} questions`);
    } catch (error) {
      console.error(`Error prefetching ${category} questions:`, error);
    }
  }

  /**
   * Get a fallback question when API fails
   */
  getFallbackQuestion(category) {
    console.log(`Using fallback question for ${category}`);
    
    const fallbackQuestions = {
      psychology: [
        {
          id: 1,
          question: "What is the definition of psychology?",
          options: {
            A: "The study of human culture",
            B: "The scientific study of behavior and mental processes",
            C: "The study of historical events",
            D: "The study of chemical reactions in the brain"
          },
          correctAnswer: "B",
          explanation: "Psychology is defined as the scientific study of behavior and mental processes."
        },
        {
          id: 2,
          question: "Who is considered the father of modern psychology?",
          options: {
            A: "Sigmund Freud",
            B: "Wilhelm Wundt",
            C: "B.F. Skinner",
            D: "Carl Jung"
          },
          correctAnswer: "B",
          explanation: "Wilhelm Wundt is often regarded as the father of modern psychology because he established the first psychology laboratory."
        }
      ],
      funfacts: [
        {
          id: 31,
          question: "What is the only mammal capable of true flight?",
          options: {
            A: "Bat",
            B: "Squirrel",
            C: "Flying squirrel",
            D: "Ostrich"
          },
          correctAnswer: "A",
          explanation: "Bats are the only mammals that can truly fly."
        },
        {
          id: 32,
          question: "Which animal is known to have the longest migration route?",
          options: {
            A: "Monarch butterfly",
            B: "Arctic tern",
            C: "Humpback whale",
            D: "Caribou"
          },
          correctAnswer: "B",
          explanation: "The Arctic tern migrates from the Arctic to the Antarctic and back each year, making it the longest migration of any known animal."
        }
      ]
    };
    
    const categoryQuestions = fallbackQuestions[category] || fallbackQuestions.funfacts;
    const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
    return categoryQuestions[randomIndex];
  }
}

export default ApiService;
