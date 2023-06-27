import { RequestHandler } from 'express';
import subQuestionsModel from '../models/subQuestionSchema';
import { Authorized } from '../types/jwt';
import questionModel from '../models/questionSchema';
import { IError } from '../types/IError';

export const createMainQuestion: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	const { questionText, bannerImage, subQuestions } = req.body;
	const teacherId = req.user?.id;
	const question = new questionModel({
		teacherId,
		questionText,
		bannerImage,
		subQuestions,
	});
	await question.save();
};

export const createSubQuestion: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const { tag, value, questions } = req.body;
		const question = new subQuestionsModel({ tag, value, questions });
		await question.save();
	} catch (error) {
		next(error);
	}
};

export const getMainQuestions: RequestHandler = (req, res, next) => {
	try {
		const questions = questionModel.find();
		res.status(200).json({ questions });
	} catch (error) {
		next(error);
	}
};

export const getMainQuestionsforTeacher: RequestHandler = (
	req: Authorized,
	res,
	next,
) => {
	try {
		const teacherId = req.user?.id;
		const questions = questionModel.find({ teacherId });
		res.status(200).json({ questions });
	} catch (error) {
		next(error);
	}
};

export const getSubquestions: RequestHandler = (req, res, next) => {
	try {
		const questionId = req.query.questionId;
		if (!questionId) {
			throw new IError('No  question Id', 404);
		}
		const subQuestions = questionModel
			.findById(questionId)
			.populate('subQuestions');
		res.status(200).json(subQuestions);
	} catch (error) {
		next(error);
	}
};

export const editMainQuestion: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const questionId = req.query.questionId;
		const { questionText, bannerImage } = req.body;
		await questionModel.findByIdAndUpdate(questionId, {
			questionText,
			bannerImage,
		});
		res.status(200).json({ message: 'Success' });
	} catch (error) {
		next(error);
	}
};

export const editSubQuestion: RequestHandler = (
	req: Authorized,
	res,
	next,
) => {};
