import express from 'express';
import {
	answerQuestion,
	fetchAllAnswers,
	fetchAnswers,
} from '../controllers/answerController';
import { isAuth, isStudent } from '../middlewares/authorization';

const answerRouter = express.Router();

answerRouter.get('', isAuth, fetchAllAnswers);

answerRouter.get('/type', isStudent, fetchAnswers);

answerRouter.post('', isStudent, answerQuestion);

export default answerRouter;
