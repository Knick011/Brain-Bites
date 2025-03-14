// utils/ApiWarmupService.js
/**
 * Service to keep the API warm by sending periodic requests
 */
class ApiWarmupService {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl || 'https://brain-bites-api.onrender.com';
    this.interval = null;
    this.isActive = false;
    this.warmupInterval = 14 * 60 * 1000; // 14 minutes in milliseconds
  }

  /**
   * Start the warmup service
   */
  start() {
    if (this.isActive) return;
    
    console.log('Starting API warmup service');
    this.isActive = true;
    
    // Do an immediate warmup
    this.warmup();
    
    // Set up the interval for recurring warmups
    this.interval = setInterval(() => {
      this.warmup();
    }, this.warmupInterval);
  }

  /**
   * Stop the warmup service
   */
  stop() {
    if (!this.isActive) return;
    
    console.log('Stopping API warmup service');
    this.isActive = false;
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Perform a warmup request
   */
  async warmup() {
    try {
      console.log(`Warming up API at ${new Date().toISOString()}`);
      
      // Fetch the server status endpoint
      const response = await fetch(`${this.apiBaseUrl}/`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        console.log('API warmup successful');
      } else {
        console.warn(`API warmup returned status ${response.status}`);
      }
      
      // Also hit each category endpoint to warm up those routes
      await Promise.allSettled([
        fetch(`${this.apiBaseUrl}/api/questions/random/psychology`),
        fetch(`${this.apiBaseUrl}/api/questions/random/funfacts`)
      ]);
      
    } catch (error) {
      console.error('API warmup failed:', error);
    }
  }
}

export default new ApiWarmupService();
