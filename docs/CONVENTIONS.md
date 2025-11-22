# Project Conventions & Patterns

This document describes project-specific coding, naming, and architectural conventions for Mettle.

---

## Backend

- **Route → Controller Mapping:** Each file in `server/routes/` maps directly to a controller in `server/controllers/` (e.g., `questionsRouter.ts` → `questionsController.ts`).
- **Socket Event Handlers:** Grouped by namespace in `server/sockets/` (e.g., `/session` logic in `session.ts`).
- **Models:** All persistent data is defined via Mongoose schemas in `server/models/`.
- **Types:** Shared and backend types/interfaces live in `server/types/` and subfolders.
- **Middleware:** Auth and file-upload logic in `server/middlewares/`.
- **API Docs:** JSDoc comments in controllers, generated with `npm run generate:docs` in `server/`.
- **Naming:**
	- Use camelCase for variables and functions.
	- Use PascalCase for classes and types.
	- Route files use singular resource names (e.g., `questionRouter.ts`).
- **Error Handling:** Use `IError` for custom errors; always call `next(error)` in async handlers.
- **Session/Socket State:** Always update MongoDB session state defensively (see `session.ts`).

---

## Frontend

- **Component Organization:**
	- Grouped by feature in `client/src/components/` (e.g., `problem/`, `form/`, `login/`).
	- Page-level containers in `client/src/screens/`.
- **Services:**
	- API and socket logic in `client/src/services/` (`socket.js`, `authContext.js`).
- **Naming:**
	- Use camelCase for variables, functions, and file names.
	- Use PascalCase for React components.
- **State Management:**
	- Use React context for auth (`authContext.js`).
	- Use local state/hooks for component state.
- **Socket Usage:**
	- Always connect to `/session` namespace with JWT in headers.
	- Use `autoConnect: false` and call `connect()` explicitly.
- **Styling:**
	- Use CSS modules or feature-specific CSS files (e.g., `diagramcomponent.css`).

---

## General

- **Documentation:**
	- Update `docs/` for any new API, socket event, or major workflow.
	- Keep `.github/copilot-instructions.md` in sync with project structure.
- **Testing:**
	- Client: Use CRA test scripts (`npm run test` in `client/`).
	- Server: No automated tests; verify changes manually.
- **Commits:**
	- Write clear, descriptive commit messages.
	- Reference affected files or features.

---

Add more conventions as the project evolves.
