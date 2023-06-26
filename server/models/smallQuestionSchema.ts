import { Schema, model } from 'mongoose';
import { ISmallQuestions } from '../types/models/ISmallQuestions';

const smallQuestions = new Schema<ISmallQuestions>({
	question: {
		type: String,
		required: true,
	},
	answer: {
		type: String,
		required: true,
	},
});

const smallQuestionsModel = model<ISmallQuestions>(
	'smallQuestionsModel',
	smallQuestions,
);

export default smallQuestionsModel;
