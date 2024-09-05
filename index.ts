import app from "./src/app";
import http from "http";
import { Server } from "socket.io";
import { PassThrough } from "stream";
import fs from "node:fs";
import { getMusics, countMusic } from "./src/services/music";

type MusicData = {
  musics: {
    audio: string;
    image: string;
    name: string;
    price: number;
    id: string;
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
   
const PORT = 8000;

const server = http.createServer();

server.on("request", (req, res) => {
  if (req.url === "/stream") {
    console.log("Req in Stream")
    streamingMusic(req, res);
  } else {
    app(req, res);
  }
});

const io = new Server(server);

io.on("connection", (socket) => {
  socket.emit("music", musicData.musics[musicData.index]);
});

async function streamingMusic(
  _: http.IncomingMessage,
  res: http.ServerResponse
) {
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Connection", "keep-alive");

  const clientStream = new PassThrough();
  stream.pipe(clientStream);
  clientStream.pipe(res);

  res.on("close", () => {
    clientStream.unpipe(res);
    clientStream.destroy();
  });
}

const stream = new PassThrough();
const controlledStream = new PassThrough();

(async function streamNextMusic() {
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

  const music = fs.createReadStream(
    `./public/${musicData.musics[musicData.index].audio}`,
    {
      highWaterMark: 16 * 1024,
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
  });

  music.on("error", () => {
    musicData.index += 1;
    music.destroy();
    streamNextMusic();
  });
})();


(function keepStreamActive() {
  const chunk = stream.read();

  if (chunk) controlledStream.push(chunk);

  setTimeout(keepStreamActive, 500);
})();

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
