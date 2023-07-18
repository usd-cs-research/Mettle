import { Types } from 'mongoose';
import { SubQuestionTypes } from './IQuestion';

export interface IAnswers {
	sessionId: Types.ObjectId;
	questionId: Types.ObjectId;
	Answers: Array<{
		type: SubQuestionTypes;
		answers: Array<{
			questionId: Types.ObjectId;
			answer: string;
		}>;
	}>;
}
