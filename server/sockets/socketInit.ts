import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { sessionActivities } from './session';

export const ioConfig = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
	io.on('connection', (socket: Socket) => {
	});
	const sessionRooms = io.of('/session');
	sessionRooms.on('connection', (socket: Socket) => {

		sessionActivities(socket);
	});
};
