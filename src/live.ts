import fs from "node:fs";
import { PassThrough } from "node:stream";

const musics = ["1.mp3", "2.mp3"];
let i = 0;

const stream = new PassThrough();

const streamNextMusic = () => {
  if (musics.length <= i) i = 0;

  const music = fs.createReadStream(`./public/${musics[i]}`, {
    highWaterMark: 16 * 1024,
  });

  music.pipe(stream, { end: false });

  music.on("end", () => {
    console.log("end music", musics[i]);
    i++;
    music.destroy();
    streamNextMusic();
  });

  music.on("open", () => {
    console.log("playing music", musics[i]);
  });

  music.on("error", (err) => {
    console.error("Error reading music file:", err);
    i++;
    music.destroy();
    streamNextMusic();
  });
};

const controlledStream = new PassThrough();

const keepStreamActive = () => {
  const chunk = stream.read();

  if (chunk) controlledStream.push(chunk);

  setTimeout(keepStreamActive, 500);
};

keepStreamActive();

streamNextMusic();

export default controlledStream;
