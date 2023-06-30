import { Server, Socket } from 'socket.io';
import sessionDetailsModels from '../models/sessionDetailsSchema';
import { IEvent, ServerObject } from '../types/IEvent';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export const sessionActivities = (
	socket: Socket,
	userId: string,
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
	socket.on('join', async (event: IEvent) => {
		try {
			const session = await sessionDetailsModels.find({
				$or: [
					{ 'userOne.userId': userId },
					{ 'userTwo.userId': userId },
				],
				sessionID: event.sessionId,
			});
			if (!session) {
				await sessionDetailsModels.findOneAndUpdate(
					{ sessionID: event.sessionId },
					{
						$set: [
							{
								'userTwo.userId': userId,
								'userTwo.userRole': 'Navigator',
							},
						],
					},
				);
			}
			await socket.join(event.sessionId);
			event.server = await sendServerInfo(event);
			if (io.sockets.adapter.rooms.get(event.sessionId)?.size === 2) {
				await sessionDetailsModels.findOneAndUpdate(
					{ sessionID: event.sessionId },
					{ status: 'online' },
				);
			}
			socket.in(event.sessionId).emit('joined', { userId });
		} catch (error) {
			console.error(error);
		}
	});

	socket.on('notepad-type', async (event: IEvent) => {
		try {
			const session = await sessionDetailsModels.findOneAndUpdate(
				{ sessionID: event.sessionId },
				{ notepad: event.notes },
			);
			if (session?.status === 'offline') {
				return socket.in(event.sessionId).emit('offline');
			}

			socket.in(event.sessionId).emit('notepad-typing', event);
		} catch (error) {
			console.error(error);
		}
	});

	socket.on('state-change', async (event: IEvent) => {
		try {
			const session = await sessionDetailsModels.findOneAndUpdate(
				{ sessionID: event.sessionId },
				{ state: event.state },
			);
			if (session?.status === 'offline') {
				return socket.in(event.sessionId).emit('offline');
			}
			socket.in(event.sessionId).emit('state-change', event);
		} catch (error) {
			console.error(error);
		}
	});

	socket.on('forward', async (event: IEvent) => {
		socket.in(event.sessionId).emit('forward', event);
	});

	socket.on('role-switch', async (event: IEvent) => {
		const sessionDetails = await sessionDetailsModels.findOne({
			sessionID: event.sessionId,
		});
		const session = await sessionDetailsModels.findOneAndUpdate(
			{ sessionID: event.sessionId },
			{
				$set: {
					'userOne.userRole': sessionDetails?.userTwo.userRole,
					'userTwo.userRole': sessionDetails?.userOne.userRole,
				},
			},
		);
		if (session?.status === 'offline') {
			return socket.in(event.sessionId).emit('offline');
		}
		event.server = await sendServerInfo(event);
		socket.in(event.sessionId).emit('role-switch', event);
	});
	socket.on('disconnect', async (event) => {
		const rooms = Array.from(socket.rooms);
		console.log(`User was connected to: ${rooms}`);
		rooms.forEach((roomId) => {
			console.log(roomId);
		});
		// await sessionDetailsModels.findOneAndUpdate(
		// 	{ sessionID: rooms },
		// 	{ status: 'offline' },
		// );
	});
};

export const sendServerInfo = async (event: IEvent): Promise<ServerObject> => {
	const session = await sessionDetailsModels.findOne({
		sessionID: event.sessionId,
	});
	return { userOne: session!.userOne, userTwo: session!.userTwo };
};

export const checkAndUpdateStatus = async (
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	event: IEvent,
): Promise<boolean> => {
	if (io.sockets.adapter.rooms.get(event.sessionId)?.size !== 2) {
		return false;
	}
	return true;
};
