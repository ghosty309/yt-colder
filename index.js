const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const videoUrl = process.argv[2];

if (!videoUrl) {
  console.error('Please provide a YouTube video URL.');
    process.exit(1);
    }

const videoInfo = ytdl.getInfo(videoUrl);

videoInfo.then(info => {
    const videoTitle = info.videoDetails.title.replace(/[^a-zA-Z0-9]/g, '_');
    const downloadPath = path.join(__dirname, 'video-downloads', videoTitle);

    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true });
    }

    const videoStream = ytdl(videoUrl, { filter: 'audioandvideo' });
    const mp4FilePath = path.join(downloadPath, `${videoTitle}.mp4`);
    const mp3FilePath = path.join(downloadPath, `${videoTitle}.mp3`);

    videoStream.pipe(fs.createWriteStream(mp4FilePath));
    console.log(`Downloading video to ${mp4FilePath}`);

    const audioStream = ytdl(videoUrl, { filter: 'audioonly' });
    audioStream.pipe(fs.createWriteStream(mp3FilePath));
    console.log(`Downloading audio to ${mp3FilePath}`);
});