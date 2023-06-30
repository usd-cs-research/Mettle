import { Socket } from 'socket.io';

export const sessionActivities = (socket: Socket, userId: string) => {
	socket.on('join', async (event) => {
		try {
			if (!event?.sessionId) {
				console.error('Empty session ID');
				return;
			}else{
				console.log("here");
				console.log(event.sessionId)
				return;
			}
			// await socket.join(event.sessionId);
			// socket.in(event.sessionId).emit('joined', { userId });
			
		} catch (error) {
			console.log("error")
		}
	});
};
