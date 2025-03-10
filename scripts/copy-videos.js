const fs = require('fs');
const path = require('path');

// Paths
const sourceJsonFile = path.resolve(__dirname, '../public/youtube-videos.json');
const buildJsonFile = path.resolve(__dirname, '../build/youtube-videos.json');

// Ensure videos.json is in both locations
function copyVideosJson() {
  console.log('Checking for YouTube videos JSON file...');
  
  // Create fallback JSON if needed
  if (!fs.existsSync(sourceJsonFile)) {
    console.log('Creating placeholder youtube-videos.json in public/');
    const fallbackJson = {
      videos: [],
      lastUpdated: new Date().toISOString(),
      count: 0,
      note: "This is a placeholder file. It should be populated by GitHub Actions."
    };
    
    fs.writeFileSync(sourceJsonFile, JSON.stringify(fallbackJson, null, 2));
  }
  
  // Copy to build directory if it exists
  if (fs.existsSync(path.resolve(__dirname, '../build'))) {
    console.log('Copying youtube-videos.json to build/');
    fs.copyFileSync(sourceJsonFile, buildJsonFile);
  }
  
  console.log('Done!');
}

// Run the copy function
copyVideosJson();
