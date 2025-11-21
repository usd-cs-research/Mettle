# Socket Events Reference

This document details all Socket.IO namespaces, events, payloads, and flows used in Mettle.

## Namespaces

- `/session` — collaborative session events (main real-time channel)

---

## Event List & Payloads

### `join`
- **Direction:** Client → Server
- **Payload:**
	```json
	{
		"sessionId": "<sessionId>",
		"userId": "<userId>",
		"sessionName": "<optional>"
	}
	```
- **Server Response:** Emits `joined` to all in room:
	```json
	{
		"userId": "<userId>",
		"sessionId": "<sessionId>"
	}
	```

### `forward`
- **Direction:** Client → Server → All in session
- **Payload:**
	```json
	{
		"sessionId": "<sessionId>",
		... // event-specific data
	}
	```
- **Server Action:** Forwards event to all in session room.

### `role-switch`
- **Direction:** Client → Server → All in session
- **Payload:**
	```json
	{
		"sessionId": "<sessionId>",
		... // role info
	}
	```
- **Server Action:** Swaps user roles in DB, emits updated event to all in session.

### `exit-session`
- **Direction:** Client → Server
- **Payload:** None
- **Server Action:** Marks both users as offline, unsets socket IDs, emits `session-offline` to room.

### `disconnect`
- **Direction:** Socket.IO automatic (client disconnects)
- **Server Action:** Marks user as offline, emits `session-offline` to room.

### `global-forward`
- **Direction:** Client → Server → Same client
- **Payload:**
	```json
	{
		... // event-specific data
	}
	```
- **Server Action:** Emits `global-forward` back to the same socket.

---

## Flow Example

1. Client connects to `/session` namespace with JWT in headers.
2. Client emits `join` with session/user info.
3. Server validates, updates DB, and emits `joined` to room.
4. During session, clients emit `forward` and `role-switch` as needed; server relays and updates DB.
5. On exit or disconnect, server marks users offline and emits `session-offline`.

---

## Client Usage Example

```js
import { io } from 'socket.io-client';
const socket = io(process.env.REACT_APP_API_URL + '/session', {
	autoConnect: false,
	extraHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});
socket.connect();
socket.emit('join', { sessionId, userId });
// ...
```

---

See `server/sockets/session.ts` and `client/src/services/socket.js` for implementation details.
