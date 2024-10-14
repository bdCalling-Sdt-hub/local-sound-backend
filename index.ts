import app from "./src/app";
import http from "http";
import { Server } from "socket.io";

declare global {
  var io: Server;
}

const PORT = 8000;

const server = http.createServer(app);

global.io = new Server(server);

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
