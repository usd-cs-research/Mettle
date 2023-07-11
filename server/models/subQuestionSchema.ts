import { Schema, model } from 'mongoose';
import { SubTypeQuestions } from '../types/models/ISubQuestion';

const subQuestions = new Schema<SubTypeQuestions>({
	subtype: {
		type: String,
	},
	subQuestions: [
		{
			type: {
				question: String,
				hint: String,
			},
		},
	],
});

const subQuestionsModel = model<SubTypeQuestions>(
	'SubQuestionsModel',
	subQuestions,
);

export default subQuestionsModel;
