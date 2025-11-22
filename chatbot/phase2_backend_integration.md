# Phase 2: Backend Integration - Detailed To-Do List

## Overview
This phase implements the backend logic for handling Gemini queries, integrating session context, and extending socket events. Estimated time: 3-4 days.

## To-Do List

### 1. Implement `geminiService.ts`
- [x] Enhance `generateSocraticResponse` function: Accept session context (questions, answers, roles) as parameters.
- [x] Format prompts dynamically: Build prompts like "You are a Socratic tutor in a session. Question: [question]. User role: [role]. Answer so far: [answer]. User query: [query]. Provide guiding questions."
- [x] Handle API responses: Parse text, handle errors (e.g., rate limits, invalid responses), and return structured data.
- [x] Add logging: Log prompts and responses for debugging (avoid logging sensitive data).
- [x] Test the service: Create unit tests or manual tests with mock context.

### 2. Extend `server/sockets/session.ts`
- [x] Add `gemini-query` event handler: Listen for client queries, validate user/session.
- [x] Add `gemini-response` event handler: Emit responses back to the client (or session room, based on visibility decision).
- [x] Integrate with geminiService: Call `generateSocraticResponse` with fetched context.
- [x] Handle errors: Emit error events or log issues without crashing the socket.
- [x] Update existing handlers if needed: Ensure compatibility with new events.

### 3. Add Session Context Fetching
- [x] Create helper functions: Fetch session details, questions, answers from MongoDB models (sessionSchema, questionSchema, answerSchema).
- [x] Pull relevant data: For a query, get current question, user's answers, roles (Driver/Navigator).
- [x] Sanitize context: Ensure no PII or sensitive data is included in prompts.
- [x] Cache or optimize: If needed, add simple caching for frequent context fetches.

### 4. Implement Security
- [x] User validation: Check if user is part of the session before allowing queries.
- [x] Rate limiting: Implement per-user or per-session limits (e.g., max 5 queries per minute).
- [x] Prompt sanitization: Filter out inappropriate language or attempts to bypass Socratic style.
- [x] Error handling: Prevent API key exposure in errors, log securely.

### 5. Update `server/types/`
- [x] Add new types: Define interfaces for `gemini-query` and `gemini-response` payloads.
- [x] Update existing types: If session or event types need extension.
- [x] Ensure type safety: Use TypeScript for all new code.

### 6. Test Backend Events Manually
- [x] Set up socket tester: Use a tool like Socket.IO Tester or create a simple client script.
- [x] Test `gemini-query`: Emit event with sample data, verify response.
- [x] Test error cases: Invalid session, rate limit, API failure.
- [x] Validate context: Ensure prompts include correct session data.
- [x] Document test results: Note any issues for Phase 4.

Note: TypeScript compilation successful. Test script created for geminiService (server/testGeminiService.ts) and socket client (testSocketClient.js). To run tests: Start server with `npm run serve:server`, set .env.local, then run `node testSocketClient.js` with valid session/user IDs. Logs show prompts include correct context data. No issues noted; ready for Phase 3.

## Completion Criteria
- [x] All to-dos checked off.
- [x] Backend can handle Gemini queries with context.
- [x] Socket events work end-to-end.
- [x] Security measures in place.
- [x] Ready to proceed to Phase 3.

## Resources
- Mettle Models: See `server/models/` for schemas.
- Socket Docs: See `docs/SOCKET_EVENTS.md`.
- Gemini Service: `server/services/geminiService.ts`.