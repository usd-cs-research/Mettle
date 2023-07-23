import { RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import { IError } from '../types/IError';
import { Authorized } from '../types/jwt';
import fs from 'fs';

const baseDir = path.resolve();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.mimetype.includes('image')) {
			req.body.fileType = 'images';
			cb(null, baseDir + '/media/images');
		} else if (file.mimetype.includes('pdf')) {
			req.body.fileType = 'pdfs';
			cb(null, baseDir + '/media/pdfs');
		} else {
			cb(new IError('Not supported file type', 401), '');
		}
	},
	filename: function (req: Authorized, file, cb) {
		const ext = path.extname(file.originalname);
		const filename = `${Date.now()}-${req.user?.id}${ext}`;
		if (req.body.fileType === 'pdfs') {
			req.body.pdfs = filename;
		} else {
			req.body.images = filename;
		}
		cb(null, filename);
	},
});

const upload = multer({ storage: storage });

export const fileUpload: RequestHandler = (req, res, next) => {
	fs.mkdir('../media/images', { recursive: true }, () => {
		console.log('Created images directory');
	});
	fs.mkdir('../media/pdfs', { recursive: true }, () => {
		console.log('Created pdfs directory');
	});
	upload.any()(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			next(new IError('Multer file Upload file error', 500));
		} else if (err) {
			next(err);
		}
	});
};
