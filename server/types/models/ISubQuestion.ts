import { ISmallQuestions } from './ISmallQuestions';

export interface ISubQuestion {
	tag: SubQuestionTypes;
	value: string;
	questions: Array<ISmallQuestions>;
}

export enum SubQuestionTypes {
	Funtional = 'functional',
	Qualitative = 'qualitative',
	Calculation = 'calculation',
	Quantitative = 'quantitative',
	Evaluation = 'evaluation',
}
