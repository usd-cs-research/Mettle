import { RequestHandler } from 'express';
import { IError } from '../types/IError';
import { Authorized } from '../types/jwt';
import userModel from '../models/userSchema';
import { generateToken } from '../middlewares/authorization';
import bcrypt from 'bcrypt';

export const loginController: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	try {
		const email = req.body.email;
		const password = req.body.password;
		const user = await userModel.findOne({ email });
		if (user === null) {
			throw new IError('Invalid email ID', 404);
		}

		if (await bcrypt.compare(user.password, password)) {
			throw new IError('Invalid password', 401);
		}
		res.status(200).json({
			token: generateToken(user._id.toString(), user!.designation),
			userId: user._id,
			designation: user.designation,
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
		const adminKey = req.body.adminKey;
		switch (designation) {
			case 'teacher':
				if (adminKey !== process.env.TEACHER_ADMIN_KEY) {
					return new IError('Invalid Admin Key', 401);
				}
				break;
			case 'student':
				if (adminKey !== process.env.STUDENT_ADMIN_KEY) {
					return new IError('Inavlid Admin KEy', 401);
				}
				break;
			default:
				return new IError('Invalid designation sent by client', 500);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new userModel({
			name,
			email,
			password: hashedPassword,
			designation,
		});
		user.save();
		res.status(200).json({
			token: generateToken(user._id.toString(), designation),
			userId: user._id,
			designation: designation,
		});
	} catch (error) {
		next(error);
	}
};
