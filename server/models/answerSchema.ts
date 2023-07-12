import mongoose, { Schema, model } from 'mongoose';
import { IAnswers } from '../types/models/IAnswers';

const answerSchema = new Schema<IAnswers>({
	sessionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'sessionModel',
	},
	Answers: [
		{
			type: {
				answer: String,
				questionId: { type: mongoose.Schema.Types.ObjectId, unique: true },
			},
		},
	],
});

const answerModel = model<Array<IAnswers>>('answerModel', answerSchema);

export default answerModel;
