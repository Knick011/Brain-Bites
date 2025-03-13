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
