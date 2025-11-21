# Developer Guide (WIP)

This guide covers setup, build, debug, and troubleshooting for Mettle developers.

## Setup
- See [Project Structure](./PROJECT_STRUCTURE.md) for directory and workflow overview.
- Environment variables: `.env.local` in both `server/` and `client/`.

## Build & Run
- Local: `npm run setup:dev`, `npm run serve:server`, `npm run serve:client`
- Docker: `npm run setup:docker`

## Debugging
- Server: Use `tsc -w` for TypeScript watch mode, restart `nodemon` as needed.
- Client: Standard CRA hot-reload.

## Troubleshooting
- Check MongoDB connection and JWT secrets in `.env.local`.
- For socket issues, verify namespace and event names match on both client and server.

<!-- TODO: Expand with more advanced tips and common pitfalls. -->
