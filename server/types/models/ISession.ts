import { Types } from 'mongoose';

export interface ISession {
	_id: Types.ObjectId;
	creator: Types.ObjectId; // The user who created the session
	sessionName: string;
}
