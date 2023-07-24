import { Socket } from 'socket.io';
import sessionDetailsModels from '../models/sessionDetailsSchema';
import sessionModel from '../models/sessionSchema';
import { IEvent, ServerObject } from '../types/IEvent';

export const sessionActivities = (socket: Socket) => {
	socket.on('join', async (event: IEvent) => {
		try {
			//get session Id
			const sessionId =
				event.sessionId ||
				(await sessionModel
					.findOne({
						sessionName: event.sessionName,
					})
					.then((id) => {
						return id?._id.toString();
					}));
			const userId = event.userId;
			if (!sessionId && !userId) {
				return console.log('Session Id or userId not found');
			}
			const session = await sessionDetailsModels.findOne({
				sessionID: sessionId,
			});
			if (!session) {
				console.log('No session');
				return;
			}
			// This will happen when the user is joining a session for the first time
			// or a session which he must not join
			if (
				session.userTwo &&
				session?.userTwo?.userId.toString() !== userId
			) {
				console.log('Joining a full session');
				return;
			}
			if (
				!session?.userTwo &&
				session.userOne.userId.toString() !== userId
			) {
				await sessionDetailsModels.findOneAndUpdate(
					{ sessionID: sessionId },
					{
						$set: {
							'userTwo.userId': userId,
							'userTwo.userRole': 'Navigator',
						},
					},
				);
			}

			const updatedSession = await sessionDetailsModels.findOne({
				sessionID: sessionId,
			});
			//Update the online or offline status
			if (updatedSession?.userOne.userId.toString() === userId) {
				await sessionDetailsModels.findOneAndUpdate(
					{ sessionID: sessionId },
					{
						$set: {
							'userOne.userStatus': 'online',
							'userOne.socketId': socket.id,
						},
					},
				);
			} else {
				await sessionDetailsModels.findOneAndUpdate(
					{ sessionID: sessionId },
					{
						$set: {
							'userTwo.userStatus': 'online',
							'userTwo.socketId': socket.id,
						},
					},
				);
			}
			await socket.join(sessionId!);
			socket.in(sessionId!).emit('joined', {
				userId,
				sessionId,
			});
		} catch (error) {
			socket.emit('error', 'Error joining the session');
			console.error(error);
		}
	});

	socket.on('notepad-type', async (event: IEvent) => {
		try {
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
		try {
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
		} catch (error) {
			console.log(error);
		}
	});
	socket.on('disconnect', async (event) => {
		try {
			const socketId = socket.id;
			const sessionDetailsOne =
				await sessionDetailsModels.findOneAndUpdate(
					{
						'userOne.socketId': socketId,
					},
					{
						$set: {
							'userTwo.userStatus': 'offline',
							'userOne.userStatus': 'offline',
						},
					},
				);
			const sessionDetailsTwo =
				await sessionDetailsModels.findOneAndUpdate(
					{
						'userTwo.socketId': socketId,
					},
					{
						$set: {
							'userTwo.userStatus': 'offline',
							'userOne.userStatus': 'offline',
							'userOne.socketId': '',
							'userTwo.socketId': '',
						},
					},
				);
			const sessionId =
				sessionDetailsOne!.sessionID.toString() ||
				sessionDetailsTwo!.sessionID.toString();
			socket.in(sessionId).emit('session-offline');
		} catch (error) {
			console.log(error);
		}
	});
};

export const sendServerInfo = async (event: IEvent): Promise<ServerObject> => {
	const session = await sessionDetailsModels.findOne({
		sessionID: event.sessionId,
	});
	return { userOne: session!.userOne, userTwo: session!.userTwo };
};
