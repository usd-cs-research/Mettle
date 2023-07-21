import { RequestHandler } from 'express';
import { Authorized } from '../types/jwt';
import answerModel from '../models/answerSchema';
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
		prevAnswers.Answers.functional.functional_evaluatecheck.answers =
			answers;
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
		const { sessionId, type } = req.body;
		const answers = await answerModel.findOne({ sessionId });
		if (!Object.values(SubQuestionTypes).includes(type)) {
			throw new IError('Invalid tag', 401);
		}
		if (!answers) {
			throw new IError('Answers not found', 404);
		}
		//@ts-ignore
		res.status(200).json({ answers: answers.Answers[`${type}`] });
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
