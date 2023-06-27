import express from 'express';
import {
	createMainQuestion,
	createSubQuestion,
	getMainQuestions,
	getMainQuestionsforTeacher,
	getSubquestions,
} from '../controllers/questionsController';
import { isAuth, isStudent, isTeacher } from '../middlewares/authorization';

const questionRouter = express.Router();

questionRouter.post('/create/main', isTeacher, createMainQuestion);

questionRouter.post('/create/sub', isTeacher, createSubQuestion);

questionRouter.get('/main/teacher', isTeacher, getMainQuestionsforTeacher);

questionRouter.get('/main/student', isStudent, getMainQuestions);

questionRouter.get('/sub', isAuth, getSubquestions);

questionRouter.post('/edit/main')

questionRouter.post('/edit/sub')

export default questionRouter;
