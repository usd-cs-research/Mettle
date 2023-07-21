import mongoose, { Schema, model } from 'mongoose';
import { IAnswers } from '../types/models/IAnswers';

const answerSchema = new Schema<IAnswers>({
	sessionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'sessionModel',
		unique: true,
	},
	questionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'questionModel',
	},
	Answers: [
		{
			type: {
				type: String,
			},
		},
	],
});

const answerModel = model<IAnswers>('answerModel', answerSchema);

export default answerModel;
