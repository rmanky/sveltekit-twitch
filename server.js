require('dotenv').config()

const express = require('express');
const cors = require('cors');
const http = require('http');
const socket = require('socket.io');
const fetch = require('node-fetch');
const httpPort = 8000;
const mediaPort = 5000;

let httpURL = "";
let mediaURL = "";

const NodeMediaServer = require('node-media-server');

let emoteList = [];

(async () => {
  const globalResponse = await fetch('https://api.twitchemotes.com/api/v4/channels/0');
  const globalJSON = await globalResponse.json();
  globalJSON.emotes.forEach(emote => {
    emoteList.push({
      code: emote.code,
      img: `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`
    });
  });

  [1,100,200].forEach(async (num) => {
    const bttvResponse = await fetch(`https://api.betterttv.net/3/emotes/shared/top?offset=${num - 1}&limit=100`);
    const bttvJSON = await bttvResponse.json();
    bttvJSON.forEach(entry => {
      emoteList.push({
        code: entry.emote.code,
        img: `https://cdn.betterttv.net/emote/${entry.emote.id}/1x`
      });
    });
    console.log(`Added BTTV run #${num}`);
  });
})();

const ngrok = require('ngrok');

const app = express();
const httpServer = http.Server(app);

(async function () {
  await ngrok.authtoken(process.env.NGROK_TOKEN);
  httpURL = await ngrok.connect(httpPort);
  mediaURL = await ngrok.connect(mediaPort);
  console.log(`HTTP URL: ${httpURL}`);
  console.log(`MEDIA URL: ${mediaURL}`);

  const io = socket(httpServer, {
    cors: {
      origin: httpURL,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room);
    });

    socket.on('chat', (payload) => {
      io.sockets.in(payload.room).emit('chat', payload)
    });
  })
})();

app.use(express.static('build'));

app.use(cors());

app.get('/', (req, res) => {
  res.send('build/index.html');
});

app.get('/media', (req, res) => {
  res.send({ mediaURL });
});

app.get('/socket', (req, res) => {
  res.send({ httpURL });
});

app.get('/emotes', (req, res) => {
  res.send(emoteList);
})

httpServer.listen(httpPort, () => console.log(`HTTP server listening @ http://localhost:${httpPort}`));

const config = {
  logType: 1,
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: mediaPort,
    mediaroot: './media',
    allow_origin: '*'
  },
  trans: {
    ffmpeg: process.env.FFMPEG_PATH,
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]'
      }
    ]
  }
};

var mediaServer = new NodeMediaServer(config);
mediaServer.run();