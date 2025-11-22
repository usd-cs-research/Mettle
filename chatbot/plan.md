# Chatbot Integration Plan

## Overview

Integrate a Socratic Gemini chatbot into the Mettle platform to provide real-time, AI-powered assistance during collaborative problem-solving sessions. The chatbot will use Google's Gemini API to offer Socratic-style guidance, helping users reflect on their answers and deepen understanding without directly providing solutions.

### Goals
- Enable users to query the chatbot for hints, clarifications, or reflective questions.
- Ensure chatbot responses are context-aware, drawing from session questions, answers, and user roles.
- Maintain a seamless user experience within the session UI.
- Comply with privacy, security, and ethical guidelines for AI interactions.

### Scope
- Backend: Extend socket events and add Gemini API integration.
- Frontend: Add UI components for chatbot interaction.
- Configuration: API keys, environment setup.
- Testing: Functional and UX validation.

---

## Phases

### Phase 1: Research & Setup (1-2 days)
Focus on understanding requirements, setting up dependencies, and initial configuration.

**Deliverables:**
- [ ] Review and extract key requirements from the provided document (e.g., Socratic style, context awareness, privacy).
- [ ] Research Gemini API documentation and SDK (e.g., `@google/generative-ai`).
- [ ] Set up Gemini API key and test basic API calls (e.g., simple prompt-response).
- [ ] Update environment variables in `server/.env.local` for Gemini.
- [ ] Create initial `server/services/geminiService.ts` stub with API client setup.
- [ ] Document any open questions or blockers in this plan.

### Phase 2: Backend Integration (3-4 days)
Implement backend logic for Gemini queries, responses, and session context.

**Deliverables:**
- [ ] Implement `geminiService.ts`: Format prompts with session context, handle API calls, parse responses.
- [ ] Extend `server/sockets/session.ts`: Add `gemini-query` and `gemini-response` event handlers.
- [ ] Add session context fetching: Pull questions, answers, roles from MongoDB for prompts.
- [ ] Implement security: User validation, rate limiting, prompt sanitization.
- [ ] Update `server/types/` with new event types if needed.
- [ ] Test backend events manually (e.g., via socket tester tool).

### Phase 3: Frontend Integration (3-4 days)
Build UI and event handling for chatbot in the client.

**Deliverables:**
- [ ] Create `client/src/components/session/GeminiChat.js`: Input field, response display, toggle.
- [ ] Update `client/src/services/socket.js`: Emit `gemini-query`, listen for `gemini-response`.
- [ ] Integrate GeminiChat into session screen (e.g., in `client/src/screens/session/`).
- [ ] Add loading states, error handling, and attribution UI.
- [ ] Ensure responsive design and accessibility.
- [ ] Test UI interactions and socket events in browser.

### Phase 4: Testing & Validation (2-3 days)
Comprehensive testing, bug fixes, and documentation updates.

**Deliverables:**
- [ ] Write and run test cases: Functional (query-response), context awareness, errors.
- [ ] UX testing: Simulate sessions, verify Socratic responses, check performance.
- [ ] Update `docs/SOCKET_EVENTS.md` and `docs/API_REFERENCE.md` with new events.
- [ ] Add chatbot usage to `docs/DEVELOPER_GUIDE.md` and `docs/PROJECT_STRUCTURE.md`.
- [ ] Resolve open questions (e.g., visibility, moderation).
- [ ] Final integration test: End-to-end session with Gemini.

### Phase 5: Deployment & Monitoring (1 day)
Prepare for production and monitor.

**Deliverables:**
- [ ] Update `docker-compose.yml` for Gemini API key injection.
- [ ] Document deployment steps in `README.md`.
- [ ] Set up basic logging/monitoring for Gemini usage.
- [ ] Plan for future enhancements (e.g., conversation history).

---

## Integration Points

### Backend
- **Socket Events:** Extend `/session` namespace with new events for Gemini queries and responses (e.g., `gemini-query`, `gemini-response`).
- **Session Context:** Gemini will access current session data (questions, answers, user roles) to provide relevant responses.
- **API Client:** New service module to handle Gemini API calls, prompt formatting, and response parsing.

### Frontend
- **Session Screen:** Integrate chatbot UI into the session view, separate from peer chat.
- **Event Handling:** Listen for Gemini responses and display them in the UI.
- **User Input:** Allow users to send queries to Gemini via a dedicated input field.

### Data Flow
1. User types a query in the chatbot UI.
2. Frontend emits `gemini-query` event with query and session context.
3. Backend receives event, formats prompt with session data, calls Gemini API.
4. Backend emits `gemini-response` with AI-generated response.
5. Frontend displays response in the chatbot UI.

---

## Backend Design

### Gemini Service Module
- **File:** `server/services/geminiService.ts`
- **Responsibilities:**
  - Initialize Gemini API client with API key.
  - Format prompts: Include session context (e.g., "You are in a session with question X, user role Y, answer Z. Provide Socratic guidance on...").
  - Call Gemini API and parse responses.
  - Handle errors (e.g., API limits, invalid responses).
- **Dependencies:** Install `@google/generative-ai` or equivalent SDK.

### Socket Event Extensions
- **File:** `server/sockets/session.ts`
- **New Events:**
  - `gemini-query`: Payload: `{ query: string, sessionId: string, userId: string }`
  - `gemini-response`: Payload: `{ response: string, sessionId: string }`
- **Handler Logic:**
  - Validate user permissions (e.g., only session participants can query).
  - Fetch session context from MongoDB.
  - Call Gemini service and emit response.
  - Log queries for moderation/audit.

### Security & Privacy
- Ensure Gemini prompts do not expose sensitive user data.
- Rate-limit queries per user/session.
- Add moderation for inappropriate queries/responses.

---

## Frontend Design

### UI Components
- **File:** `client/src/components/session/GeminiChat.js`
- **Features:**
  - Input field for user queries.
  - Display area for Gemini responses (e.g., chat bubble style).
  - Toggle to show/hide chatbot.
  - Attribution: "Powered by Gemini" with disclaimers.

### Event Handling
- **File:** `client/src/services/socket.js`
- **Updates:**
  - Listen for `gemini-response` and update UI state.
  - Emit `gemini-query` on user input.
- **State Management:** Use React state or context to manage chat history.

### UX Guidelines
- Responses should be non-intrusive, appearing in a sidebar or modal.
- Clearly distinguish Gemini responses from peer messages.
- Provide feedback for loading states and errors.

---

## Configuration

### Environment Variables
- Add to `server/.env.local`:
  - `GEMINI_API_KEY=<your-key>`
  - `GEMINI_MODEL=<model-name>` (e.g., "gemini-2.5-flash")
- Ensure API key is securely stored and not committed.

### Deployment
- Update `docker-compose.yml` if needed for API key injection.
- Document API key acquisition in `README.md`.

---

## Testing & Validation

### Test Cases
- **Functional:** Send a query and verify response is received and displayed.
- **Context Awareness:** Ensure Gemini uses session data in prompts.
- **Error Handling:** Test API failures, invalid queries, rate limits.
- **UX:** Verify UI responsiveness, accessibility, and clarity.

### Tools
- Manual testing in browser console for socket events.
- Use Postman for API simulation if needed.
- Add unit tests for Gemini service (if test framework is added later).

### Validation Checklist
- [ ] Gemini responses are Socratic and helpful.
- [ ] No sensitive data leaked in prompts.
- [ ] UI integrates seamlessly with session screen.
- [ ] Performance: Responses within 5-10 seconds.

---

## Open Questions

1. **Visibility:** Should Gemini responses be visible to all session users or only the requester?
2. **Context Management:** How much session history should be included in prompts? (e.g., last 5 messages)
3. **Moderation:** What controls for inappropriate content? (e.g., filter queries, flag responses)
4. **Rate Limiting:** Per user, per session, or global?
5. **Offline Mode:** How to handle Gemini unavailability?
6. **Ethical Guidelines:** Ensure AI promotes learning, not cheating.

---

## Timeline (Estimated)
- Phase 1: 1-2 days
- Phase 2: 3-4 days
- Phase 3: 3-4 days
- Phase 4: 2-3 days
- Phase 5: 1 day

## Resources
- Gemini API Documentation: [link]
- Mettle Docs: See `docs/` for existing patterns.

This plan is ready for implementation. Review and iterate as needed.