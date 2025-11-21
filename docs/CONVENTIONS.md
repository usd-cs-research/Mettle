# Project Conventions & Patterns (WIP)

This document describes project-specific coding, naming, and architectural conventions for Mettle.

## Backend
- Route → controller mapping: Each file in `server/routes/` maps to a controller in `server/controllers/`.
- Socket event handlers: Grouped by namespace in `server/sockets/`.
- Models: All persistent data via Mongoose schemas in `server/models/`.
- Types: Shared and backend types/interfaces in `server/types/`.

## Frontend
- Components grouped by feature in `client/src/components/`.
- Screens for page-level containers in `client/src/screens/`.
- Socket logic in `client/src/services/socket.js`.

<!-- TODO: Add more conventions as discovered. -->
