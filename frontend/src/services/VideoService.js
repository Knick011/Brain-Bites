// src/services/videoService.js
// You can replace these with actual YouTube Shorts URLs
const videos = [
    {
      id: 1,
      url: 'https://www.youtube.com/shorts/Noqaz0Ic6ps',
      title: 'Fun Video 1'
    },
    {
      id: 2,
      url: 'https://www.youtube.com/shorts/4kTqc6iQzf4',
      title: 'Fun Video 2'
    },
    // Add more videos here
  ];
  
  export const getRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    return videos[randomIndex];
  };
  
  export const getNextVideo = (currentId) => {
    const currentIndex = videos.findIndex(v => v.id === currentId);
    const nextIndex = (currentIndex + 1) % videos.length;
    return videos[nextIndex];
  };