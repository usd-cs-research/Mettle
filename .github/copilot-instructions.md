<!-- Copilot / AI agent instructions for the Mettle repository -->
# Mettle — Quick AI Agent Guide

Purpose: short, actionable notes to help an AI coding agent be productive in this repository.

- **Quick start (local)**:
  - Install deps & compile server: `npm run setup:dev` (runs from repo root; runs `tsc` and installs client/server deps).
  - Start client: `npm run serve:client` (or `cd client && npm start`).
  - Start server: `npm run serve:server` (compiles then runs `nodemon dist/app.js`).
  - Docker: `npm run setup:docker` (uses `docker-compose` to build and run services).

- **Environment**:
  - Server `.env.local` expected in `server/` (examples in root `README.md`).
  - Client `.env.local` in `client/` (must set `REACT_APP_API_URL` for sockets/api).

- **Big picture architecture**:
  - Monorepo with two primary parts: `client/` (React, Create React App) and `server/` (TypeScript + Express + Socket.IO).
  - Client communicates with server over HTTP (REST routes under `server/routes`) and Socket.IO namespaces (see `/session`).
  - Data models live in `server/models/*.ts`. Strong typing surfaces in `server/types/*.ts`.

- **Where to look (key files)**:
  - Server entry & scripts: `server/app.ts`, compiled output `dist/app.js` (started by `nodemon` via `server/package.json`).
  - Route → controller pattern: `server/routes/*.ts` map to `server/controllers/*Controller.ts` (e.g. `questionsController.ts`).
  - Socket setup: `server/sockets/socketInit.ts` and per-namespace logic in `server/sockets/session.ts` (session lifecycle, join/forward/role-switch handlers).
  - Client socket usage: `client/src/services/socket.js` (creates `io(process.env.REACT_APP_API_URL + '/session')` with `autoConnect: false`).
  - Client auth/context: `client/src/services/authContext.js` (shared auth pattern and token usage).

- **Socket flow & conventions (example)**:
  - Namespace: server uses `io.of('/session')` and handlers in `sessionActivities(socket)`.
  - Client connects to `/session` namespace and sends events like `join`, `forward`, `role-switch`.
  - Session persistence and socketId bookkeeping are stored in Mongo via `sessionDetailsSchema`.

- **Build / run nuances**:
  - Server must be compiled with `tsc` before running; root scripts call `tsc` where needed (`npm run serve:server` and `npm run setup:dev`).
  - Dev iteration uses `nodemon dist/app.js` — edit TS files, re-run `tsc` (or run `tsc -w`) to see changes.
  - API docs can be generated from `server` with: `cd server && npm run generate:docs` (uses `apidoc`).

- **Patterns & project-specific rules**:
  - Do not assume hot-reload for TypeScript server code — compilation step is explicit.
  - Socket handlers are stateful and update MongoDB; prefer small, reversible changes and include DB checks (see `session.ts` for examples of defensive checks).
  - Routes/controllers follow simple mapping: prefer editing controller logic in `server/controllers` and register new routes in `server/routes`.

- **Tests & linting**:
  - Client tests: use `client`'s CRA test scripts (`npm run test` in `client/`).
  - Server currently has no test scripts—avoid adding breaking changes without manual verification.

- **When making changes an AI should do first**:
  1. Update TypeScript in `server/`, run `tsc` locally and ensure `dist/` compiles without error.
  2. If code touches sockets, run the server and use the client (or a small socket test client) to validate namespace behavior.
  3. For API changes, update corresponding controllers and routes and run `server` locally to smoke-test endpoints.

If anything here is unclear or you'd like more examples (small socket test client, recommended `tsc -w` command, or CI notes), tell me which area to expand. Iterate on feedback.
