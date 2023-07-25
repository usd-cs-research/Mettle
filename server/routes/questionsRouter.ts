import express from 'express';
import {
	createMainQuestion,
	createSubQuestion,
	getMainQuestionsforStudent,
	getMainQuestionsforTeacher,
	getSubquestions,
	getMainQuestion,
	editMainQuestion,
	getWholeQuestion,
} from '../controllers/questionsController';
import { isAuth, isStudent, isTeacher } from '../middlewares/authorization';
import { fileUpload } from '../middlewares/file-upload';

const questionRouter = express.Router();

questionRouter.post('/create/main', isTeacher, fileUpload, createMainQuestion);

questionRouter.post('/create/sub', isTeacher, createSubQuestion);

questionRouter.get('/main/teacher', isTeacher, getMainQuestionsforTeacher);

questionRouter.get('/main/student', isStudent, getMainQuestionsforStudent);

questionRouter.get('/sub', isAuth, getSubquestions);

questionRouter.post('/edit/main', isTeacher, editMainQuestion);

questionRouter.get('/main', isAuth, getMainQuestion);

questionRouter.get('', isAuth, getWholeQuestion);

export default questionRouter;
