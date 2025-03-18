/**
 * Get unique videos from cache
 */
getUniqueVideosFromCache(count) {
  // Ensure we have videos in cache before proceeding
  if (!this.cache.videos || this.cache.videos.length === 0) {
    console.warn('No videos in cache');
    return [];
  }

  // Additional validation - make sure all videos have IDs
  const validVideos = this.cache.videos.filter(video => video && video.id);
  if (validVideos.length < this.cache.videos.length) {
    console.warn(`Filtered out ${this.cache.videos.length - validVideos.length} invalid videos`);
    this.cache.videos = validVideos;
  }
  
  // Filter out videos that have already been shown
  const availableVideos = this.cache.videos.filter(video => 
    !this.cache.shownVideos.has(video.id)
  );
  
  console.log(`Found ${availableVideos.length} available videos that haven't been shown yet`);
  
  // If we don't have enough videos, reset the shown videos tracker
  if (availableVideos.length < count) {
    console.log('Not enough videos available, resetting shown videos cache');
    this.cache.shownVideos.clear();
    
    // Return random videos from the full cache
    return this.getRandomVideos(this.cache.videos, count);
  }
  
  // Get random videos from available ones
  return this.getRandomVideos(availableVideos, count);
}
