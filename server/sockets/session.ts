import { Socket } from 'socket.io';

export const sessionActivities = (socket: Socket, userId: string) => {
	socket.on('join', async (event) => {
		if (event.sessionId) {
			console.error('Empty session ID');
			return;
		}
		await socket.join(event.sessionId);
		await socket.in(event.sessionId).emit('joined', { userId });
	});
};
