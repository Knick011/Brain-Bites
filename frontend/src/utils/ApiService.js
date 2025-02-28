// utils/ApiService.js
/**
 * Service to handle API warming and health checks
 */
class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.warmedUp = false;
    this.warmupInterval = null;
  }

  /**
   * Ping the API to keep it warm
   */
  async ping() {
    try {
      const response = await fetch(`${this.baseUrl}/`);
      return response.ok;
    } catch (error) {
      console.error('API ping failed:', error);
      return false;
    }
  }

  /**
   * Warm up the API by making a request
   */
  async warmup() {
    try {
      console.log('Warming up API...');
      const isAlive = await this.ping();
      
      if (isAlive) {
        console.log('API is warm and responding');
        this.warmedUp = true;
        return true;
      } else {
        console.log('API not responding, will retry');
        return false;
      }
    } catch (error) {
      console.error('API warmup failed:', error);
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
      this.ping();
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
}

export default ApiService;
