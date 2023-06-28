import { Types } from 'mongoose';

export interface IQuestion {
	teacherId: Types.ObjectId;
	bannerImage: string;
	questionText: string;
	subQuestions: Array<Types.ObjectId>;
	status: string;
}
