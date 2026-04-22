import { RequestHandler } from 'express';
import { Authorized } from '../types/jwt';
import answerModel from '../models/answerSchema';
import sessionDetailsModels from '../models/sessionDetailsSchema';
import { IError } from '../types/IError';
import { SubQuestionTypes } from '../types/models/IQuestion';
import { MiniQuestionTypes } from '../types/ISubtypes';

export const answerQuestion: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const { answers, sessionId, type, subtype } = req.body;
		if (!Object.values(SubQuestionTypes).includes(type)) {
			throw new IError('Invalid tag', 401);
		}
		if (!Object.values(MiniQuestionTypes).includes(subtype)) {
			throw new IError('Invalid subtype', 401);
		}
		const prevAnswers = await answerModel.findOne({ sessionId });
		if (!prevAnswers) {
			throw new IError('Answers not found', 404);
		}
		if (prevAnswers.Answers == undefined) {
			//@ts-ignore
			prevAnswers.Answers = {};
		}
		// Initialize the missing path if it doesn't exist
		if (!prevAnswers.Answers[type as SubQuestionTypes]) {
			prevAnswers.Answers[type as SubQuestionTypes] = {};
		}

		if (!prevAnswers.Answers[type as SubQuestionTypes][subtype]) {
			prevAnswers.Answers[type as SubQuestionTypes][subtype] = [];
		}
		prevAnswers.Answers[type as SubQuestionTypes][subtype].pop();
		prevAnswers.Answers[type as SubQuestionTypes][subtype].push(answers);
		await answerModel.updateOne({ sessionId }, prevAnswers, {
			new: true,
			upsert: true,
		});
		res.status(200).json({ message: 'Answer saved successfully' });
	} catch (error) {
		next(error);
	}
};

export const fetchAnswers: RequestHandler = async (req, res, next) => {
	try {
		const { sessionId, type, subtype } = req.query;
		
		if (!sessionId || !type || !subtype) {
			throw new IError('Invalid query params', 401);
		}
		if (
			!Object.values(SubQuestionTypes).includes(type as SubQuestionTypes)
		) {
			throw new IError('Invalid tag', 401);
		}
		if (
			!Object.values(MiniQuestionTypes).includes(
				subtype as MiniQuestionTypes,
			)
		) {
			throw new IError('Invalid subtype', 401);
		}

		// Enhanced sessionId lookup - try multiple strategies
		let actualSessionId = sessionId;
		
		// First, try to find answers directly with provided sessionId
		let answers = await answerModel.findOne({ sessionId: sessionId });
		
		// If not found, check if the provided sessionId is a SessionDetails _id
		if (!answers) {
			try {
				const sessionDetails = await sessionDetailsModels.findById(sessionId);
				if (sessionDetails?.sessionID) {
					actualSessionId = sessionDetails.sessionID.toString();
					answers = await answerModel.findOne({ sessionId: actualSessionId });
					console.log('🎯 Answer lookup with sessionID from details:', actualSessionId, 'Result:', !!answers);
				}
			} catch (error) {
				console.log('❌ Error looking up session details:', (error as Error).message);
			}
		}

		// If still not found, try the reverse - maybe sessionId is the main session ID
		if (!answers) {
			try {
				const sessionDetails = await sessionDetailsModels.findOne({ sessionID: sessionId });
				if (sessionDetails?._id) {
					actualSessionId = sessionDetails._id.toString();
					answers = await answerModel.findOne({ sessionId: actualSessionId });
					console.log('🎯 Answer lookup with sessionDetails _id:', actualSessionId, 'Result:', !!answers);
				}
			} catch (error) {
				console.log('❌ Error with reverse lookup:', (error as Error).message);
			}
		}

		if (!answers) {
			console.log('❌ No answers found for any sessionId variant');
			throw new IError('Answers not found', 404);
		}

		let response;
		if (
			answers.Answers == undefined ||
			answers.Answers[type as SubQuestionTypes] == undefined ||
			answers.Answers[type as SubQuestionTypes][
				subtype as MiniQuestionTypes
			] == undefined
		) {
			response = [];
		} else {
			response =
				answers.Answers[type as SubQuestionTypes][
					subtype as MiniQuestionTypes
				];
		}
		res.status(200).json({
			answers: response,
		});
	} catch (error) {
		next(error);
	}
};

export const fetchAllAnswers: RequestHandler = async (req, res, next) => {
	try {
		const { sessionId } = req.body;
		const answers = await answerModel.findOne({ sessionId });
		res.status(200).json({ answers });
	} catch (error) {
		next(error);
	}
};
