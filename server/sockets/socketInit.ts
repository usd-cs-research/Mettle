import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import jwt from 'jsonwebtoken';
import { sessionActivities } from './session';

export const ioConfig = (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
	io.on('connection', (socket: Socket) => {
		console.log('Connected to socket server');
	});
	const sessionRooms = io.of('/sessions');
	sessionRooms.on('connection', (socket: Socket) => {
		const token = socket.handshake.headers.authorization?.split(' ')[1];
		try {
			//@ts-ignore
			const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
				id: string;
				type: string;
			};
            sessionActivities(socket,decoded.id);
		} catch (err) {
			console.log('Unauthorized');
		}
	});
};
