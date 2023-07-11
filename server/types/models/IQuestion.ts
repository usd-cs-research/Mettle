import { Types } from 'mongoose';

export interface IQuestion {
	teacherId: Types.ObjectId;
	image: string;
	question: string;
	subQuestions: Array<SubQuestions>;
	status: string;
}

export interface SubQuestions {
	type: SubQuestionTypes;
	question: string;
	SubQuestions: Array<Types.ObjectId>;
}

export enum SubQuestionTypes {
	Funtional = 'functional',
	Qualitative = 'qualitative',
	Calculation = 'calculation',
	Quantitative = 'quantitative',
	Evaluation = 'evaluation',
}
