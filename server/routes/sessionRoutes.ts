import express from 'express';
import {
	createSession,
	deleteSession,
	getSessionDetails,
	listAllSessions,
} from '../controllers/sessionController';
import { isStudent } from '../middlewares/authorization';

const sessionRouter = express.Router();

sessionRouter.post('/create', isStudent, createSession);

sessionRouter.get('/details', isStudent, getSessionDetails);

sessionRouter.get('/list', isStudent, listAllSessions);

sessionRouter.delete('/delete', isStudent, deleteSession);

export default sessionRouter;
