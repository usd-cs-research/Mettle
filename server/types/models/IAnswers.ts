import { Types } from 'mongoose';

export interface IAnswers {
	sessionId: Types.ObjectId;
	Answers: Array<{
		answer: string;
		questionId: Types.ObjectId;
	}>;
}
