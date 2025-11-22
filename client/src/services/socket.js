import { io } from 'socket.io-client';

// Socket configuration with better error handling and reconnection logic
export const sessionSocket = io(process.env.REACT_APP_API_URL + '/session', {
	autoConnect: false, // Only connect when needed (collaborative mode)
	extraHeaders: {
		Authorization: `Bearer ${localStorage.getItem('token')}`,
	},
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
	timeout: 10000,
});

// Helper function to check if sockets should be enabled
export const shouldEnableSockets = () => {
	const mode = localStorage.getItem('collaborationMode');
	return mode === 'collaborative';
};

// Helper function to safely disconnect socket
export const disconnectSocket = () => {
	if (sessionSocket.connected) {
		sessionSocket.disconnect();
	}
};

// Add global disconnect handler
sessionSocket.on('disconnect', (reason) => {
	if (reason === 'io server disconnect') {
		// Server forcefully disconnected, attempt reconnect if in collaborative mode
		if (shouldEnableSockets()) {
			setTimeout(() => sessionSocket.connect(), 1000);
		}
	}
});

sessionSocket.on('connect_error', (error) => {
	// Handle connection errors silently
});

sessionSocket.on('reconnect', (attemptNumber) => {
	// Successfully reconnected
});

sessionSocket.on('reconnect_failed', () => {
	// Reconnection failed after all attempts
});
