const axios = require('axios');
const fs = require('fs');

// Your list of channel IDs
const CHANNELS = [
  { handle: 'LukeDavidson', id: 'UCgukwUkm4KxWtR4NHVIz_aw' },
  { handle: 'Kallmekris', id: 'UCrVxhp3_PsRTCEHV_-bGnmQ' },
  { handle: 'MDMotivator', id: 'UCO0F_MB6xTV_BY5AZT-OVJQ' },
  { handle: 'sandiction', id: 'UCQkA7PsZm6G9QXJPQhz9_sA' },
  { handle: 'Mythic', id: 'UCjIl9tbIu-FmH8b8UaeLqzw' },
  { handle: 'TheMagicMatt', id: 'UCtc2iRmzJA_y2aV-F6LNVHQ' },
  { handle: 'GoldenGully', id: 'UCjtB3JF_FYXJTnLl-lRN_5Q' },
  { handle: 'DokaRyan', id: 'UCrxnUEw7w3rWyvazn_QAjjQ' },
  { handle: 'Ottawalks', id: 'UCdOvlULrkZHlgpOCiYKYEfQ' },
  { handle: 'Shangerdanger', id: 'UC3EKIGYCjfKg8qK1KlceBLw' },
  { handle: 'Hingaflips', id: 'UCORjlzGBYCeJvspCUJMzvzA' },
  { handle: 'ChrisIvan', id: 'UCLbMTQR7TXzPAYJ0FsAL2xw' },
  { handle: 'BrodieThatDood', id: 'UCLt2UjGcHpzvQGCDxlV-P-g' },
  { handle: 'AdrianBliss', id: 'UCGv3KG_qIWQuIZn1GCATuOQ' },
  { handle: 'ZackDFilms', id: 'UCiMnriUF5hZg8llQWq6FzCg' },
  { handle: 'ILYABORZOV', id: 'UC_iQvdDV3r9lqJtvdAtHk6Q' },
  { handle: 'JoJosWorld', id: 'UCqjvlcXH4CbMgv9QqAUvxZw' },
  { handle: 'KellyClarksonShow', id: 'UCmFu4PNQdMc1qDqHtdBYB1Q' },
  { handle: 'iKnowAyrel', id: 'UCH0C-wHzZKvL9s7XTxpXD_Q' },
  { handle: 'MrBeast', id: 'UCX6OQ3DkcsbYNE6H8uQQuVA' },
  { handle: 'ZachKing', id: 'UCq8DICunczvLuJJq414110A' },
  { handle: 'JeenieWeenie', id: 'UClw0M9qyDxc_h_biGG7Ay5g' },
  { handle: 'StokesTwins', id: 'UC4NndlbP8qzF9tC9PgKcBcg' },
  { handle: 'AlanChikinChow', id: 'UC_9vN1gLWexhqaX9I5P_mwQ' },
  { handle: 'DanRhodes', id: 'UC1ySlYiQjYUmUlD52ZGUVgw' },
  { handle: 'FritzProctor', id: 'UCZCLrz01Hl4bV84SHjClK7w' },
  { handle: 'LoicSuberville', id: 'UCy1PpKdRu0UC7FCtTUkZxnA' },
  { handle: 'TheKoreanVegan', id: 'UCyn3RR2Zbzk1LK-F8HBtHjw' },
  { handle: 'TopperGuild', id: 'UC5T3PbKmz1zw_4zGYf4lFJw' },
  { handle: 'NathanKessel', id: 'UCs7fWU7dWqvdLzTcnfXs-gw' },
  { handle: 'AzzyLand', id: 'UCzeB_0FNcPIyUSjL_TL5lEw' },
  { handle: 'HacksmithIndustries', id: 'UCjgpFI5dU-D5_ftJD9SYRJQ' },
  { handle: 'SISvsBRO', id: 'UCFAtXHD2_qs-sTDOAUE-yIw' },
  { handle: 'CoreyTonge', id: 'UC3E5-_fjN7Je_l1DfV0xmWg' },
  { handle: 'CrashAdams', id: 'UCEJHdGMlGIaDfCfw-xYqPIA' },
  { handle: 'AndreasEskander', id: 'UC9MPfqmxj-52qihjIYSPYkw' },
  { handle: 'AnnaMcNulty', id: 'UCeSKaUd5E_KXEgEcxGLxsAA' },
  { handle: 'MadFit', id: 'UCpQ34afVgk8cRQBjSJ1xuJQ' },
  { handle: 'NutshellAnimations', id: 'UCsaEBhRsI6tmmz12fkSEYdw' },
  { handle: 'SAS-ASMR', id: 'UCp4LfMtDfoa29kTlLnqEg5g' },
  { handle: 'ManchurekTriplets', id: 'UCJwn1w8QRZ3-VbJU3Dna-iA' },
  { handle: 'AaronEsser', id: 'UCabr1XnvE_tQcQHTbezG4QQ' },
  { handle: 'TwiShorts', id: 'UCTLcNP0soBZz_sFb8X-elrQ' },
  { handle: 'LaylaRoblox', id: 'UCrNg4XtbG4F89aQPsmnzXHQ' },
  { handle: 'NickEh30', id: 'UCt9nYeSz90lnOnaVFjxFJsw' },
  { handle: 'NileRed', id: 'UCFhXFikryT4aFcLkLw2LBLA' },
  { handle: 'ElectroBOOM', id: 'UCJ0-OtVpF0wOKEqT2Z1HEtA' },
  { handle: 'Gloom', id: 'UCQ9npS-QvXoNh_UNtKsLCdA' },
  { handle: 'MostAmazingTop10', id: 'UCBINYCmwE29fBXCpUI8DgTA' },
  { handle: 'PapaJake', id: 'UC16ridNZ56R5WUQ9MEYv5jQ' }
];

// Output path
const OUTPUT_FILE = 'public/youtube-videos.json';

// Make sure the output directory exists
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

// Load existing videos if any
let existingVideos = [];
if (fs.existsSync(OUTPUT_FILE)) {
  try {
    const data = fs.readFileSync(OUTPUT_FILE, 'utf8');
    existingVideos = JSON.parse(data).videos || [];
  } catch (error) {
    console.error('Error reading existing file:', error);
  }
}

// Fetch videos from a channel
async function fetchVideosFromChannel(channel) {
  try {
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?` +
      `part=snippet` +
      `&channelId=${channel.id}` +
      `&maxResults=3` +
      `&type=video` +
      `&videoDuration=short` +
      `&order=viewCount` +
      `&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
    );

    if (!response.data.items?.length) {
      return [];
    }

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
    return [];
  }
}

// Main function
async function main() {
  console.log('Starting to fetch videos...');
  const newVideos = [];
  
  for (const channel of CHANNELS) {
    console.log(`Fetching videos for ${channel.handle}...`);
    const videos = await fetchVideosFromChannel(channel);
    newVideos.push(...videos);
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`Fetched ${newVideos.length} new videos`);
  
  // Filter out duplicates
  const existingIds = new Set(existingVideos.map(v => v.id));
  const uniqueNewVideos = newVideos.filter(v => !existingIds.has(v.id));
  
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

main().catch(error => {
  console.error('Error in main process:', error);
  process.exit(1);
});
