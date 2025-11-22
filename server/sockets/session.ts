import { Socket } from 'socket.io';
import sessionDetailsModels from '../models/sessionDetailsSchema';
import sessionModel from '../models/sessionSchema';
import questionModel from '../models/questionSchema';
import answerModel from '../models/answerSchema';
import { IEvent, ServerObject, GeminiQueryEvent } from '../types/IEvent';
import { generateSocraticResponse } from '../services/geminiService';

interface SessionContext {
  question: string;
  userRole: string;
  answers: string[];
}

// Simple rate limiter: userId -> { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // queries per minute
const RESET_TIME = 60 * 1000; // 1 minute

const sanitizeQuery = (query: string): string | null => {
  // Basic check for inappropriate content
  const forbiddenWords = ['hack', 'exploit', 'illegal', 'harm']; // expand as needed
  if (forbiddenWords.some(word => query.toLowerCase().includes(word))) {
    return null;
  }
  return query.trim();
};

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RESET_TIME });
    return true;
  }
  if (entry.count >= RATE_LIMIT) {
    console.warn(`[RateLimit] User ${userId} hit rate limit (${entry.count} requests)`);
    return false;
  }
  entry.count++;
  return true;
};

// Simple cache for session context: key = sessionId-userId, value = {context, timestamp}
const contextCache = new Map<string, { context: SessionContext; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getSessionContext = async (sessionId: string, userId: string): Promise<SessionContext | null> => {
  const cacheKey = `${sessionId}-${userId}`;
  const cached = contextCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.context;
  }

  try {
    const sessionDetails = await sessionDetailsModels.findOne({ sessionID: sessionId }).populate('questionId answers');
    if (!sessionDetails) return null;

    const question = await questionModel.findById(sessionDetails.questionId);
    if (!question) return null;

    const answers = await answerModel.find({ _id: { $in: sessionDetails.answers } });

    // Determine user role
    let userRole = '';
    if (sessionDetails.userOne?.userId.toString() === userId) {
      userRole = sessionDetails.userOne.userRole || 'Driver';
    } else if (sessionDetails.userTwo?.userId.toString() === userId) {
      userRole = sessionDetails.userTwo.userRole || 'Navigator';
    } else {
      return null; // User not in session
    }

    // Summarize answers - for simplicity, join functional/qualitative etc.
    const answerSummaries: string[] = [];
    answers.slice(-5).forEach(answer => { // Limit to last 5 answers
      // Assuming answers have some text fields, but schema is complex
      // For now, just stringify or pick a field
      answerSummaries.push(JSON.stringify(answer)); // TODO: improve summarization
    });

    const context: SessionContext = {
      question: question.question,
      userRole,
      answers: answerSummaries,
    };

    // Cache the context
    contextCache.set(cacheKey, { context, timestamp: Date.now() });

    return context;
  } catch (error) {
    console.error('Error fetching session context:', error);
    return null;
  }
};

export const sessionActivities = (socket: Socket) => {
	socket.on('join', async (event: IEvent) => {
		try {
			//get session Id
			const sessionId =
				event.sessionId?.trim() ||
				(await sessionModel
					.findOne({
						sessionName: event.sessionName,
					})
					.then((id) => {
						return id?._id.toString().trim();
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
				session.userTwo?.userId.toString() !== userId &&
				session.userTwo !== undefined &&
				session.userOne?.userId.toString() !== userId &&
				session.userOne !== undefined
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
			console.log(`${userId} joined ${sessionId}`);
			socket.in(sessionId!).emit('joined', {
				userId,
				sessionId,
			});
		} catch (error) {
			console.error('Error in joining');
			console.error(error);
		}
	});

	socket.on('forward', async (event: IEvent) => {
		if (await checkRoomSizeandDisconnect(socket, event.sessionId)) {
			return;
		}
		socket.in(event.sessionId).emit('forward', event);
	});

	socket.on('role-switch', async (event: IEvent) => {
		if (await checkRoomSizeandDisconnect(socket, event.sessionId)) {
			return;
		}
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
			console.error('Error switching roles');
			console.log(error);
		}
	});
	socket.on('exit-session', async () => {
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
						$unset: {
							'userOne.socketId': 1,
							'userTwo.socketId': 1,
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
						},
						$unset: {
							'userOne.socketId': 1,
							'userTwo.socketId': 1,
						},
					},
				);
			const sessionId =
				sessionDetailsOne?.sessionID?.toString() ||
				sessionDetailsTwo?.sessionID?.toString();
			//@ts-ignore
			socket.in(sessionId).emit('session-offline');
			//@ts-ignore
			await socket.leave(sessionId);
		} catch (error) {
			console.error('Error in exiting');
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
						$unset: {
							'userOne.socketId': 1,
							'userTwo.socketId': 1,
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
						},
						$unset: {
							'userOne.socketId': 1,
							'userTwo.socketId': 1,
						},
					},
				);
			const sessionId =
				sessionDetailsOne?.sessionID?.toString() ||
				sessionDetailsTwo?.sessionID?.toString();
			//@ts-ignore
			socket.in(sessionId).emit('session-offline');
			//@ts-ignore
			await socket.leave(sessionId);
			console.log(`user disconnected`);
		} catch (error) {
			console.error('Error in disconnecting');
			console.log(error);
		}
	});
	socket.on('global-forward', async (event) => {
		socket.emit('global-forward', event);
	});

	socket.on('gemini-query', async (event: GeminiQueryEvent) => {
		try {
			const { sessionId, userId, query } = event;
			if (!sessionId || !userId || !query) {
				socket.emit('gemini-error', { message: 'Missing required fields' });
				return;
			}

			// Rate limiting
			if (!checkRateLimit(userId)) {
				socket.emit('gemini-error', { message: 'Rate limit exceeded. Try again later.' });
				return;
			}

			// Validate user is in session
			const sessionDetails = await sessionDetailsModels.findOne({ sessionID: sessionId });
			if (!sessionDetails || 
				(sessionDetails.userOne?.userId.toString() !== userId && sessionDetails.userTwo?.userId.toString() !== userId)) {
				socket.emit('gemini-error', { message: 'User not authorized for this session' });
				return;
			}

			const sanitizedQuery = sanitizeQuery(query);
			if (!sanitizedQuery) {
				socket.emit('gemini-error', { message: 'Query contains inappropriate content' });
				return;
			}

			const context = await getSessionContext(sessionId, userId);
			if (!context) {
				socket.emit('gemini-error', { message: 'Failed to fetch session context' });
				return;
			}

			const response = await generateSocraticResponse(sanitizedQuery, context);

			// Emit response back to the user (or room? For now, to user)
			socket.emit('gemini-response', { response, query: sanitizedQuery });
		} catch (error) {
			console.error('Error in gemini-query:', error);
			socket.emit('gemini-error', { message: 'Internal server error' });
		}
	});
};

const checkRoomSizeandDisconnect = async (
	socket: Socket,
	sessionId: string,
) => {
	const numberOfusers = socket.rooms.size;
	console.log('Number of users ', numberOfusers);
	if (numberOfusers !== 2) {
		await sessionDetailsModels.updateOne(
			{ sessionID: sessionId },
			{
				$set: {
					'userTwo.userStatus': 'offline',
					'userOne.userStatus': 'offline',
				},
				$unset: {
					'userOne.socketId': 1,
					'userTwo.socketId': 1,
				},
			},
		);
		socket.in(sessionId).emit('session-offline');
		socket.emit('global-session-offline', { sessionId });
		return true;
	}
	return false;
};

export const sendServerInfo = async (event: IEvent): Promise<ServerObject> => {
	const session = await sessionDetailsModels.findOne({
		sessionID: event.sessionId,
	});
	return { userOne: session!.userOne, userTwo: session!.userTwo };
};
