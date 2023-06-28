import mongoose, { Schema, model } from 'mongoose';
import { ISubQuestion } from '../types/models/ISubQuestion';

const subQuestions = new Schema<ISubQuestion>({
	tag: {
		type: String,
		required: true,
		immutable: true,
	},
	value: {
		type: String,
		required: true,
	},
	questions: [
		{
			type: {
				questionId: {
					type: mongoose.Schema.Types.ObjectId,
					default: new mongoose.Types.ObjectId(),
				},
				question: String,
				answer: String,
			},
		},
	],
});

const subQuestionsModel = model<ISubQuestion>(
	'subQuestionsModel',
	subQuestions,
);

export default subQuestionsModel;
