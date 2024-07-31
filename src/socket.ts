import { Server } from 'socket.io';
import { createServer } from 'node:http';

const server = createServer();

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('music', { music: 'Jazz' });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(9000);