import { Types } from 'mongoose';
import { ISubQuestion } from './ISubQuestion';

export interface IQuestion {
	teacherId: Types.ObjectId;
	bannerImage: string;
	questionText: string;
	subQuestions: Array<ISubQuestion>;
	smallQuestions: Array<Types.ObjectId>;
}
