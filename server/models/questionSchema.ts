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
	},
	image: {
		type: String,
		required: false,
		default:
			'https://static.semrush.com/cdn-cgi/image/width%3D472/blog/uploads/media/28/d5/28d52662d5d906dd0499676fb0a8bb43/How-to-Do-a-Reverse-Image-Google-Search-Desktop-and-Mobile_big.png',
	},
	info: {
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
