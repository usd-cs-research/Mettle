import { RequestHandler } from 'express';
import { Authorized } from '../types/jwt';
import sessionModel from '../models/sessionSchema';
import sessionDetailsModels from '../models/sessionDetailsSchema';
import { IError } from '../types/IError';

export const createSession: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const creator = req.user?.id;
		const sessionName = req.body.sessionName;

		const session = new sessionModel({ creator, sessionName });
		await session.save();
		res.status(200).json({ sessionId: session._id });
	} catch (error) {
		next(error);
	}
};

export const getSessionDetails: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const sessionId = req.query.sessionId;
		const session = await sessionDetailsModels.find({
			sessionID: sessionId,
		});
		if (session.length === 0) {
			throw new IError('Invalid sessionId', 404);
		}
		res.status(200).json(session);
	} catch (error) {
		next(error);
	}
};

export const listAllSessions: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const userId = req.user?.id;
		const sessions = await sessionDetailsModels.find({
			$or: [{ userOne: userId }, { userTwo: userId }],
		});
		res.status(200).json(sessions);
	} catch (error) {
		next(error);
	}
};

export const deleteSession: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const sessionId = req.query.sessionId;
		const session = await sessionModel.findById(sessionId);
		if (session?.creator != req.user?.id) {
			throw new IError('Only the creator can delete the session', 401);
		}
		await sessionModel.findByIdAndDelete(sessionId);
		await sessionDetailsModels.findOneAndDelete({ sessionID: sessionId });
	} catch (error) {
		next(error);
	}
};
