import mongoose, { Schema, model } from 'mongoose';
import { IAnswers } from '../types/models/IAnswers';
import { MiniQuestionTypes } from '../types/ISubtypes';
import { SubQuestionTypes } from '../types/models/IQuestion';

const FunctionalSchema = new Schema(
	{
		[MiniQuestionTypes.functional_evaluatecheck]: Schema.Types.Mixed,
		[MiniQuestionTypes.functional_evaluatedominant]: Schema.Types.Mixed,
		[MiniQuestionTypes.functional_modelmain]: Schema.Types.Mixed,
		[MiniQuestionTypes.functional_modelprompts]: Schema.Types.Mixed,
		[MiniQuestionTypes.functional_plan]: Schema.Types.Mixed,
	},
	{ _id: false },
);

const QualitativeSchema = new Schema(
	{
		[MiniQuestionTypes.qualitative_evaluatecheck]: Schema.Types.Mixed,
		[MiniQuestionTypes.qualitative_evaluatedominant]: Schema.Types.Mixed,
		[MiniQuestionTypes.qualitative_model]: Schema.Types.Mixed,
		[MiniQuestionTypes.qualitative_plan]: Schema.Types.Mixed,
	},
	{ _id: false },
);

const QuantitativeSchema = new Schema(
	{
		[MiniQuestionTypes.quantitative_evaluatecheck]: Schema.Types.Mixed,
		[MiniQuestionTypes.quantitative_evaluatecomplete]: Schema.Types.Mixed,
		[MiniQuestionTypes.quantitative_model]: Schema.Types.Mixed,
		[MiniQuestionTypes.quantitative_plan]: Schema.Types.Mixed,
	},
	{ _id: false },
);

const EvaluationSchema = new Schema(
	{
		[MiniQuestionTypes.evaluation_evaluation]: Schema.Types.Mixed,
		[MiniQuestionTypes.evaluation_map]: Schema.Types.Mixed,
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
