const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Ensure the API key is available
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
if (!API_KEY) {
  console.error('ERROR: YouTube API key is missing. Set REACT_APP_YOUTUBE_API_KEY environment variable.');
  process.exit(1);
}

// Your list of channel IDs
const CHANNELS = [
  { handle: 'MrBeast', id: 'UCX6OQ3DkcsbYNE6H8uQQuVA' },
  { handle: 'ZachChoi', id: 'UCI78AdiI6f7VKhqW1i4B3Rw' },
  { handle: 'Jefferyxreacts', id: 'UC2qKQjnZI_tnG7XemGBOHxQ' },
  { handle: 'MusicMedia', id: 'UCWQrSQ0wJ3oZshXsZcl_Srg' },
  { handle: 'Howridiculous', id: 'UC5f5IV0Bf79YLp_p9nfInRA' },
  { handle: 'DanielLabielle', id: 'UCb8vrqP8Z7Oz9ZTYvUtjUHQ' },
  { handle: 'alanchikinchow ', id: 'UC5gxP-2QqIh_09djvlm9Xcg' },
  { handle: 'Sambucha', id: 'UCWBWgCD4oAqT3hUeq40SCUw' },
  { handle: 'Justicebuys', id: 'UCKaWD4ZM7ixlot6ysBVKP_g' },
  { handle: 'cats', id: 'UCbTaoonXlipQ-JsG7lhfKog' },
  { handle: 'remy', id: 'UCMCjKjb89bA2O2LnIxFZmGw' },
  { handle: 'cheekyboyos', id: 'UC1AZlchD57wkvpWFMDgMUJQ' },
  { handle: 'speedroute', id: 'UCrfVSWqMc9ev9fg84Jx6dZA' },
  { handle: 'GoldenBalance', id: 'UCsEmkNdR_HQ_INJd_M9lULQ' },
  { handle: 'Shortpocketmonster', id: 'UC274PEnFIQktbCbxDzzS-7Q' },
  { handle: 'kingchris', id: 'UCu-pLexbz0lzAzwzXtd6v_Q' },
  { handle: 'RyanTrahan', id: 'UCnmGIkw-KdI0W5siakKPKog' },
  { handle: 'irenic', id: 'UCAB1HPnSd06qUSXNvNDLIPA' },
  { handle: 'lionfield', id: 'UCHwpDpLoyJgtFXoAaaSut4Q' },
  { handle: 'joecain', id: 'UCHyMNXj5l7eTTQefXzT3MdQ' },
  { handle: 'GordonRamsay', id: 'UCIEv3lZ_tNXHzL3ox-_uUGQ' },
  { handle: 'JoshuaWeissman', id: 'UChBEbMKI1eCcejTtmI32UEw' },
  { handle: 'Jacksepticeye', id: 'UCYzPXprvl5Y-Sf0g4vX-m6g' },
  { handle: 'KhabyLame', id: 'UC86suRFnqiw8zN6LIYxddYQ' },
  { handle: 'EmmaChamberlain', id: 'UC78cxCAcp7JfQPgKxYdyGrg' },
  { handle: 'AddisonRae', id: 'UCsjVTTUMNPlas_Swa5QPVDA' },
  { handle: 'TuckerBudzyn', id: 'UCNSzfesc7IgWZwg4n6uXr1A' },
  { handle: 'Jiffpom', id: 'UC6IijBsXlCzX8uM60VlBpSQ' },
  { handle: 'DudePerfect', id: 'UCRijo3ddMTht_IHyNSNXpNQ' },
  { handle: 'ESPN', id: 'UCiWLfSweyRNmLpgEHekhoAg' },
  { handle: 'NFL', id: 'UCDVYQ4Zhbm3S2dlz7P1GBDg' },
  { handle: 'Hyram', id: 'UC2sYit3cZ2CuD_8FHYH7O_Q' },
  { handle: 'BretmanRock', id: 'UCM1gEqrjE_loHWZ2bwYZDMw' },
  { handle: 'CharliDAmelio', id: 'UCi0T2gz3oQ4Wbk0xhjyMZEQ' },
  { handle: 'BellaPoarch', id: 'UCi9cDo6239RAzPpBZO9y5SA' },
  { handle: '5MinuteCrafts', id: 'UC295-Dw_tDNtZXFeAPAW6Aw' },
  { handle: 'MrKate', id: 'UCMZft7_rg5Fhh-liS-322NA' },
  { handle: 'Kurzgesagt', id: 'UCsXVk37bltHxD1rDPwtNM8Q' },
  { handle: 'Veritasium', id: 'UCHnyfMqiRRG1u-2MsSQLbXA' }
];

// Output path - UPDATED TO USE FRONTEND/PUBLIC
const OUTPUT_DIR = 'frontend/public';
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'youtube-videos.json');

// Make sure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Load existing videos if any
let existingVideos = [];
if (fs.existsSync(OUTPUT_FILE)) {
  try {
    const data = fs.readFileSync(OUTPUT_FILE, 'utf8');
    existingVideos = JSON.parse(data).videos || [];
    console.log(`Loaded ${existingVideos.length} existing videos from file`);
  } catch (error) {
    console.error('Error reading existing file:', error);
  }
}

async function fetchVideosFromChannel(channel) {
  try {
    // Add timestamp and random param to avoid caching issues
    const timestamp = Date.now();
    const randomParam = Math.floor(Math.random() * 1000000);
    
    // Simpler request - just get videos from the channel without extra filters
    const url = `https://youtube.googleapis.com/youtube/v3/search?` +
      `part=snippet` +
      `&channelId=${channel.id}` +
      `&maxResults=5` +  // Increase from 3 to 5 for more videos
      `&type=video` +
      `&videoDuration=short` + // Specifically request short videos
      `&key=${API_KEY}` +
      `&_t=${timestamp}` + // Add timestamp to avoid caching
      `&_r=${randomParam}`; // Add random param to avoid caching
    
    console.log(`Making request for ${channel.handle}...`);
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log(`Got response for ${channel.handle}: ${response.status}`);

    if (!response.data.items?.length) {
      console.log(`No videos found for ${channel.handle}`);
      return [];
    }

    console.log(`Found ${response.data.items.length} videos for ${channel.handle}`);
    return response.data.items
      .map(item => ({
        id: item.id.videoId,
        url: `https://www.youtube.com/shorts/${item.id.videoId}`,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        channelHandle: channel.handle,
        publishedAt: item.snippet.publishedAt,
        addedAt: new Date().toISOString()
      }));
  } catch (error) {
    console.error(`Error fetching videos for ${channel.handle}:`, error.message);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error details:', JSON.stringify(error.response.data));
    }
    return [];
  }
}

// Main function
async function main() {
  console.log('Starting to fetch videos...');
  console.log(`Using API key: ${API_KEY.substring(0, 3)}...${API_KEY.substring(API_KEY.length - 3)}`);
  
  const newVideos = [];
  
  // Add random ordering to avoid the same channels always failing
  const shuffledChannels = [...CHANNELS].sort(() => Math.random() - 0.5);
  
  for (const channel of shuffledChannels) {
    console.log(`Fetching videos for ${channel.handle}...`);
    const videos = await fetchVideosFromChannel(channel);
    newVideos.push(...videos);
    
    // Larger delay between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`Fetched ${newVideos.length} new videos`);
  
  // Filter out duplicates
  const existingIds = new Set(existingVideos.map(v => v.id));
  const uniqueNewVideos = newVideos.filter(v => !existingIds.has(v.id));
  
  console.log(`${uniqueNewVideos.length} unique new videos after filtering duplicates`);
  
  if (uniqueNewVideos.length === 0 && existingVideos.length === 0) {
    console.error('ERROR: No videos found and no existing videos available!');
    // Don't exit - instead create a file with emergency fallback videos
    const fallbackVideos = [
      {
        id: "8_gdcaX9Xqk",
        url: "https://www.youtube.com/shorts/8_gdcaX9Xqk",
        title: "Would You Split Or Steal $250,000?",
        channelTitle: "MrBeast",
        channelHandle: "MrBeast",
        addedAt: new Date().toISOString()
      },
      {
        id: "c0YNnrHBARc",
        url: "https://www.youtube.com/shorts/c0YNnrHBARc",
        title: "How I Start My Mornings - Harvest Edition",
        channelTitle: "Zach King",
        channelHandle: "ZachKing",
        addedAt: new Date().toISOString()
      },
      // Add more emergency fallback videos here
    ];
    
    const output = {
      videos: fallbackVideos,
      lastUpdated: new Date().toISOString(),
      count: fallbackVideos.length,
      note: "EMERGENCY FALLBACK VIDEOS - API fetch failed"
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`Saved ${fallbackVideos.length} emergency fallback videos to ${OUTPUT_FILE}`);
    return;
  }
  
  // Combine and limit to 1000 videos
  let allVideos = [...uniqueNewVideos, ...existingVideos];
  if (allVideos.length > 1000) {
    allVideos = allVideos.slice(0, 1000);
  }
  
  // Save the file
  const output = {
    videos: allVideos,
    lastUpdated: new Date().toISOString(),
    count: allVideos.length
  };
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Saved ${allVideos.length} videos to ${OUTPUT_FILE}`);
}

// Execute with error handling
main().catch(error => {
  console.error('Error in main process:', error);
  process.exit(1);
});
