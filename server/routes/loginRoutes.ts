import express from 'express';
import {
	loginController,
	signupController,
} from '../controllers/loginController';

const loginRouter = express.Router();

loginRouter.post('/login', loginController);

loginRouter.post('/signup',signupController);

export default loginRouter;
