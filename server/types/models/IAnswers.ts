import { Types } from 'mongoose';
import { SubQuestionTypes } from './IQuestion';
import { MiniQuestionTypes } from '../ISubtypes';

export interface IAnswers {
	sessionId: Types.ObjectId;
	questionId: Types.ObjectId;
	Answers: {
		[SubQuestionTypes.Funtional]: {
			[MiniQuestionTypes.functional_evaluatecheck]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
			[MiniQuestionTypes.functional_evaluatedominant]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
			[MiniQuestionTypes.functional_modelmain]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
			[MiniQuestionTypes.functional_modelprompts]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
			[MiniQuestionTypes.functional_plan]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
		};
		[SubQuestionTypes.Qualitative]: {
			[MiniQuestionTypes.qualitative_evaluatecheck]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
			[MiniQuestionTypes.qualitative_evaluatedominant]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
			[MiniQuestionTypes.qualitative_model]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
			[MiniQuestionTypes.qualitative_plan]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
		};
		[SubQuestionTypes.Quantitative]: {
			[MiniQuestionTypes.quantitative_evaluatecheck]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
			[MiniQuestionTypes.quantitative_evaluatecomplete]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
			[MiniQuestionTypes.quantitative_model]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
			[MiniQuestionTypes.quantitative_plan]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
		};
		[SubQuestionTypes.Calculation]: any;
		[SubQuestionTypes.Evaluation]: {
			[MiniQuestionTypes.evaluation_evaluation]: Array<{
				questionId: Types.ObjectId;
				answer: string;
			}>;
		};
	};
}
