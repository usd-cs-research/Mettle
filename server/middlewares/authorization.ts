import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IError } from '../types/IError';

export function isAuth(
	req: Request,
	res: Response,
	next: NextFunction,
): unknown {
	const token = req.header('Authorization')?.replace('Bearer ', '');
	if (!token) {
		return new IError('Token not found', 401);
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			id: string;
			designation: string;
			_v: string;
		};
		//@ts-ignore
		req.user = decoded;
		next();
	} catch (e) {
		throw new IError("Invalid token",401);
	}
}
/**
 * 
 * @param id userId of the user
 * @param designation designation of the user as in Teacher or student
 * @returns token valid for 7 days 
 */
export function generateToken(id: string, designation: string): string {
	const user = { id: id, designation: designation };
	const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '7d' });
	return token;
}
