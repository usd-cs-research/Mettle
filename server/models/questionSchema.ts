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
		unique: true,
	},
	bannerImage: {
		type: String,
		required: false,
	},
	subQuestions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'subQuestionsModel',
		},
	],
});

const questionModel = model<IQuestion>('questionModel', questionSchema);

export default questionModel;
