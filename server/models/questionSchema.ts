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
			validate: {
				validator: function (arr: string[]) {
					console.log('here2');
					return arr.length <= 5;
				},
				message: 'myArray must have at most 5 elements',
			},
		},
	],
	status: { type: String, default: 'incomplete' },
});

questionSchema.pre('save', function (next) {
	if (this.subQuestions.length == 5) {
		this.status = 'complete';
		console.log('here');
	}
	next();
});

const questionModel = model<IQuestion>('questionModel', questionSchema);

export default questionModel;
