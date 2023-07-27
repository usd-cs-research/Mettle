import { io } from 'socket.io-client';

export const sessionSocket = io(process.env.REACT_APP_API_URL + '/session', {
	autoConnect: true,
	extraHeaders: {
		Authorization: `Bearer ${localStorage.getItem('token')}`,
	},
	reconnection: true,
	reconnectionDelay: 2000,
	reconnectionAttempts: 4,
	requestTimeout: 60000,
});
