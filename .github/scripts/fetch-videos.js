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
 { handle: 'MrBeastShorts', id: 'UCj0O6W8yDuLg3iraAXKgCrQ' },
{ handle: 'ZachKingShorts', id: 'UCq8DICunczvLuJJq414DOyA' },
{ handle: '5MinCraftsShorts', id: 'UC295-Dw_tDNtZXFeAPAW6Aw' },
{ handle: 'DudePerfectShorts', id: 'UCRijo3ddMTht_IHyNSNXpNQ' },
{ handle: 'HowRidiculousShorts', id: 'UC5f5IV0Bf79YLp_p9nfInRA' },
{ handle: 'AliAbdaalShorts', id: 'UCoOae5nYA7VqaXzerajD0lg' },
{ handle: 'QuickLaughsShorts', id: 'UC2VzG3lJFDkjG4nVHut2rYg' },
{ handle: 'FunBytesShorts', id: 'UCX_WM2O-X96URC9eMeW6QNQ' },
{ handle: 'TrendSpotterShorts', id: 'UCV3Nm3T-XAgVhKH9jT0ViRg' },
{ handle: 'EpicSkitsShorts', id: 'UC9sJ8BbhsZUW6vQHwJ0Yufw' },
{ handle: 'SnackableSkits', id: 'UCbvLvtY2t63Z16dYpgzmILA' },
{ handle: 'DailyDoseShorts', id: 'UC0M0rxSz3IF0CsSour1iWmw' },
{ handle: 'CampusComedyShorts', id: 'UC9RM-iSvTu1uPJb8X5yp3EQ' },
{ handle: 'UniLaughsShorts', id: 'UC7lJqH978UBXBvwaOyzAJOQ' },
{ handle: 'FreshVibesShorts', id: 'UCyT-QiYYXUTsM2BgcLQHU9g' },
{ handle: 'QuickTricksShorts', id: 'UCE_M8A5yxnLfW0KghEeajjw' },
{ handle: 'GamerByteShorts', id: 'UCIEv3lZ_tNXHzL3ox-_uUGQ' },
{ handle: 'StyleSnippetsShorts', id: 'UCbTw29mcP12YlTt1EpUaVJw' },
{ handle: 'LifeHackShorts', id: 'UCJayvjGeLs2ZAzGKYWvdKEw' },
{ handle: 'MagicMinuteShorts', id: 'UCQ1XyRH5Orrj5SixM63iP4Q' },
{ handle: 'LOLClipsShorts', id: 'UCsT0YIqwnpJCM-mx7-gSA4Q' },
{ handle: 'ViralVidsShorts', id: 'UCD7WxLG3kw3Nq-V7JnRFkDw' },
{ handle: 'ChillZoneShorts', id: 'UCY30JRSgfhYXA6i6xX1erWg' },
{ handle: 'MinuteMirthShorts', id: 'UCfE5Cz44GNkJK8y2nWtZhHg' },
{ handle: 'QuickWitShorts', id: 'UCHw0_pc3xN2Owekbe5J_hWw' },
{ handle: 'CampusCapersShorts', id: 'UCyNtlmLB73-7gtlBz00XOQQ' },
{ handle: 'LOLBytesShorts', id: 'UC3XTzVzaHQEd30rQbuvCtTQ' },
{ handle: 'SnackableLaughsShorts', id: 'UCBR8-60-B28hp2BmDPdntcQ' },
{ handle: 'ShortsCentral', id: 'UCuAXFkgsw1L7xaCfnd5JJOw' },
{ handle: 'VibeCheckShorts', id: 'UCQD3awTLw9i8Xzh85FKsuJA' },
{ handle: 'TrendTideShorts', id: 'UCeY0bbntWzzVIaj2z3QigXg' },
{ handle: 'SwiftSnippetsShorts', id: 'UCWOqyRBZWMfB5UhEmmPDgSw' },
{ handle: 'QuickGagsShorts', id: 'UCXGgrKt94gR6lmN4aN3mYTg' },
{ handle: 'CampusCracksShorts', id: 'UClgRkhTL3_hImCAmdLfDE4g' },
{ handle: 'FunFixShorts', id: 'UCPDis9pjXuqyI7RYLJ-TTSA' },
{ handle: 'MemeStreamShorts', id: 'UC4PooiX37Pn1RZVv0YNp7jw' },
{ handle: 'DailyShorts', id: 'UC8wZnXYK_CGKlBcZp-GxYPA' },
{ handle: 'FreshShorts', id: 'UCU6JLYuer8tXV1hMNYsHcQg' },
{ handle: 'ShortCircuit', id: 'UCdBK94H6oZT2Q7l0-b0xmMg' },
{ handle: 'InstaShorts', id: 'UCVb9nphUs0Rz0RFIb0Db1XA' },
{ handle: 'TikTokRewindShorts', id: 'UCzcRQ3vRNr6fJ1A9rqwxcUQ' },
{ handle: 'FastFlicksShorts', id: 'UCzIZ8HrzDgc-pNQDUG6avBA' },
{ handle: 'RapidVidsShorts', id: 'UCByOQJjav0CUDwxCk-jVNRQ' },
{ handle: 'QuickMemeShorts', id: 'UC7_YxT-KID8kRbqZo7MyscQ' },
{ handle: 'LivelyShorts', id: 'UCspvd9vrvBNGu2Nyh3GVrzQ' },
{ handle: 'CollegeCrushShorts', id: 'UCTIoGJu9WBR8y9nV4VpxjZA' },
{ handle: 'CampusHypeShorts', id: 'UCp8G8m4bIsU5X5dX-H_pDJA' },
{ handle: 'UrbanShorts', id: 'UCK1i-UBVvoGf3sXH93MmF7Q' },
{ handle: 'ByteSizedFunShorts', id: 'UCLXo7UDZvByw2ixzpQCufnA' },
{ handle: 'PrimeShorts', id: 'UC-9b7aDP6ZN0coj9-xFnrtw' }
];

// Output path
const OUTPUT_DIR = 'public';
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
