const fs = require('fs');
const path = require('path');

// Copy youtube-videos.json from the project root to the build directory
function copyVideosJson() {
  const sourceFile = path.join(__dirname, '../youtube-videos.json');
  const targetFile = path.join(__dirname, '../build/youtube-videos.json');
  
  try {
    // Make sure the build directory exists
    if (!fs.existsSync(path.join(__dirname, '../build'))) {
      console.log('Build directory not found, skipping copy.');
      return;
    }
    
    // Copy the file if it exists
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, targetFile);
      console.log('Successfully copied youtube-videos.json to build directory');
    } else {
      console.log('Source youtube-videos.json not found, using empty json');
      // Create an empty structure
      const emptyVideos = {
        videos: [],
        lastUpdated: new Date().toISOString(),
        count: 0
      };
      
      fs.writeFileSync(targetFile, JSON.stringify(emptyVideos, null, 2));
      console.log('Created empty youtube-videos.json in build directory');
    }
  } catch (error) {
    console.error('Error copying youtube-videos.json:', error);
  }
}

copyVideosJson();
