import express from 'express';
import {
	createMainQuestion,
	createSubQuestion,
	editSubQuestion,
	getMainQuestionsforStudent,
	getMainQuestionsforTeacher,
	getSubquestions,
} from '../controllers/questionsController';
import { isAuth, isStudent, isTeacher } from '../middlewares/authorization';

const questionRouter = express.Router();

questionRouter.post('/create/main', createMainQuestion);

questionRouter.post('/create/sub', createSubQuestion);

questionRouter.get('/main/teacher', isTeacher, getMainQuestionsforTeacher);

questionRouter.get('/main/student', isStudent, getMainQuestionsforStudent);

questionRouter.get('/sub', isAuth, getSubquestions);

questionRouter.post('/edit/main', isTeacher, editSubQuestion);

questionRouter.post('/edit/sub', isTeacher, editSubQuestion);

export default questionRouter;
