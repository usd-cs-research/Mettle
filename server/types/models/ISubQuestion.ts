import { ISmallQuestions } from './ISmallQuestions';

export interface ISubQuestion {
	tag: string;
	value: string;
	questions: Array<ISmallQuestions>;
}

const obj = {
	questionText: '',
	bannerImage: '',
	teacherId: '',
	subQuestions: [
		{
			tag: '',
			value: '',
			questions: [
				{
					question: '',
					answer: '',
					studentAnswer: '',
				},
				{
					question: '',
					answer: '',
					studentAnswer: '',
				},
			],
		},
		{
			tag: '',
			value: '',
			questions: [
				{
					question: '',
					answer: '',
					studentAnswer: '',
				},
				{
					question: '',
					answer: '',
					studentAnswer: '',
				},
			],
		},
	],
};

console.log(obj);
