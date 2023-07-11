import mongoose, { Schema, model } from 'mongoose';
import { IQuestion } from '../types/models/IQuestion';

const questionSchema = new Schema<IQuestion>({
	teacherId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	question: {
		type: String,
		required: true,
		default: 'Untitled',
	},
	image: {
		type: String,
		required: false,
	},
	subQuestions: [
		{
			type: {
				SubQuestions: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'SubQuestionsModel',
					},
				],
				question: String,
				tag: String,
			},
		},
	],
	status: {
		type: String,
		required: true,
		default: 'incomplete',
	},
});

const questionModel = model<IQuestion>('questionModel', questionSchema);

export default questionModel;
