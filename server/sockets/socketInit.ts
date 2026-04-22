import { Server, Socket } from 'socket.io';
import { sessionActivities } from './session';

export const ioConfig = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Global socket connected');
  });

  const sessionRooms = io.of('/session');

  sessionRooms.on('connection', (socket: Socket) => {
    console.log('Connected to socket');
    sessionActivities(socket);
  });
};