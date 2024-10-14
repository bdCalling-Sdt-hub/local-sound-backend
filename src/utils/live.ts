import fs from "node:fs";
import { PassThrough } from "node:stream";
import { countMusic, getMusics } from "../services/music";

type MusicData = {
  musics: {
    audio: string;
    image: string;
    name: string;
    price: number;
    id: string;
    duration: number;
    user: {
      name: string;
    };
  }[];
  totalMusic: number;
  totalTake: number;
  index: number;
};

const musicData: MusicData = {
  musics: [],
  totalMusic: 0,
  totalTake: 0,
  index: 0,
};

const stream = new PassThrough();

async function streamNextMusic() {
  try {
    if (musicData.index === 0) {
      if (musicData.totalTake === musicData.totalMusic) {
        musicData.totalTake = 0;
        musicData.totalMusic = await countMusic({});
      }

      musicData.musics = await getMusics({
        limit: 100,
        skip: musicData.totalTake,
        price: "asc",
        url: true,
      });

      musicData.totalTake += musicData.musics.length;
    }

    if (musicData.musics.length <= musicData.index) musicData.index = 0;

    const musicSize: number = fs.statSync(
      `./public/${musicData.musics[musicData.index].audio}`
    ).size;

    const chunkSize = Math.floor(
      musicSize / musicData.musics[musicData.index].duration
    );

    const music = fs.createReadStream(
      `./public/${musicData.musics[musicData.index].audio}`,
      {
        highWaterMark: chunkSize,
      }
    );

    music.pipe(stream, { end: false });

    music.on("end", () => {
      musicData.index += 1;
      music.destroy();
      streamNextMusic();
    });

    music.on("open", () => {
      io.emit("music", musicData.musics[musicData.index]);

      io.on("connection", (socket) => {
        socket.emit("music", musicData.musics[musicData.index]);
      });
    });

    music.on("error", (err) => {
      console.error(err);
      musicData.index += 1;
      music.destroy();
      streamNextMusic();
    });
  } catch (error) {
    console.error(error);
    musicData.index += 1;
    streamNextMusic();
  }
}

const controlledStream = new PassThrough();

const keepStreamActive = () => {
  const chunk = stream.read();

  if (chunk) controlledStream.push(chunk);

  setTimeout(keepStreamActive, 1000);
};

keepStreamActive();

streamNextMusic();

export default controlledStream;
