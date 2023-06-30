import { Socket } from 'socket.io';
import sessionDetailsModels from '../models/sessionDetailsSchema';
import { IEvent, ServerObject } from '../types/IEvent';

export const sessionActivities = (socket: Socket, userId: string) => {
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
			socket.in(event.sessionId).emit('joined', { userId });
		} catch (error) {
			console.error(error);
		}
	});

	socket.on('notepad-type', async (event: IEvent) => {
		try {
			await sessionDetailsModels.findOneAndUpdate(
				{ sessionID: event.sessionId },
				{ notepad: event.notes },
			);
			socket.in(event.sessionId).emit('notepad-typing', event);
		} catch (error) {
			console.error(error);
		}
	});

	socket.on('state-change', async (event: IEvent) => {
		try {
			await sessionDetailsModels.findOneAndUpdate(
				{ sessionID: event.sessionId },
				{ state: event.state },
			);
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
		await sessionDetailsModels.findOneAndUpdate(
			{ sessionID: event.sessionId },
			{
				$set: {
					'userOne.userRole': sessionDetails?.userTwo.userRole,
					'userTwo.userRole': sessionDetails?.userOne.userRole,
				},
			},
		);
		event.server = await sendServerInfo(event);
		socket.in(event.sessionId).emit('role-switch', event);
	});

	socket;
};

export const sendServerInfo = async (event: IEvent): Promise<ServerObject> => {
	const session = await sessionDetailsModels.findOne({
		sessionID: event.sessionId,
	});
	return { userOne: session!.userOne, userTwo: session!.userTwo };
};
