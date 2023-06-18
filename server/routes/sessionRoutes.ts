import express from 'express';
import {
	createSession,
	deleteSession,
	getSessionDetails,
	listAllSessions,
} from '../controllers/sessionController';
import { isAuth } from '../middlewares/authorization';

const sessionRouter = express.Router();

sessionRouter.post('/create', isAuth, createSession);

sessionRouter.get('/details', isAuth, getSessionDetails);

sessionRouter.get('/list', isAuth, listAllSessions);

sessionRouter.delete('/delete', isAuth, deleteSession);

export default sessionRouter;
