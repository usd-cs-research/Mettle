import { Types } from 'mongoose';
import { SubQuestionTypes } from './IQuestion';
import { MiniQuestionTypes } from '../ISubtypes';

export interface IAnswers {
	sessionId: Types.ObjectId;
	questionId: Types.ObjectId;
	Answers: {
		[SubQuestionTypes.Funtional]: {
			[MiniQuestionTypes.functional_evaluatecheck]: any;
			[MiniQuestionTypes.functional_evaluatedominant]: any;
			[MiniQuestionTypes.functional_modelmain]: any;
			[MiniQuestionTypes.functional_modelprompts]: any;
			[MiniQuestionTypes.functional_plan]: any;
		};
		[SubQuestionTypes.Qualitative]: {
			[MiniQuestionTypes.qualitative_evaluatecheck]: any;
			[MiniQuestionTypes.qualitative_evaluatedominant]: any;
			[MiniQuestionTypes.qualitative_model]: any;
			[MiniQuestionTypes.qualitative_plan]: any;
		};
		[SubQuestionTypes.Quantitative]: {
			[MiniQuestionTypes.quantitative_evaluatecheck]: any;
			[MiniQuestionTypes.quantitative_evaluatecomplete]: any;
			[MiniQuestionTypes.quantitative_model]: any;
			[MiniQuestionTypes.quantitative_plan]: any;
		};
		[SubQuestionTypes.Calculation]: any;
		[SubQuestionTypes.Evaluation]: any;
	};
}
