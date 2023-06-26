import { Types } from 'mongoose';

export interface ISessionDetails {
	sessionID: Types.ObjectId;
	userOne: UserDetails;
	userTwo: UserDetails;
	notepad: string;
	state: string;
	answers: Array<Types.ObjectId>;
}

export interface UserDetails {
	userRole: string;
	userId: Types.ObjectId;
}
