import { io } from 'socket.io-client';

export const sessionSocket = io(process.env.REACT_APP_API_URL + '/session', {
	autoConnect: false,
	extraHeaders: {
		Authorization: `Bearer ${localStorage.getItem('token')}`,
	},
	reconnection: true,
});
