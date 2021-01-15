Here be 🐉's...

## SvelteKit Twitch

A [sveltekit](https://www.npmjs.com/package/@sveltejs/kit) powered [Twitch](https://www.twitch.tv/) altnerative/clone.

![sveltekit-twitch](https://i.imgur.com/gbOK75J.png)

## About

- **Emotes** are obtained through Twitch's global emotes and the [top 300 BTTV](https://betterttv.com/emotes/top) emotes 

- **Usernames**, along with their `hue`, are randomly generated and stored in `localStorage`

- **Chat** is powered by [socket.io](https://socket.io/)

- **RTMP Server** for streaming via OBS
    - The **Server** is `rtmp://localhost/live`
    - The **Stream Key** is `svelte`

- **FMPEG** converts the RTMP stream to a HLS stream for [Vime](https://vimejs.com/)

## Setup

1. `git clone https://github.com/rmanky/sveltekit-twitch`
2. `npm install`
3. Create a `.env` file ([ffmpeg](https://ffmpeg.org/) & [ngrok](https://ngrok.com/))
    - Install [ffmpeg](https://ffmpeg.org/) and set `FFMPEG_PATH`
    - Create an [ngrok](https://ngrok.com/) account and set `NGROK_TOKEN`
    ```
    FFMPEG_PATH=PATH_TO_FFMPEG.EXE
    NGROK_TOKEN=YOUR_NGROK_TOKEN
    ```
4. `npm run build`
5. `npm run adapt`
6. `node server.js`
7. Open the `HTTP URL` that is printed to the `console`