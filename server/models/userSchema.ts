import { Schema, model } from 'mongoose';
import { IUser } from '../types/models/IUser';

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		designation: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	},
);

const userModel = model<IUser>('User', userSchema);

export default userModel;
