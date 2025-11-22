# Developer Guide

This guide covers setup, build, debug, and troubleshooting for Mettle developers.

---

## 1. Setup

- See [Project Structure](./PROJECT_STRUCTURE.md) for directory and workflow overview.
- Clone the repo and run all commands from the root unless otherwise specified.
- Environment variables:
	- `server/.env.local` (MongoDB, JWT, PORT)
	- `client/.env.local` (API URL)
	- See root `README.md` for example values.

---

## 2. Build & Run

### Local Development

```sh
npm run setup:dev         # Installs all deps and compiles server
npm run serve:server      # Compiles and runs server (nodemon dist/app.js)
npm run serve:client      # Runs client (CRA dev server)
```

### Docker

```sh
npm run setup:docker      # Builds and runs all services via docker-compose
```

---

## 3. Debugging & Iteration

- **Server:**
	- Use `tsc -w` in `server/` for TypeScript watch mode (auto-recompiles on save).
	- Restart `nodemon dist/app.js` to pick up changes.
	- Logs appear in terminal; check for MongoDB connection errors and socket events.
- **Client:**
	- Standard Create React App hot-reload.
	- Use browser dev tools for network/socket debugging.
- **Sockets:**
	- Use the browser console or a tool like [Socket.IO Tester](https://amritb.github.io/socketio-client-tool/) to emit/test events.
	- All session events use the `/session` namespace.

---

## 4. Troubleshooting

- **Environment:**
	- Ensure `.env.local` files exist in both `server/` and `client/`.
	- MongoDB must be running and accessible at the URL in `server/.env.local`.
- **Sockets:**
	- If events are not received, check that the client is connecting to the correct namespace and that JWT is valid.
	- Check for typos in event names on both client and server.
- **Build:**
	- If TypeScript errors occur, run `tsc` manually in `server/` and fix reported issues.
	- If Docker fails, ensure Docker and docker-compose are installed and running.
- **API:**
	- Use tools like Postman or curl to test REST endpoints.
	- Check server logs for stack traces and error messages.

---

## 5. Common Workflows

- **Add a new API route:**
	1. Add route in `server/routes/`.
	2. Implement logic in `server/controllers/`.
	3. Update types in `server/types/` if needed.
	4. Document in [API Reference](./API_REFERENCE.md).
- **Add a new socket event:**
	1. Add handler in `server/sockets/session.ts`.
	2. Update client logic in `client/src/services/socket.js`.
	3. Document in [Socket Events](./SOCKET_EVENTS.md).
- **Update client UI:**
	1. Edit or add components in `client/src/components/`.
	2. Add/modify screens in `client/src/screens/`.

---

## 6. Advanced Tips

- Use `npm run generate:docs` in `server/` to generate API docs from JSDoc comments.
- For rapid socket testing, create a minimal script or use browser console to emit events.
- Use `git status` and `git diff` to review changes before committing.

---

For more, see [Project Structure](./PROJECT_STRUCTURE.md) and [API Reference](./API_REFERENCE.md).
