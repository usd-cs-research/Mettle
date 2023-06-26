import mongoose, { Schema, model } from 'mongoose';
import { IQuestion } from '../types/models/IQuestion';

const questionSchema = new Schema<IQuestion>({
	teacherId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	questionText: {
		type: String,
		required: true,
	},
	bannerImage: {
		type: String,
		required: false,
	},
	subQuestions: [
		{
			type: {
				tag: String,
				value: String,
				questions: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'smallQuestionsModel',
					},
				],
			},
		},
	],
	smallQuestions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'smallQuestionsModel',
		},
	],
});

const questionModel = model<IQuestion>('questionModel', questionSchema);

export default questionModel;
