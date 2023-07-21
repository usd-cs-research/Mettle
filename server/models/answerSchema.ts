import mongoose, { Schema, model } from 'mongoose';
import { IAnswers } from '../types/models/IAnswers';
import { MiniQuestionTypes } from '../types/ISubtypes';
import { SubQuestionTypes } from '../types/models/IQuestion';
const AnswerSchema = new Schema(
	{
		questionId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		answer: {
			type: String,
			required: true,
		},
	},
	{ _id: false },
);
const FunctionalSchema = new Schema(
	{
		[MiniQuestionTypes.functional_evaluatecheck]: [AnswerSchema],
		[MiniQuestionTypes.functional_evaluatedominant]: [AnswerSchema],
		[MiniQuestionTypes.functional_modelmain]: [AnswerSchema],
		[MiniQuestionTypes.functional_modelprompts]: [AnswerSchema],
		[MiniQuestionTypes.functional_plan]: [AnswerSchema],
	},
	{ _id: false },
);

const QualitativeSchema = new Schema(
	{
		[MiniQuestionTypes.qualitative_evaluatecheck]: [AnswerSchema],
		[MiniQuestionTypes.qualitative_evaluatedominant]: [AnswerSchema],
		[MiniQuestionTypes.qualitative_model]: [AnswerSchema],
		[MiniQuestionTypes.qualitative_plan]: [AnswerSchema],
	},
	{ _id: false },
);

const QuantitativeSchema = new Schema(
	{
		[MiniQuestionTypes.quantitative_evaluatecheck]: [AnswerSchema],
		[MiniQuestionTypes.quantitative_evaluatecomplete]: [AnswerSchema],
		[MiniQuestionTypes.quantitative_model]: [AnswerSchema],
		[MiniQuestionTypes.quantitative_plan]: [AnswerSchema],
	},
	{ _id: false },
);

const EvaluationSchema = new Schema(
	{
		[MiniQuestionTypes.evaluation_evaluation]: [AnswerSchema],
	},
	{ _id: false },
);

const answerSchema = new Schema<IAnswers>({
	sessionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'sessionModel',
		unique: true,
	},
	questionId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'questionModel',
	},
	Answers: {
		[SubQuestionTypes.Funtional]: FunctionalSchema,
		[SubQuestionTypes.Qualitative]: QualitativeSchema,
		[SubQuestionTypes.Quantitative]: QuantitativeSchema,
		[SubQuestionTypes.Calculation]: Schema.Types.Mixed,
		[SubQuestionTypes.Evaluation]: EvaluationSchema,
	},
});

const answerModel = model<IAnswers>('answerModel', answerSchema);

export default answerModel;
