import express from 'express';
import {
	addQuestiontoSession,
	createSession,
	deleteSession,
	getSessionDetails,
	getStatus,
	listAllSessions,
	saveNotes,
} from '../controllers/sessionController';
import { isStudent } from '../middlewares/authorization';

const sessionRouter = express.Router();

sessionRouter.post('/create', isStudent, createSession);

sessionRouter.get('/details', isStudent, getSessionDetails);

sessionRouter.get('/status', isStudent, getStatus);

sessionRouter.get('/list', isStudent, listAllSessions);

sessionRouter.delete('/delete', isStudent, deleteSession);

sessionRouter.post('/notes', isStudent, saveNotes);

sessionRouter.post('/addQuestion', isStudent, addQuestiontoSession);

export default sessionRouter;
