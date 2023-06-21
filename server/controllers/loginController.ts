import { RequestHandler } from 'express';
import { IError } from '../types/IError';
import { Authorized } from '../types/jwt';
import userModel from '../models/userSchema';
import { generateToken } from '../middlewares/authorization';
import bcrypt from 'bcrypt';
/**
 * @api {post} /login User login
 * @apiName userLogin
 * @apiGroup Login
 *
 * @apiBody {String} email email-id of the user
 * @apiBody {String} password password entered by the user
 * @apiSuccess {String} token JWT token encode with userId and role of the user.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token":"srfv27635retdyucj2beyruhcbdhf"
 *     }
 *
 * @apiError UserNotFound The email of the User was not found.
 *
 * @apiError WrongPassword The user entered the wrong password.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Invalid email ID"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Invalid password
 *     {
 *       "message": "Invalid password"
 *     }
 */
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

		if (await bcrypt.compare(password, user.password)) {
			throw new IError('Invalid password', 401);
		}
		res.status(200).json({
			token: generateToken(email, user!.designation),
		});
	} catch (error) {
		next(error);
	}
};
/**
 * @api {post} /signup User signup
 * @apiName userSignup
 * @apiGroup Login
 *
 * @apiBody {String} email email-id of the user
 * @apiBody {String} password password entered by the user(no validation)
 * @apiBody {String} name name of the user
 * @apiBody {String} designation "Tecaher" or "Student"
 * @apiBody {String} adminKey Admin key set by
 * @apiSuccess {String} token JWT token encode with userId and role of the user.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token":"srfv27635retdyucj2beyruhcbdhf"
 *     }
 *
 * @apiError WrongAdminKey The admin key entered by the user is invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Wrong Admin key
 *     {
 *       "message": "Wrong Admin key"
 *     }
 * 
 */
export const signupController: RequestHandler = async (
	req: Authorized,
	res,
	next,
) => {
	console.log("controller");
	try {
		console.log(req.body);
		const email = req.body.email;
		const name = req.body.name;
		const password = req.body.password;
		const designation = req.body.designation;
		const adminKey = req.body.adminKey;
		if (adminKey !== process.env.ADMIN_KEY) {
			return new IError('Wrong admin key', 401);
		}
		const hashedPassword = await bcrypt.hash(password, 10);
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
