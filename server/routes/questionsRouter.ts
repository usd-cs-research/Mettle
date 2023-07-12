import express from 'express';
import {
	createMainQuestion,
	createSubQuestion,
	editSubQuestion,
	getMainQuestionsforStudent,
	getMainQuestionsforTeacher,
	getSubquestions,
	getMainQuestion,
} from '../controllers/questionsController';
import { isAuth, isStudent, isTeacher } from '../middlewares/authorization';
import { fileUpload } from '../middlewares/image-upload';

const questionRouter = express.Router();

questionRouter.post('/create/main', isTeacher, fileUpload, createMainQuestion);

questionRouter.post('/create/sub', isTeacher, createSubQuestion);

questionRouter.get('/main/teacher', isTeacher, getMainQuestionsforTeacher);

questionRouter.get('/main/student', isStudent, getMainQuestionsforStudent);

questionRouter.get('/sub', isAuth, getSubquestions);

questionRouter.post('/edit/main', isTeacher, editSubQuestion);

questionRouter.post('/edit/sub', isTeacher, editSubQuestion);

questionRouter.get('/main', isStudent, getMainQuestion);

export default questionRouter;
