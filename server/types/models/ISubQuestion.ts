export interface SubTypeQuestions {
	subtype: string;
	subQuestions: Array<Questions>;
}

export interface Questions {
	question: string;
	id: string;
	hint?: string;
}
