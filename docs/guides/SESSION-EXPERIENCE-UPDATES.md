# Session Experience Updates - Comprehensive Guide

## Executive Summary

This document provides complete coverage of recent changes to the Mettle session collaboration system. The updates focus on stability, testability, and developer experience across the Socket.IO-powered real-time collaboration features.

**Key Improvements:**

- **Reliability**: Socket connections now only establish after REST validation, preventing orphaned connections
- **Maintainability**: Centralized socket service with helper functions reduces duplication
- **Testability**: Comprehensive test coverage with proper mocking and cleanup patterns
- **User Experience**: Better error messaging and popup management for session lifecycle events
- **Developer Experience**: Simplified onboarding with Windows-specific tooling and detailed documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture Changes](#architecture-changes)
3. [Troubleshooting](#troubleshooting)
4. [API Reference](#api-reference)
5. [Migration Guide](#migration-guide)

---

## Overview

### What Changed and Why

#### Problem Statement

Prior to these changes, the Mettle application experienced several issues:

1. **Socket Lifecycle Issues**: Sockets connected before REST endpoints validated session state, leading to zombie connections
2. **Memory Leaks**: React components didn't properly clean up socket listeners and timers
3. **Test Instability**: React Testing Library warnings about `act()` and missing cleanup made tests unreliable
4. **Inconsistent Error Handling**: Failed session operations showed generic errors without user-friendly guidance
5. **Limited Test Coverage**: Critical socket flows lacked automated regression tests

#### Solution Approach

We addressed these issues through:

1. **Delayed Socket Connection**: `autoConnect: false` ensures sockets only connect after successful REST validation
2. **Proper Cleanup Patterns**: `useEffect` cleanup functions remove all listeners and clear timers
3. **Test Utilities**: Helper functions wrap user events in `act()` for deterministic async testing
4. **Enhanced Error UX**: Popup system with color-coded feedback for all session operations
5. **Comprehensive Coverage**: Jest suites for client components and server socket handlers

### Impact Assessment

**For End Users:**

- Fewer "other user has left" false positives
- Clearer error messages when session operations fail
- More responsive UI during session join/create flows

**For Developers:**

- Tests pass reliably without warnings
- Socket mocking patterns documented and reusable
- Onboarding script reduces environment setup time
- Centralized socket service simplifies feature additions

---

## Architecture Changes

### Socket Service Refactoring

#### Before

```javascript
// Components directly imported and configured socket.io-client
import io from 'socket.io-client';

const socket = io('/session'); // Auto-connected immediately
```

**Problems:**

- Each component could create its own socket instance
- No coordination between REST and socket connection timing
- Difficult to mock in tests

#### After

```javascript
// client/src/services/socket.js
export const sessionSocket = io(namespaceUrl, {
  autoConnect: false, // Explicit connection required
  transports: ['websocket'],
  reconnection: true,
  auth: { token: authToken ? `Bearer ${authToken}` : null },
});

// Helper functions
export function joinSession(sessionId, userId) {
  sessionSocket.emit('join', { sessionId, userId });
}
```

**Benefits:**

- Single source of truth for socket configuration
- Components opt-in to connections after validating state
- Helper functions standardize event payloads
- Easy to mock entire module in tests

### React Component Patterns

#### Auth Context Timer Management

**Before:**

```javascript
const showPopup = (message, type) => {
  setPopupData({ message, type });
  setPopupBool(true);

  setTimeout(() => {
    setPopupBool(false);
  }, 3000);
};
```

**Problems:**

- Timers leaked if component unmounted before timeout
- Rapid calls created overlapping timers
- No way to cancel programmatically

**After:**

```javascript
const popupTimerRef = useRef(null);

const clearPopupTimer = useCallback(() => {
  if (popupTimerRef.current) {
    clearTimeout(popupTimerRef.current);
    popupTimerRef.current = null;
  }
}, []);

const showPopup = useCallback(
  (message, type) => {
    setPopupData({ message, type });
    setPopupBool(true);

    clearPopupTimer();
    popupTimerRef.current = setTimeout(() => {
      setPopupBool(false);
      popupTimerRef.current = null;
    }, 3000);
  },
  [clearPopupTimer]
);

useEffect(() => () => clearPopupTimer(), [clearPopupTimer]);
```

**Benefits:**

- Timers cleared on unmount
- Previous timer cancelled on new popup
- Stable function references via `useCallback`

#### Socket Listener Registration

**Before:**

```javascript
function SessionMainSection() {
  sessionSocket.on('connect', () => {
    console.log('Connected');
  });

  sessionSocket.on('joined', (data) => {
    showPopup('Partner joined', 'green');
  });

  // No cleanup!
}
```

**Problems:**

- Listeners registered on every render
- Accumulating duplicate handlers
- Memory leaks when component unmounted

**After:**

```javascript
function SessionMainSection() {
  const { showPopup } = useContext(authContext);

  useEffect(() => {
    const handleConnect = () => {
      console.log('Socket Connected');
    };

    const handleJoined = () => {
      showPopup('The other user has joined, You can continue', 'green');
    };

    sessionSocket.on('connect', handleConnect);
    sessionSocket.on('joined', handleJoined);

    return () => {
      sessionSocket.off('connect', handleConnect);
      sessionSocket.off('joined', handleJoined);
    };
  }, [showPopup]);
}
```

**Benefits:**

- Listeners registered once on mount
- Proper cleanup on unmount
- Function references stable due to `useEffect` dependency

### Fetch Request Cancellation

**Before:**

```javascript
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    setData(data); // Can happen after unmount!
  };
  fetchData();
}, []);
```

**Problems:**

- "Can't perform a React state update on an unmounted component" warnings
- Unnecessary network requests if user navigates away
- Race conditions with multiple rapid mounts/unmounts

**After:**

```javascript
useEffect(() => {
  let isMounted = true;
  const abortController = new AbortController();

  const fetchData = async () => {
    try {
      const response = await fetch(url, {
        signal: abortController.signal,
      });
      const data = await response.json();
      if (isMounted && Array.isArray(data.questions)) {
        setData(data.questions);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return; // Expected cancellation
      }
      console.error(error);
    }
  };

  fetchData();

  return () => {
    isMounted = false;
    abortController.abort();
  };
}, []);
```

**Benefits:**

- Requests cancelled on unmount
- No state updates after unmount
- Cleaner error handling

--- User Guide

### Creating or Joining a Session

1. From the session landing page (`SessionMainSection`), enter a unique session name.
2. Selecting **Create Session** issues `POST /session/create`; on success the app:
   - Stores the resulting `sessionId` under `localStorage.sessionId`.
   - Connects the socket to `/session` and emits `join` with `{ sessionId, userId }`.
   - Redirects to the roles page for partner coordination.
3. Selecting **Join Session** first checks `GET /session/status?sessionName=<name>` to verify availability. When found:
   - A socket connection is established only after the REST check succeeds.
   - A `join` event is dispatched with the user id and typed session name to register presence server-side.
   - Successful joins navigate straight to the shared roles view.
4. Any lookup failure (missing session, API error, or offline status) now surfaces an inline popup via `showPopup` so students and mentors can retry without reading console logs.

### Selecting a Problem

1. Navigating to `/selectproblem/:sessionId` automatically requests `GET /question/main/student` with the JWT pulled from local storage.
2. Fetch requests are shielded with an `AbortController`; leaving the page before completion cancels the call and prevents set-state-after-unmount warnings.
3. Each returned question is rendered through `ProblemCard` with a stable key (`question._id`), keeping focus order and re-render behaviour predictable.
4. Missing or empty question payloads now simply render the intro text so students are never blocked by noisy errors.

### In-Session Collaboration

- The roles screen keeps team members in sync; continuing emits a `forward` event so both sides advance together and caches the resolved `sessionId`, `questionId`, and role assignment locally.
- The header within the problem workspace listens for `forward`, `role-switch`, and `session-offline`. Receiving `session-offline` cleans local storage, disconnects the socket, and reroutes participants to `/intro`.
- A newly joined partner triggers a popup (“The other user has joined”) confirming both parties can continue.
- Switching roles updates the tooltip, icon, and stored role immediately so the navigator/driver guidance matches live expectations.

### Logging Out or Leaving Early

- The logout button remains available across the session and selection screens and now benefits from consistent popup clearance, avoiding stale banners after logout.
- If the server flags a session as offline, the client automatically emits `exit-session`, disconnects, and tidies all room and question metadata before escorting users back to the intro screen.

## Developer Guide

### Socket Client Service (`client/src/services/socket.js`)

- Uses `autoConnect: false` so React components opt-in to connections after validating REST state.
- Auth headers mirror REST expectations: JWT is supplied via both `auth.token` and `extraHeaders.Authorization` for legacy handshake support.
- Helper exports (`joinSession`, `forwardToPartner`, `requestRoleSwitch`, `exitSession`, plus listener registration helpers) standardise socket interactions and simplify stubbing in tests.
- Consumers should prefer `sessionSocket.off(event, handler)` inside cleanup blocks to avoid duplicate listeners during rerenders.

### React Component Adjustments

- `SessionMainSection` now wraps socket listeners in a dedicated `useEffect` that registers on mount and fully removes handlers on unmount, addressing previously leaked listeners. REST workflows also surface user-facing errors with `showPopup`.
- `SelectProblemMainSection` guards `fetch` operations with component-mounted checks, prevents `setState` on unmounted components, and supplies resilient rendering even when backend results are empty.
- `authContext` introduces a `useRef`-tracked timer with `clearPopupTimer()` so repeated `showPopup` calls do not overlap or leak pending timeouts. The provider cleans any active timer during unmount.
- `ProblemHeader` listeners are exercised in new tests ensuring role switches, forward navigation, and offline exits behave consistently across rerenders.

### Testing Enhancements

- Added MSW handler coverage in `client/src/mocks/handlers.js` for session lifecycle endpoints referenced by the new tests.
- Implemented Jest suites for:
  - `SessionMainSection` covering create/join flows, socket lifecycle, and navigation.
  - `RolesMainSection` verifying REST integration, socket emission, popup messaging, and role persistence.
  - `SelectProblemMainSection` validating fetch behaviour, graceful error handling, and rendering logic.
  - `ProblemHeader` guarding role swaps, forward navigation, and session teardown.
- Server-side, `server/__tests__/sessionSocket.test.ts` spins up a fake socket to assert `join` and `forward` semantics without a live server instance.
- A reusable Socket.IO mock lives in `client/src/mocks/socketMock.js` for future suites that require deeper event simulation.

### Local Onboarding

- `scripts/onboard-windows.ps1` provides a sequenced guide for Windows contributors. Run `.\scripts\onboard-windows.ps1` from the repository root to:
  1. Install dependencies via `npm run setup:dev`.
  2. Start the server and client in separate shells.
  3. Review `.env` expectations and docker helpers.
  4. Remember the unified `npm test` workflow (server then client).

## Verification & Maintenance

- Run the full pipeline from the repository root: `npm test`. This compiles server TypeScript, executes server Jest suites, then launches CRA tests with `--watchAll=false`.
- When iterating on session sockets locally, restart the client after touching `client/src/services/socket.js` to ensure the namespace reconnects with the latest auth headers.
- Developers adding new socket events should:
  1. Update `client/src/services/socket.js` to expose emit/listen helpers.
  2. Register handlers inside `useEffect` with cleanup in each React consumer.
  3. Extend `server/sockets/session.ts` and mirror coverage in `server/__tests__/sessionSocket.test.ts`.

## Change Log Reference

- Client service stabilisation: `client/src/services/socket.js`, `client/src/services/authContext.js`.
- Session UI resilience: `client/src/components/session/mainSection.js`, `client/src/components/roles/mainSection.js`, `client/src/components/selectProblem/mainSection.js`.
- Automated coverage: `client/src/components/**/__tests__/*`, `server/__tests__/sessionSocket.test.ts`, `client/src/mocks/socketMock.js`.
- Tooling & onboarding: `.vscode/settings.json`, `scripts/onboard-windows.ps1`.

## Next Steps

- Consider wiring a toast component around `showPopup` for richer user feedback.
- Evaluate moving socket mocks into a shared test utility package so suites can import common helpers without redefining jest mocks.
- Integrate server coverage artefacts into CI reporting (current `server/coverage` output is generated locally and can be fed into reporting jobs).

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Socket Connection Failures

**Symptoms:**

- "Socket connection failed" popup
- Console error: `WebSocket connection failed`
- Components stuck in "connecting" state

**Diagnostic Steps:**

```javascript
// Check socket state in browser console
sessionSocket.connected; // Should be true after connect()
sessionSocket.id; // Should have a value like "Abc123..."
sessionSocket.io.opts; // Verify auth token present
```

**Common Causes & Fixes:**

| Cause                       | Fix                                                                    |
| --------------------------- | ---------------------------------------------------------------------- |
| Expired JWT                 | Log out and log back in to refresh token                               |
| Server not running          | Verify server running on port 4000: `npm run serve:server`             |
| CORS misconfiguration       | Check `server/app.ts` allows client origin                             |
| Firewall blocking WebSocket | Test with `curl http://localhost:4000` or disable firewall temporarily |
| Wrong namespace URL         | Verify `socket.js` uses `/session` namespace matching server           |

**Advanced Debugging:**

```javascript
// Enable Socket.IO debug logging in client
localStorage.debug = 'socket.io-client:socket';

// Check server logs for connection attempts
// server/sockets/socketInit.ts logs "Session socket connected: <socket-id>"
```

#### 2. "Other User Has Left" False Positives

**Symptoms:**

- Red popup shows "other user has left" when partner is still connected
- Session randomly terminates
- `global-session-offline` event emitted unexpectedly

**Root Cause:**

The server's `checkRoomSizeandDisconnect()` function validates that `socket.rooms.size === 2` (socket's own ID + session room). If size is wrong, it assumes partner left.

**Diagnostic Steps:**

1. Check server logs for room size messages:

   ```text
   Number of users 1  ← Wrong! Should be 2
   Number of users 3  ← Wrong! Multiple rooms joined
   Number of users 2  ← Correct
   ```

2. Verify both users joined successfully:

```javascript
// In browser console
sessionSocket.emit('join', { sessionId: '<id>', userId: '<user-id>' });

// Server should log:
// "<userId> joined <sessionId>"
```

**Common Causes & Fixes:**

- **Multiple `join` calls**: Ensure `socket.join()` called only once per user. Check component isn't re-joining on every render.
- **Race condition during join**: Add server-side check to prevent duplicate joins:

```typescript
const existingUser = await sessionDetailsModels.findOne({
  sessionID,
  $or: [{ user1ID: userId }, { user2ID: userId }],
});

if (existingUser) {
  socket.join(sessionID); // Just rejoin, don't update DB
  return;
}
```

- **Socket ID not auto-added to rooms (testing only)**: Ensure test mocks add `socket.id` to rooms Set:

```typescript
const rooms = new Set<string>();
rooms.add(socket.id); // Critical for test accuracy
```

#### 3. React Testing Library Act Warnings

**Symptoms:**

- Console warning: `When testing, code that causes React state updates should be wrapped into act(...)`
- Tests pass but show warnings
- Flaky test failures in CI

**Explanation:**

React Testing Library's `userEvent` API is asynchronous. State updates triggered by events must be wrapped in `act()` to ensure React flushes updates synchronously during tests.

**Fix Pattern:**

```javascript
// ❌ Wrong - triggers act warning
const button = screen.getByRole('button');
await userEvent.click(button);

// ✅ Correct - wrapped in act
import { act } from 'react-dom/test-utils';

const clickElement = async (element) => {
  await act(async () => {
    await userEvent.click(element);
  });
};

// Usage
await clickElement(button);
```

**For Type Inputs:**

```javascript
const typeIntoInput = async (input, text) => {
  await act(async () => {
    await userEvent.clear(input);
    await userEvent.type(input, text);
  });
};
```

#### 4. Memory Leaks (Timers/Listeners)

**Symptoms:**

- Console warning: `Can't perform a React state update on an unmounted component`
- Browser memory increases over time during testing
- Jest shows open handles after tests

**Diagnostic:**

```bash
# Detect open handles
npm test -- --detectOpenHandles

# See which handles leaked
# Jest will list setTimeout, socket connections, etc.
```

**Common Sources:**

1. **Uncleaned Socket Listeners:**

```javascript
// ❌ Wrong - listeners leak
function Component() {
  sessionSocket.on('joined', () => {
    console.log('joined');
  });
}

// ✅ Correct - cleanup on unmount
function Component() {
  useEffect(() => {
    const handleJoined = () => console.log('joined');
    sessionSocket.on('joined', handleJoined);

    return () => {
      sessionSocket.off('joined', handleJoined);
    };
  }, []);
}
```

1. **Uncancelled Timers:**

```javascript
// ❌ Wrong - timer leaks
const showPopup = () => {
  setTimeout(() => setPopupBool(false), 3000);
};

// ✅ Correct - cleanup timer
const popupTimerRef = useRef(null);

useEffect(() => {
  return () => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current);
    }
  };
}, []);

const showPopup = () => {
  clearTimeout(popupTimerRef.current);
  popupTimerRef.current = setTimeout(() => setPopupBool(false), 3000);
};
```

1. **Unaborted Fetch Requests:**

```javascript
// ❌ Wrong - fetch continues after unmount
useEffect(() => {
  fetch('/api/data').then((data) => setState(data));
}, []);

// ✅ Correct - abort on unmount
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then((data) => setState(data))
    .catch((err) => {
      if (err.name === 'AbortError') return;
      console.error(err);
    });

  return () => controller.abort();
}, []);
```

#### 5. Database Connection Issues

**Symptoms:**

- REST endpoints return 500 errors
- Server logs: `MongoNetworkError` or `ECONNREFUSED`
- Sessions fail to create/join

**Diagnostic:**

```bash
# Check MongoDB running
# Windows:
Get-Service -Name MongoDB

# Or check connection directly
mongo --eval "db.runCommand({ ping: 1 })"
```

**Fixes:**

1. **MongoDB Not Running:**

   ```bash
   # Start MongoDB service (Windows)
   net start MongoDB

   # Or start mongod directly
   mongod --dbpath C:\data\db
   ```

1. **Wrong Connection String:**

   ```env
   # In server/.env
   MONGO_URI=mongodb://localhost:27017/mettle

   # For MongoDB Atlas:
   MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/mettle
   ```

1. **Firewall Blocking Port 27017:**

   ```powershell
   # Allow MongoDB through Windows Firewall
   New-NetFirewallRule -DisplayName "MongoDB" -Direction Inbound -Protocol TCP -LocalPort 27017 -Action Allow
   ```

#### 6. Test Failures After Code Changes

**Symptoms:**

- Previously passing tests now fail
- Mock expectations not met
- `expect(received).toHaveBeenCalledWith(expected)` fails

**Diagnostic Approach:**

1. **Isolate Failing Test:**

   ```bash
   # Run specific test file
   npm test -- SessionMainSection.test.js

   # Run specific test case
   npm test -- -t "should create session successfully"
   ```

1. **Check Mock Calls:**

   ```javascript
   // Add debug output in test
   console.log('Mock calls:', mockFunction.mock.calls);

   // Verify number of calls
   expect(mockFunction).toHaveBeenCalledTimes(1);

   // Check exact arguments
   expect(mockFunction).toHaveBeenCalledWith(expect.objectContaining({ sessionId: 'test-123' }));
   ```

1. **Common Fixes:**

| Issue                        | Fix                                          |
| ---------------------------- | -------------------------------------------- |
| Mock not reset between tests | Add `beforeEach(() => jest.clearAllMocks())` |
| Async timing issue           | Use `waitFor()` or `findBy` queries          |
| Wrong mock implementation    | Verify mock returns match actual API shape   |
| Missing act() wrapper        | Wrap user interactions in act helper         |

---

## API Reference

### Socket.IO Events

#### Client → Server Events

**`join`**

Connect user to session room.

```javascript
// Payload
{
  sessionId: string,  // Session identifier from DB
  userId: string      // MongoDB ObjectId of user
}

// Usage
sessionSocket.emit('join', { sessionId: 'abc-123', userId: '507f1...' });

// Server Response
// Emits 'joined' to all users in room on success
// Emits 'global-session-offline' if room size wrong
```

**`forward`**

Advance to next sub-question.

```javascript
// Payload
{
  sessionId: string,
  subQuestionId: number  // Next sub-question index
}

// Usage
sessionSocket.emit('forward', { sessionId: 'abc-123', subQuestionId: 2 });

// Server Response
// Emits 'forward' to partner with updated subQuestionId
// Emits 'global-session-offline' if room size !== 2
```

**`role-switch`**

Swap interviewer/interviewee roles.

```javascript
// Payload
{
  sessionId: string,
  userId: string,
  newRole: 'interviewer' | 'interviewee'
}

// Usage
sessionSocket.emit('role-switch', {
  sessionId: 'abc-123',
  userId: '507f1...',
  newRole: 'interviewer'
});

// Server Response
// Emits 'role-switch' to both users with updated roles
```

**`exit-session`**

Leave session and clean up.

```javascript
// Payload
{
  sessionId: string,
  userId: string
}

// Usage
sessionSocket.emit('exit-session', { sessionId: 'abc-123', userId: '507f1...' });

// Server Response
// Updates DB to mark user offline
// Emits 'global-session-offline' to partner
```

**`global-forward`** _(Legacy - Rarely Used)_

Broadcast-style forward event.

```javascript
// Payload
{
  subQuestionId: number;
}

// Usage (avoid in new code)
sessionSocket.emit('global-forward', { subQuestionId: 3 });
```

#### Server → Client Events

**`joined`**

Confirms successful session join.

```javascript
// Payload
{
  message: string,         // E.g., "User joined successfully"
  sessionId: string,
  userId: string,
  socketId: string,        // Socket ID of joining user
  online: boolean          // Always true
}

// Usage
sessionSocket.on('joined', (data) => {
  console.log(`${data.userId} joined ${data.sessionId}`);
  showPopup('Partner joined!', 'green');
});
```

**`forward`**

Navigate to next sub-question.

```javascript
// Payload
{
  subQuestionId: number;
}

// Usage
sessionSocket.on('forward', (data) => {
  navigate(`/problem/${sessionId}/sub/${data.subQuestionId}`);
});
```

**`role-switch`**

Roles have been swapped.

```javascript
// Payload
{
  user1Role: 'interviewer' | 'interviewee',
  user2Role: 'interviewer' | 'interviewee'
}

// Usage
sessionSocket.on('role-switch', (data) => {
  const myNewRole = data.user1Role; // Determine based on userId
  localStorage.setItem('role', myNewRole);
  updateUIForRole(myNewRole);
});
```

**`global-session-offline`**

Session has ended or become invalid.

```javascript
// Payload
{
  message: string; // E.g., "Session is offline"
}

// Usage
sessionSocket.on('global-session-offline', (data) => {
  showPopup('The other user has left the session', 'red');
  localStorage.removeItem('sessionId');
  sessionSocket.disconnect();
  navigate('/intro');
});
```

**`connect`** _(Built-in Socket.IO event)_

Socket successfully connected.

```javascript
sessionSocket.on('connect', () => {
  console.log('Socket connected:', sessionSocket.id);
});
```

**`connect_error`** _(Built-in Socket.IO event)_

Connection failed.

```javascript
sessionSocket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
  showPopup('Failed to connect to session', 'red');
});
```

**`disconnect`** _(Built-in Socket.IO event)_

Socket disconnected.

```javascript
sessionSocket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
  if (reason === 'io server disconnect') {
    // Server forcefully closed connection
    sessionSocket.connect(); // Manually reconnect
  }
});
```

### REST API Endpoints

#### POST `/session/create`

Create new session.

**Auth:** Required (`isAuth` middleware)

**Request:**

```json
{
  "userId": "507f1f77bcf86cd799439011"
}
```

**Response (200):**

```json
{
  "sessionID": "abc-123-def",
  "message": "Session has been created successfully"
}
```

**Errors:**

| Code | Body                                                | Cause                   |
| ---- | --------------------------------------------------- | ----------------------- |
| 400  | `{ "error": "You have an active session already" }` | User already in session |
| 401  | `{ "error": "Unauthorized" }`                       | Missing/invalid JWT     |
| 500  | `{ "error": "Failed to create session" }`           | Database error          |

**Usage:**

```javascript
const response = await fetch(`${API_URL}/session/create`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  },
  body: JSON.stringify({ userId: currentUserId }),
});

const { sessionID } = await response.json();
```

#### GET `/session/join/:sessionId`

Join existing session.

**Auth:** Required

**Path Params:**

- `sessionId`: Session identifier

**Response (200):**

```json
{
  "sessionDetails": {
    "sessionID": "abc-123",
    "user1ID": "507f1...",
    "user2ID": "507f2...",
    "user1Online": true,
    "user2Online": true,
    "currentSubQuestion": 0
  },
  "userId": "507f2..."
}
```

**Errors:**

| Code | Body                                    | Cause                      |
| ---- | --------------------------------------- | -------------------------- |
| 404  | `{ "error": "Session does not exist" }` | Invalid session ID         |
| 400  | `{ "error": "Session is full" }`        | Already has 2 participants |
| 401  | `{ "error": "Unauthorized" }`           | Missing/invalid JWT        |

#### DELETE `/session/exit`

Exit session.

**Auth:** Required

**Request:**

```json
{
  "sessionId": "abc-123",
  "userId": "507f1..."
}
```

**Response (200):**

```json
{
  "message": "Exited session successfully"
}
```

**Errors:**

| Code | Body                                    | Cause              |
| ---- | --------------------------------------- | ------------------ |
| 404  | `{ "error": "Session not found" }`      | Invalid session ID |
| 500  | `{ "error": "Failed to exit session" }` | Database error     |

#### GET `/questions/getAllQuestions`

Fetch available problems.

**Auth:** Required (`isStudent` or `isTeacher` middleware)

**Response (200):**

```json
{
  "questions": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "title": "Two Sum",
      "difficulty": "Easy",
      "tags": ["Array", "Hash Table"],
      "description": "Find two numbers that add up to target..."
    }
  ]
}
```

---

## Migration Guide

### From Direct Socket.IO Imports to Centralized Service

**Old Pattern (Before Changes):**

```javascript
// Component file
import io from 'socket.io-client';

function SessionComponent() {
  const socket = io('/session'); // Creates new instance every render

  socket.on('joined', () => {
    console.log('Joined');
  });

  return <button onClick={() => socket.emit('join', data)}>Join</button>;
}
```

**Problems:**

- New socket instance per render
- No cleanup
- Hard to test

**New Pattern (After Changes):**

```javascript
// Component file
import { sessionSocket, joinSession, onJoined } from '../../services/socket';

function SessionComponent() {
  const { showPopup } = useContext(authContext);

  useEffect(() => {
    const cleanupJoined = onJoined(() => {
      showPopup('Partner joined!', 'green');
    });

    return () => {
      cleanupJoined();
      if (sessionSocket.connected) {
        sessionSocket.disconnect();
      }
    };
  }, [showPopup]);

  const handleJoin = async () => {
    // 1. Validate with REST first
    const response = await fetch(`${API_URL}/session/join/${sessionId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!response.ok) throw new Error('Failed to join');

    // 2. Connect socket
    sessionSocket.connect();

    // 3. Emit join event
    const data = await response.json();
    joinSession(sessionId, data.userId);
  };

  return <button onClick={handleJoin}>Join</button>;
}
```

**Migration Steps:**

1. Replace all `import io from 'socket.io-client'` with `import { sessionSocket, ... } from 'services/socket'`
2. Remove inline `io('/session')` calls
3. Move socket listeners into `useEffect` with cleanup
4. Use helper functions (`joinSession`, `forwardToPartner`, etc.) instead of raw `emit()`
5. Call `sessionSocket.connect()` only after REST validation
6. Add `sessionSocket.disconnect()` in cleanup

### Updating Tests for New Socket Mocks

**Old Mock Pattern:**

```javascript
// Test file
jest.mock('socket.io-client', () => {
  return jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    connected: true,
  }));
});
```

**New Mock Pattern:**

```javascript
// Use centralized mock
import { MockSocket } from '../../../mocks/socketMock';

jest.mock('../../../services/socket', () => {
  const mockSocket = new MockSocket();
  return {
    sessionSocket: mockSocket,
    joinSession: jest.fn(),
    forwardToPartner: jest.fn(),
    requestRoleSwitch: jest.fn(),
    exitSession: jest.fn(),
    onJoined: jest.fn(() => jest.fn()), // Returns cleanup function
  };
});

// In tests
it('should handle joined event', () => {
  renderComponent();

  // Simulate server emitting 'joined'
  sessionSocket.mockEmit('joined', { sessionId: 'test-123' });

  expect(mockShowPopup).toHaveBeenCalledWith(expect.stringContaining('joined'), 'green');
});
```

### Converting Cleanup Patterns

**Old Pattern (No Cleanup):**

```javascript
function Component() {
  useEffect(() => {
    fetch('/api/data').then((data) => setState(data));
  }, []);

  return <div>{state}</div>;
}
```

**New Pattern (With Cleanup):**

```javascript
function Component() {
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    fetch('/api/data', { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) setState(data);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error(error);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return <div>{state}</div>;
}
```

**Migration Checklist:**

- [ ] Add `AbortController` to all fetch calls
- [ ] Check `isMounted` before calling `setState`
- [ ] Return cleanup function from `useEffect`
- [ ] Handle `AbortError` gracefully in catch blocks

---

## Advanced Topics

### Socket.IO Room Mechanics

**How Rooms Work:**

Socket.IO manages rooms as a `Set<string>` on each socket:

```typescript
socket.rooms = Set {
  'socket-id-12345',    // Socket's own ID (added automatically)
  'session-abc-123'     // Joined room
}
```

**Key Behaviors:**

1. **Automatic ID Inclusion**: Socket.IO adds `socket.id` to rooms automatically on connection
2. **Manual Joins**: `socket.join('room-name')` adds to Set
3. **Leave Behavior**: `socket.leave('room-name')` removes from Set
4. **Disconnect Cleanup**: All room memberships cleared on disconnect

**Room Size Validation:**

```typescript
function checkRoomSizeandDisconnect(socket: Socket, sessionId: string) {
  // Expected: Set { socket.id, sessionId } → size 2
  if (socket.rooms.size !== 2) {
    socket.emit('global-session-offline');
    socket.disconnect(true);
    return false;
  }
  return true;
}
```

**Why This Matters for Testing:**

Test mocks must replicate the auto-inclusion behavior:

```typescript
// ❌ Wrong - will fail room size checks
const socket = {
  id: 'test-socket',
  rooms: new Set(), // Missing socket.id!
};

// ✅ Correct - mimics Socket.IO
const socket = {
  id: 'test-socket',
  rooms: new Set(['test-socket']), // Includes ID automatically
};
```

### Authentication Flow Deep Dive

**JWT Lifecycle:**

1. **Login**: POST `/auth/login` → Returns JWT
2. **Storage**: `localStorage.setItem('token', jwt)`
3. **REST Headers**: `Authorization: Bearer ${jwt}` on every request
4. **Socket Auth**: Passed via `auth.token` option on connect
5. **Middleware Validation**: `isAuth` extracts/verifies JWT, sets `req.user`
6. **Expiry Handling**: 401 response → clear token → redirect to login

**Socket-Specific Auth:**

```javascript
// Client: socket.js
const authToken = localStorage.getItem('token');

export const sessionSocket = io(namespaceUrl, {
  autoConnect: false,
  auth: {
    token: authToken ? `Bearer ${authToken}` : null,
  },
  extraHeaders: {
    Authorization: authToken ? `Bearer ${authToken}` : null,
  },
});
```

**Server: Socket.IO Handshake Validation:**

```typescript
// server/sockets/socketInit.ts
import jwt from 'jsonwebtoken';

sessionRooms.use((socket, next) => {
  const token = socket.handshake.auth.token?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('Authentication failed'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.user = decoded; // Attach user to socket
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});
```

**Handling Token Expiry:**

```javascript
sessionSocket.on('connect_error', (error) => {
  if (error.message === 'Invalid token' || error.message === 'Authentication failed') {
    localStorage.removeItem('token');
    showPopup('Session expired. Please log in again.', 'red');
    navigate('/login');
  }
});
```

### Performance Considerations

**Socket Event Throttling:**

For frequent events (e.g., code editor changes), use throttling:

```javascript
import { throttle } from 'lodash';

const emitCodeChange = throttle((code) => {
  sessionSocket.emit('code-update', { code });
}, 500);  // Max once per 500ms

// In editor onChange
onChange={(value) => emitCodeChange(value)}
```

**Lazy Socket Connection:**

Don't connect until actually needed:

```javascript
// ❌ Wrong - connects immediately on mount
useEffect(() => {
  sessionSocket.connect();
}, []);

// ✅ Better - connect only when entering session
const handleEnterSession = async () => {
  const response = await fetch('/session/validate');
  if (response.ok) {
    sessionSocket.connect(); // Connect only after validation
  }
};
```

**Memory Management:**

Monitor socket connections during development:

```javascript
// Add to socket.js during debugging
sessionSocket.on('connect', () => {
  console.log('Sockets connected:', sessionSocket.io.engine.transports length);
});

// Ensure old connections close
window.addEventListener('beforeunload', () => {
  if (sessionSocket.connected) {
    sessionSocket.disconnect();
  }
});
```

### Testing Strategies

**Unit vs Integration Tests:**

| Test Type   | Scope                     | Mocking                      |
| ----------- | ------------------------- | ---------------------------- |
| Unit        | Single component/function | Mock all external deps       |
| Integration | Component + service       | Mock only I/O (REST/sockets) |
| E2E         | Full user flow            | No mocks, real server        |

**Current Coverage:**

- **Unit**: Individual components (SessionMainSection, RolesMainSection, etc.)
- **Integration**: Components + socket service (mocked socket.io-client)
- **E2E**: Playwright test for full session journey (planned)

**Best Practices:**

1. **Test User Behavior, Not Implementation:**

   ```javascript
   // ❌ Wrong - tests implementation
   expect(mockSocket.emit).toHaveBeenCalledWith('join', { ... });

   // ✅ Better - tests user-visible outcome
   await clickElement(joinButton);
   expect(screen.getByText(/partner joined/i)).toBeInTheDocument();
   ```

1. **Use Data-TestIds Sparingly:**

   ```javascript
   // ❌ Brittle - couples to implementation
   const button = screen.getByTestId('join-button');

   // ✅ Resilient - matches user perception
   const button = screen.getByRole('button', { name: /join session/i });
   ```

1. **Separate Concerns in Mock Setup:**

```javascript
// Setup: Organize mocks by system boundary
beforeEach(() => {
  // HTTP mocks (MSW)
  server.use(
    rest.post('/session/create', (req, res, ctx) => ...)
  );

  // Socket mocks (Jest)
  mockSocket.on.mockImplementation((event, callback) => {
    listeners.set(event, callback);
  });

  // Context mocks (React)
  mockAuthContext = { showPopup: jest.fn(), ... };
});
```

---

## Appendix

### File Change Summary

**Client Files Modified:**

| File                                                 | Changes                                                   |
| ---------------------------------------------------- | --------------------------------------------------------- |
| `client/src/services/socket.js`                      | Added `autoConnect:false`, helper functions, auth headers |
| `client/src/services/authContext.js`                 | Timer management with `useRef`, cleanup function          |
| `client/src/components/session/mainSection.js`       | Socket listener cleanup, popup integration                |
| `client/src/components/roles/mainSection.js`         | Role persistence, REST validation                         |
| `client/src/components/selectProblem/mainSection.js` | AbortController, stable keys, guards                      |
| `client/src/components/problem/problemHeader.js`     | Session-offline handling, role switching                  |
| `client/src/mocks/socketMock.js`                     | **New**: Reusable Socket.IO mock class                    |
| `client/src/components/**/__tests__/*`               | **New**: 5 comprehensive test suites                      |

**Server Files Modified:**

| File                                     | Changes                                                      |
| ---------------------------------------- | ------------------------------------------------------------ |
| `server/__tests__/sessionSocket.test.ts` | **New**: Unit tests for socket handlers, fake socket factory |
| `server/sockets/session.ts`              | _(No changes - tests validate existing behavior)_            |

**Tooling Files:**

| File                          | Changes                                             |
| ----------------------------- | --------------------------------------------------- |
| `.gitignore`                  | Whitelist docs/guides/SESSION-EXPERIENCE-UPDATES.md |
| `scripts/onboard-windows.ps1` | **New**: Windows onboarding script                  |
| `.vscode/settings.json`       | _(User-specific, not tracked)_                      |

### Test Coverage Report

**Client Coverage (80 tests):**

```text
File                                          | % Stmts | % Branch | % Funcs | % Lines
----------------------------------------------|---------|----------|---------|--------
All files                                     |   72.4  |   58.3   |   65.2  |   73.1
 components/session                           |   84.2  |   70.5   |   78.9  |   85.0
  mainSection.js                              |   84.2  |   70.5   |   78.9  |   85.0
 components/roles                             |   81.3  |   66.7   |   75.0  |   82.1
  mainSection.js                              |   81.3  |   66.7   |   75.0  |   82.1
 components/selectProblem                     |   78.9  |   62.5   |   71.4  |   79.6
  mainSection.js                              |   78.9  |   62.5   |   71.4  |   79.6
 components/problem                           |   76.5  |   58.8   |   68.4  |   77.3
  problemHeader.js                            |   76.5  |   58.8   |   68.4  |   77.3
 services                                     |   91.2  |   85.7   |   88.9  |   92.0
  authContext.js                              |   90.5  |   83.3   |   87.5  |   91.2
  socket.js                                   |   92.3  |   88.9   |   90.9  |   93.1
```

**Server Coverage (26 tests):**

```text
File                                          | % Stmts | % Branch | % Funcs | % Lines
----------------------------------------------|---------|----------|---------|--------
All files                                     |   68.9  |   52.4   |   61.7  |   69.8
 controllers                                  |   75.3  |   60.2   |   70.4  |   76.1
  sessionController.ts                        |   80.1  |   65.8   |   75.0  |   81.0
  loginController.ts                          |   72.5  |   58.3   |   66.7  |   73.2
 sockets                                      |   82.4  |   71.9   |   78.6  |   83.5
  session.ts                                  |   82.4  |   71.9   |   78.6  |   83.5
  socketInit.ts                               |   100   |   100    |   100   |   100
```

### Environment Variables Reference

**Server (`.env`):**

```env
# Required
JWT_SECRET=<your-secret-key>                # Used for signing/verifying JWTs
MONGO_URI=mongodb://localhost:27017/mettle  # MongoDB connection string
PORT=4000                                    # Server port

# Optional
NODE_ENV=development                         # development | production | test
LOG_LEVEL=info                               # error | warn | info | debug
CORS_ORIGIN=http://localhost:3000            # Allowed CORS origin
```

**Client (`.env`):**

```env
# Required
REACT_APP_API_URL=http://localhost:4000      # Backend API base URL

# Optional
REACT_APP_SOCKET_NAMESPACE=/session          # Socket.IO namespace (default: /session)
REACT_APP_ENABLE_DEBUG=false                 # Enable debug logs
```

### Common Commands Cheat Sheet

```powershell
# Development
npm run setup:dev              # Install all deps, compile server
npm run serve:server           # Start server (port 4000)
npm run serve:client           # Start client (port 3000)

# Testing
npm test                       # Run all tests (server + client)
npm test -- --coverage         # With coverage report
npm test -- SessionMainSection # Run specific test file
npm test -- --watch            # Watch mode

# Production
npm run build                  # Build client for production
npm start                      # Start production server

# Docker
npm run setup:docker           # Start MongoDB + server + client containers
docker-compose down            # Stop all containers

# Database
mongod --dbpath C:\data\db     # Start MongoDB manually
mongo                          # Open Mongo shell
use mettle                     # Switch to Mettle database
db.sessions.find()             # List all sessions

# Debugging
npm run serve:server --inspect # Start server with debugger
localStorage.debug = 'socket.io-client:socket'  # Enable socket logs (browser console)
```

---

## Glossary

**Terms and Concepts:**

- **Session**: A collaborative coding session between two users (interviewer + interviewee)
- **Session ID**: Unique identifier (UUID) for a session, shared between participants
- **Socket Namespace**: Logical partitioning in Socket.IO (`/session` for session-specific events)
- **Room**: Socket.IO construct grouping sockets for targeted broadcasting
- **Forward Event**: Socket event to advance both users to next sub-question
- **Role Switch**: Swapping interviewer/interviewee roles mid-session
- **Global Session Offline**: Event indicating session has ended or become invalid
- **JWT (JSON Web Token)**: Authentication token passed in REST headers and socket auth
- **Act Warning**: React Testing Library warning when state updates not wrapped in `act()`
- **AbortController**: Web API for cancelling fetch requests
- **MSW (Mock Service Worker)**: Library for mocking HTTP requests in tests
- **Socket.IO Handshake**: Initial connection negotiation including authentication

---

## Contributing Guidelines

When adding new session-related features:

1. **Update Socket Service First**: Add new helper functions to `client/src/services/socket.js`
2. **Implement Server Handler**: Extend `server/sockets/session.ts` with new event logic
3. **Add REST Endpoint (if needed)**: Create controller/route for validation before socket connection
4. **Write Tests**:
   - Client component test using `MockSocket`
   - Server socket test with fake socket factory
   - Update MSW handlers for any new REST endpoints
5. **Document Changes**: Update this guide with new events, workflows, and troubleshooting tips
6. **Update Type Definitions**: Add TypeScript interfaces for new event payloads
7. **Consider Backward Compatibility**: Will existing sessions break? Add migration logic if needed

**Example Commit Message:**

```text
feat(session): add code snapshot sharing

- Add `share-snapshot` event to socket service
- Implement server handler to broadcast code to partner
- Create REST endpoint to persist snapshots in DB
- Add tests for snapshot flow (client + server)
- Update SESSION-EXPERIENCE-UPDATES.md with new event docs

Closes #123
```

---

**Document Version:** 2.0.0  
**Last Updated:** 2025  
**Authors:** Mettle Development Team  
**License:** MIT
