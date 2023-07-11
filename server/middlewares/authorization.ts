import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IError } from '../types/IError';

export function isStudent(
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
		};
		if (decoded.designation !== 'student') {
			throw new IError('Cannot access this feature', 401);
		}
		//@ts-ignore
		req.user = decoded;
		next();
	} catch (e) {
		throw new IError('Invalid token', 401);
	}
}

export function isTeacher(
	req: Request,
	res: Response,
	next: NextFunction,
): unknown {
	if (!req.header('Authorization')) {
		throw new IError('Authorization Header must be set', 401);
	}
	const token = req.header('Authorization')?.replace('Bearer ', '');
	if (!token) {
		return new IError('Token not found', 401);
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			id: string;
			designation: string;
		};
		if (decoded.designation !== 'teacher') {
			throw new IError('Cannot access this feature', 401);
		}
		//@ts-ignore
		req.user = decoded;
		next();
	} catch (e) {
		throw new IError('Invalid token', 401);
	}
}
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
		};
		if (decoded.designation !== 'teacher') {
			throw new IError('Cannot access this feature', 401);
		}
		//@ts-ignore
		req.user = decoded;
		next();
	} catch (e) {
		throw new IError('Invalid token', 401);
	}
}
/**
 *
 * @param id userId of the user
 * @param designation designation of the user as in teacher or student (watch casing)
 * @returns token valid for 7 days
 */
export function generateToken(id: string, designation: string): string {
	const user = { id: id, designation: designation };
	const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '7d' });
	return token;
}
