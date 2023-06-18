import { RequestHandler } from 'express';
import { IError } from '../types/IError';
import { Authorized } from '../types/jwt';
import userModel from '../models/userSchema';
import { generateToken } from '../middlewares/authorization';

export const loginController: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const email = req.body.email;
		// const password = req.body.password;
		const user = await userModel.findOne({ email });
		//compare password
		res.status(200).json({
			token: generateToken(email, user!.designation),
		});
	} catch (error) {
		next(error);
	}
};

export const signupController: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const email = req.body.email;
		const name = req.body.name;
		const password = req.body.password;
		const designation = req.body.designation;
		const key = req.body.key;
		if (key !== process.env.ADMIN_KEY) {
			return new IError('Wrong admin key', 401);
		}
		const hashedPassword = password || '';
		await new userModel({
			name,
			email,
			password: hashedPassword,
			designation,
		}).save();
		res.status(200).json({ token: generateToken(email, designation) });
	} catch (error) {
		next(error);
	}
};
