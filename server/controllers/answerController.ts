import { RequestHandler } from 'express';
import { Authorized } from '../types/jwt';
import answerModel from '../models/answerSchema';
import { IAnswers } from '../types/models/IAnswers';
import { IError } from '../types/IError';

export const answerQuestion: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const { questionId, answer, sessionId, type } = req.body;
		const answers = await answerModel.findOne({ sessionId });
		if (!answers) {
			throw new IError('No answer found', 404);
		}
		let updated: boolean;
		answers?.Answers.forEach((smallanswer) => {
			if (smallanswer.type === type) {
				smallanswer.answers.forEach((minianswer: any) => {
					if (minianswer.questionId == questionId) {
						minianswer.answer = answer;
						updated = true;
					}
				});
				if (!updated) {
					smallanswer.answers.push({ answer, questionId });
				}
			}
		});
		console.log(answers);
		const newAnswer: IAnswers = {
			questionId,
			sessionId,
			Answers: answers!.Answers,
		};
		await answerModel.findOneAndUpdate({ sessionId }, newAnswer, {
			upsert: true,
			new: true,
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
		const filteredAnswers = answers?.Answers.filter((answer) => {
			return answer.type === type;
		});
		res.status(200).json({ answers: filteredAnswers });
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
