import express from 'express';
import {
	createSession,
	deleteSession,
	getSessionDetails,
	getStatus,
	listAllSessions,
} from '../controllers/sessionController';
import { isStudent } from '../middlewares/authorization';

const sessionRouter = express.Router();

sessionRouter.post('/create', isStudent, createSession);

sessionRouter.get('/details', isStudent, getSessionDetails);

sessionRouter.get('/status', isStudent, getStatus);

sessionRouter.get('/list', isStudent, listAllSessions);

sessionRouter.delete('/delete', isStudent, deleteSession);

sessionRouter.post('/notes', isStudent);

export default sessionRouter;
