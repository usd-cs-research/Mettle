import { Types } from 'mongoose';
import { SubQuestionTypes } from './models/ISubQuestion';

export interface IEvent {
	sessionId: string;
	notes: string;
	state: SubQuestionTypes;
	event: object;
	server: ServerObject;
}

export interface ServerObject {
	userOne: {
		userId: Types.ObjectId;
		userRole: string;
	};
	userTwo: {
		userId: Types.ObjectId;
		userRole: string;
	};
}
