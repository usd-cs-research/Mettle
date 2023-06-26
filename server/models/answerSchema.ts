import mongoose, { Schema, model } from 'mongoose';
import { ISmallQuestions } from '../types/models/ISmallQuestions';

const answerSchema = new Schema<Array<ISmallQuestions>>([
	{
		studentAnswer: {
			type: String,
			required: true,
		},
		questionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'smallQuestionsModel',
		},
	},
]);

const answerModel = model<Array<ISmallQuestions>>('answerModel', answerSchema);

export default answerModel;
