import { config } from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import { IError } from './types/IError';
import loginRouter from './routes/loginRoutes';
import { existsSync } from 'fs';
import sessionRouter from './routes/sessionRoutes';
import http from 'http';
import { Server } from 'socket.io';
import { ioConfig } from './sockets/socketInit';
import questionRouter from './routes/questionsRouter';

// env config
if (existsSync('.env')) {
	config();
	console.log('Using .env file');
} else if (existsSync('.env.local')) {
	config({ path: '.env.local' });
	console.log('Using .env.local file ');
} else {
	console.error('No environment file found');
}

const app = express();
const port = process.env.PORT || 3000;
// const env = process.env.ENVIRONMENT || 'dev';
const mongoURL = process.env.MONGODB_URL!;

app.use(cors());

app.use(express.json());

app.use(morgan('short')); // For development purposes to check the incoming requests
// Cors package

// Serve static media folder for static files such as images and video
app.use('/media', express.static('media'));

// Test endpoint to test if the server is running and accessible
app.use('/test', (req, res, next) => {
	res.status(200).json({ message: 'Message received' });
});

// Routes for login and signup
app.use('', loginRouter);

// Routes for sessions
app.use('/session', sessionRouter);

app.use('/question', questionRouter);

//Error handler all error thrown will be handled here
app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
	console.error(err);
	res.status(err.code || 500).json({
		message: err.text || 'Internal server error',
	});
});

// Start the server with connection to mongodb

// Creating a server for socket.io
const server = http.createServer(app);
const io = new Server(server, {
	path: '',
	cors: {
		origin: '*',
		methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
		allowedHeaders: ['Authorization'],
	},
	cleanupEmptyChildNamespaces: true,
});

server.listen(port, () => {
	mongoose
		.connect(mongoURL)
		.then(() => {
			console.log(`Server listening on ${port}`);
		})
		.catch((e) => {
			console.error('Couldnt connect to mongo db');
			console.error(e);
		});
});

// Sending the control to another file for better code
ioConfig(io);

export default app;
