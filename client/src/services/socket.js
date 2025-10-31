// client/src/services/socket.js
// Centralized socket service. Exports a named `sessionSocket` and helper functions.
import { io } from 'socket.io-client';

const authToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

const namespaceUrl = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/session`
  : '/session';

export const sessionSocket = io(namespaceUrl, {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: true,
  auth: { token: authToken ? `Bearer ${authToken}` : null },
  extraHeaders: typeof localStorage !== 'undefined' ? { Authorization: `Bearer ${authToken}` } : {},
});

// Join a session room
export function joinSession(sessionId, userId) {
  sessionSocket.emit('join', { sessionId, userId });
}

// Forward arbitrary data to the other user in the room
export function forwardToPartner(sessionId, userId, data) {
  sessionSocket.emit('forward', { sessionId, userId, data });
}

// Switch roles
export function requestRoleSwitch(sessionId, userId) {
  sessionSocket.emit('role-switch', { sessionId, userId });
}

// Exit session
export function exitSession() {
  sessionSocket.emit('exit-session');
}

// Convenience listeners
export function onForward(cb) {
  sessionSocket.on('forward', cb);
}

export function onRoleSwitch(cb) {
  sessionSocket.on('role-switch', cb);
}

export function onSessionOffline(cb) {
  sessionSocket.on('session-offline', cb);
}

export default sessionSocket;
