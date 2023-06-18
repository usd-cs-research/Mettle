import { Request } from 'express';
import { Types } from 'mongoose';

export interface Authorized extends Request {
	user?: { id: string | Types.ObjectId; type: string; _v: string };
}
