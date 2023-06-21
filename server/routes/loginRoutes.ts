import express from 'express';
import {
	loginController,
	signupController,
} from '../controllers/loginController';

const loginRouter = express.Router();

loginRouter.post('/login', loginController);

loginRouter.post('/signup', (req,res,next)=>{
	console.log("middle");
	next();
},signupController);

export default loginRouter;
