import mongoose, { Schema, model } from 'mongoose';
import { ISessionDetails } from '../types/models/ISessionDetails';

const sessionDetailsSchema = new Schema<ISessionDetails>({
	sessionID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Session',
	},
	userOne: {
		type: {
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			userRole: String,
			userStatus: String,
		},
	},
	userTwo: {
		type: {
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			userRole: String,
			userStatus: String,
		},
	},
	notepad: { type: String, required: false },
	state: {
		type: String,
		required: false,
	},
	answers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'answerModel',
			required: false,
		},
	],
	questionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'questionModel',
	},
});

const sessionDetailsModels = model<ISessionDetails>(
	'SessionDetails',
	sessionDetailsSchema,
);

export default sessionDetailsModels;
