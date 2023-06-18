import mongoose, { Schema, model } from 'mongoose';
import { ISession } from '../types/models/ISession';

const sessionSchema = new Schema<ISession>({
	creator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	sessionName: {
		type: String,
		required: true,
	},
});

const sessionModel = model<ISession>('Session', sessionSchema);

export default sessionModel;
