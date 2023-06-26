import { Types } from 'mongoose';

export interface ISmallQuestions {
	question: string;
	answer: string;
	studentAnswer: string;
	questionId: Types.ObjectId;
}
