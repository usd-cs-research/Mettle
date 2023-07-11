import { Schema, model } from 'mongoose';
import { IAnswers } from '../types/models/IAnswers';

const answerSchema = new Schema<Array<IAnswers>>([
	{
		answer: {
			type: String,
			required: true,
		},
		questionId: {
			type: String,
			required: true,
		},
	},
]);

const answerModel = model<Array<IAnswers>>('answerModel', answerSchema);

export default answerModel;
