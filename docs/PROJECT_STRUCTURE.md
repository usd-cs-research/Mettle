
# Mettle Project Documentation

## Overview

Mettle is a full-stack web application with a React client and a TypeScript/Express/Socket.IO server. It is designed for collaborative problem-solving sessions, supporting real-time communication and persistent session data via MongoDB.

---

## Directory Structure

```text
Mettle/
├── client/           # React frontend (Create React App)
│   ├── public/       # Static assets (index.html, manifest, robots.txt)
│   ├── src/          # Source code
│   │   ├── assets/   # Images, videos
│   │   ├── components/ # UI components (grouped by feature)
│   │   ├── screens/  # Page-level containers
│   │   └── services/ # API, socket, and auth logic
│   ├── package.json  # Client dependencies and scripts
│   └── ...
├── server/           # Node.js backend (TypeScript)
│   ├── controllers/  # Route handler logic (e.g., questionsController.ts)
│   ├── docs/         # API documentation (apidoc)
│   ├── middlewares/  # Express middleware (auth, file-upload)
│   ├── models/       # Mongoose schemas (session, user, question, etc.)
│   ├── routes/       # Express route definitions
│   ├── sockets/      # Socket.IO namespaces and handlers
│   ├── types/        # TypeScript types/interfaces
│   ├── app.ts        # Server entry point
│   ├── package.json  # Server dependencies and scripts
│   └── ...
├── docker-compose.yml # Multi-service orchestration
├── package.json      # Root scripts for setup and orchestration
├── README.md         # Project setup and environment info
└── ...
```

---

## Usage & Developer Workflows

### 1. Local Development

- Install dependencies and compile server:

  ```sh
  npm run setup:dev
  ```

- Start the server:

  ```sh
  npm run serve:server
  ```

- Start the client:

  ```sh
  npm run serve:client
  ```

- Environment variables:
  - `server/.env.local` (MongoDB, JWT, PORT)
  - `client/.env.local` (API URL)

### 2. Docker

- Build and run all services:

  ```sh
  npm run setup:docker
  ```

### 3. API Documentation

- Generate API docs (from `server/`):

  ```sh
  npm run generate:docs
  ```

### 4. Testing

- Client: `cd client && npm test`
- Server: No automated tests; verify changes manually.

---

## Key Architectural Patterns

- **Monorepo**: Both client and server in one repo, coordinated via root scripts.
- **REST + WebSockets**: RESTful API for CRUD, Socket.IO for real-time session events.
- **Route → Controller**: Each route in `server/routes/` maps to a controller in `server/controllers/`.
- **Socket Namespaces**: `/session` namespace for collaborative session events, with handlers in `server/sockets/session.ts`.
- **MongoDB Models**: All persistent data (users, sessions, questions) via Mongoose schemas in `server/models/`.
- **Strong Typing**: Shared and backend types/interfaces in `server/types/`.
- **Client Auth**: JWT-based, with token stored in localStorage and sent via socket headers.

---

## Integration Points

- **Client ↔ Server**:
  - HTTP: via REST endpoints (see `server/routes/`)
  - WebSocket: via `/session` namespace (see `client/src/services/socket.js`)
- **Server ↔ MongoDB**: via Mongoose models (see `server/models/`)
- **API Docs**: Generated from JSDoc comments in `server/docs/`

---

## Example: Adding a New Feature

1. Define a new Mongoose schema in `server/models/` if persistent data is needed.
2. Add a new route in `server/routes/` and corresponding controller in `server/controllers/`.
3. Update or add TypeScript types in `server/types/`.
4. If real-time, add socket event handlers in `server/sockets/session.ts` and client logic in `client/src/services/socket.js`.
5. Add or update React components in `client/src/components/` and screens in `client/src/screens/`.

---

## References

- See `.github/copilot-instructions.md` for AI agent-specific guidance.
- See `README.md` (root, client, server) for setup and environment details.
- See `server/docs/` for API documentation structure.

---

For further questions, review the code in the referenced directories or contact the maintainers.
