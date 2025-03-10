// utils/ApiService.js
/**
 * Service to handle API warming and health checks
 */
class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.warmedUp = false;
    this.warmupInterval = null;
    this.retryAttempts = 3;
    this.retryDelay = 2000; // 2 seconds
    this.isRetrying = false;
    this.lastError = null;
  }

  /**
   * Ping the API to keep it warm with better error handling
   */
  async ping() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.baseUrl}/`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        this.lastError = null;
        return true;
      } else {
        this.lastError = `API returned ${response.status}: ${response.statusText}`;
        console.error(`API ping failed with status ${response.status}: ${response.statusText}`);
        return false;
      }
    } catch (error) {
      this.lastError = error.message;
      console.error('API ping failed:', error);
      return false;
    }
  }

  /**
   * Warm up the API by making a request with retry
   */
  async warmup(attemptNum = 1) {
    if (this.isRetrying) {
      console.log('Already retrying, skipping this warmup attempt');
      return this.warmedUp;
    }
    
    try {
      this.isRetrying = true;
      console.log(`Warming up API, attempt ${attemptNum}...`);
      
      const isAlive = await this.ping();
      
      if (isAlive) {
        console.log('API is warm and responding');
        this.warmedUp = true;
        this.isRetrying = false;
        return true;
      } else {
        console.log(`API not responding on attempt ${attemptNum}`);
        
        if (attemptNum < this.retryAttempts) {
          // Add exponential backoff
          const delay = this.retryDelay * Math.pow(2, attemptNum - 1);
          console.log(`Will retry in ${delay}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          this.isRetrying = false;
          return this.warmup(attemptNum + 1);
        } else {
          console.error(`API warmup failed after ${this.retryAttempts} attempts.`);
          this.isRetrying = false;
          return false;
        }
      }
    } catch (error) {
      console.error('API warmup error:', error);
      this.lastError = error.message;
      this.isRetrying = false;
      return false;
    }
  }

  /**
   * Start keeping the API warm with periodic pings
   */
  startWarmupInterval(minutes = 10) {
    // Clear any existing interval
    if (this.warmupInterval) {
      clearInterval(this.warmupInterval);
    }

    // Convert minutes to milliseconds
    const interval = minutes * 60 * 1000;
    
    // Initial warmup
    this.warmup();
    
    // Set interval for regular pings
    this.warmupInterval = setInterval(() => {
      console.log('Executing periodic API ping...');
      this.ping().then(isAlive => {
        if (!isAlive && !this.isRetrying) {
          // If ping fails, try warming up again
          console.log('Periodic ping failed, attempting to warmup again');
          this.warmup();
        }
      });
    }, interval);
    
    console.log(`API warmup interval set for every ${minutes} minutes`);
  }

  /**
   * Stop the warmup interval
   */
  stopWarmupInterval() {
    if (this.warmupInterval) {
      clearInterval(this.warmupInterval);
      this.warmupInterval = null;
      console.log('API warmup interval stopped');
    }
  }

  /**
   * Get API status information
   */
  getStatus() {
    return {
      warmedUp: this.warmedUp,
      baseUrl: this.baseUrl,
      lastError: this.lastError,
      isRetrying: this.isRetrying
    };
  }

  /**
   * Generic method to make API requests with retry logic
   */
  async fetchWithRetry(endpoint, options = {}, retries = this.retryAttempts) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        const delay = this.retryDelay * Math.pow(2, this.retryAttempts - retries);
        console.log(`API request to ${endpoint} failed. Retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(endpoint, options, retries - 1);
      } else {
        console.error(`API request to ${endpoint} failed after ${this.retryAttempts} attempts.`, error);
        throw error;
      }
    }
  }

  /**
   * Get a random question with retry logic
   */
  async getRandomQuestion(category) {
    const endpoint = category ? 
      `/api/questions/random/${category}` : 
      `/api/questions/random`;
    
    return this.fetchWithRetry(endpoint);
  }
}

export default ApiService;
