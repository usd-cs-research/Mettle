import { Socket } from 'socket.io';
import sessionDetailsModels from '../models/sessionDetailsSchema';
import { IEvent, ServerObject } from '../types/IEvent';

export const sessionActivities = (socket: Socket, userId: string) => {
	socket.on('join', async (event: IEvent) => {
		try {
			//get session Id
			const sessionId = event.sessionId;

			const session = await sessionDetailsModels.find({
				sessionID: sessionId,
				$or: [
					{ 'userOne.userId': userId },
					{ 'userTwo.userId': userId },
				],
			});
			// This will happen when the user is joining a session for the first time
			// or a session which he must not join
			if (session.length === 0) {
				console.log('User not in session');
				if (session[0].userTwo.userId.toString() !== userId) {
					console.log('Joining a full session');

					return;
				}
				if (!session[0].userTwo) {
					console.log('User is new in the session');
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
			}
			const updatedSession = await sessionDetailsModels.findOne({
				sessionID: sessionId,
			});
			//Update the online or offline status
			if (updatedSession?.userOne.userId.toString() === userId) {
				await sessionDetailsModels.findOneAndUpdate(
					{ sessionID: sessionId },
					{
						$set: [
							{
								'userOne.userStatus': 'online',
							},
						],
					},
				);
			} else {
				await sessionDetailsModels.findOneAndUpdate(
					{ sessionID: sessionId },
					{
						$set: [
							{
								'userTwo.userStatus': 'online',
							},
						],
					},
				);
			}
			await socket.join(sessionId);

			console.log(`Joined room ${sessionId}`);
			socket.in(sessionId).emit('joined', {
				userId,
				sessionId,
			});
		} catch (error) {
			socket.emit('error', 'Error joining the session');
			console.error(error);
		}
	});

	socket.on('toRolesScreen', (event) => {
		socket.in(event.sessionId).emit('toRolesScreen', event);
	});

	socket.on('global', (event) => {
		console.log('recieved emit');

		socket.emit('global', event);
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
	socket.on('disconnect', async (event) => {
		const sessionId = '';
		await sessionDetailsModels.findOneAndUpdate(
			{ sessionID: sessionId },
			{
				$set: {
					'userOne.userStatus': 'offline',
					'userTwo.userStatus': 'offline',
				},
			},
		);
		socket.emit('disconnected');
	});
};

export const sendServerInfo = async (event: IEvent): Promise<ServerObject> => {
	const session = await sessionDetailsModels.findOne({
		sessionID: event.sessionId,
	});
	return { userOne: session!.userOne, userTwo: session!.userTwo };
};
