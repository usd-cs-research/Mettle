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
		const answers = await answerModel.findOne({ sessionId });
		if (!sessionId && !type && !subtype) {
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
		if (!answers) {
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
