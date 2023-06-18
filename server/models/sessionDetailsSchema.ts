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
		},
	},
	userTwo: {
		type: {
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			userRole: String,
		},
	},
	notepad: { type: String, required: false },
	state: {
		type: String,
		required: false,
	},
});

const sessionDetailsModels = model<ISessionDetails>(
	'SessionDetails',
	sessionDetailsSchema,
);

export default sessionDetailsModels;
