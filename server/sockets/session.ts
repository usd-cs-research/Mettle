import { Server, Socket } from 'socket.io';
import sessionDetailsModels from '../models/sessionDetailsSchema';
import { IEvent, ServerObject } from '../types/IEvent';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import sessionModel from '../models/sessionSchema';

export const sessionActivities = (
	socket: Socket,
	userId: string,
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) => {
	socket.on('join', async (event: IEvent) => {
		try {
			const sessionId =
				event.sessionId ||
				(await sessionModel
					.findOne({ sessionName: event.sessionName })
					.then((doc) => {
						return doc?._id.toString();
					}));
			if (!sessionId) {
				return;
			}
			const session = await sessionDetailsModels.find({
				sessionID: sessionId,
				$or: [
					{ 'userOne.userId': userId },
					{ 'userTwo.userId': userId },
				],
			});
			if (session.length === 0) {
				if (session[0].userTwo) {
					return;
				}
				await sessionDetailsModels.findOneAndUpdate(
					{ sessionID: sessionId },
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
			await socket.join(sessionId);
			event.server = await sendServerInfo(event);
			let updatedSession;
			if (io.sockets.adapter.rooms.get(sessionId)?.size === 2) {
				updatedSession = await sessionDetailsModels.findOneAndUpdate(
					{ sessionID: sessionId },
					{ status: 'online' },
				);
			}
			socket.in(sessionId).emit('joined', {
				userId,
				sessionId,
				status: updatedSession?.status || 'offline',
				server: event.server,
			});
			console.log(event.server);
			console.log('joined');
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
		console.log(`User was connected to: ${JSON.stringify(socket.rooms)}`);
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
		sessionID:
			event.sessionId ||
			(await sessionModel
				.findOne({ sessionName: event.sessionName })
				.then((doc) => {
					return doc?._id.toString();
				})),
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
