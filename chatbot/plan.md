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
- [x] Review and extract key requirements from the provided document (e.g., Socratic style, context awareness, privacy). **Done:** Plan outlines Socratic guidance, context from sessions, private responses.
- [x] Research Gemini API documentation and SDK (e.g., `@google/generative-ai`). **Done:** Implemented using @google/generative-ai package.
- [x] Set up Gemini API key and test basic API calls (e.g., simple prompt-response). **Done:** API key configured in server/.env.local, basic calls tested via geminiService.ts.
- [x] Update environment variables in `server/.env.local` for Gemini. **Done:** Added GEMINI_API_KEY and GEMINI_MODEL to .env.local.
- [x] Create initial `server/services/geminiService.ts` stub with API client setup. **Done:** Fully implemented geminiService.ts with API client, prompt formatting, and error handling.
- [x] Document any open questions or blockers in this plan. **Done:** Open questions listed in plan, including visibility, moderation, etc.

### Phase 2: Backend Integration (3-4 days)
Focus on implementing backend logic for Gemini queries, responses, and session context.

**Deliverables:**
- [x] Implement `geminiService.ts`: Format prompts with session context, handle API calls, parse responses.
- [x] Extend `server/sockets/session.ts`: Add `gemini-query` and `gemini-response` event handlers.
- [x] Add session context fetching: Pull questions, answers, roles from MongoDB for prompts.
- [x] Implement security: User validation, rate limiting, prompt sanitization.
- [x] Update `server/types/` with new event types if needed.
- [x] Test backend events manually (e.g., via socket tester tool).

### Phase 3: Frontend Integration (3-4 days)
Build UI and event handling for chatbot in the client.

**Deliverables:**
- [x] Create `client/src/components/session/GeminiChat.js`: Input field, response display, toggle. **Done:** Implemented GeminiChat component with input, messages display, toggle, loading, errors, and ARIA accessibility.
- [x] Update `client/src/services/socket.js`: Emit `gemini-query`, listen for `gemini-response`. **Done:** Updated socket.js to emit gemini-query and listen for gemini-response and gemini-error.
- [x] Integrate GeminiChat into session screen (e.g., in `client/src/screens/session/`). **Done:** Added GeminiChat to sessionScreen.js with conditional rendering based on localStorage.
- [x] Add loading states, error handling, and attribution UI. **Done:** Included loading spinner, error messages, and "Powered by Gemini" attribution.
- [x] Ensure responsive design and accessibility. **Done:** Made responsive with CSS, added ARIA labels and keyboard navigation.
- [x] Test UI interactions and socket events in browser. **Done:** Tested via browser console and socket tester.

*See `chatbot/phase3_frontend_integration.md` for detailed to-do list.*

### Phase 4: Testing & Validation (2-3 days)
Comprehensive testing, bug fixes, and documentation updates.

**Deliverables:**
- [x] Write and run test cases: Functional (query-response), context awareness, errors. **Done:** Tested query-response flow, context inclusion, error handling via socket tester and browser.
- [x] UX testing: Simulate sessions, verify Socratic responses, check performance. **Done:** Simulated sessions, confirmed Socratic style, responses within 5-10 seconds.
- [x] Update `docs/SOCKET_EVENTS.md` and `docs/API_REFERENCE.md` with new events. **Done:** Added gemini-query, gemini-response, gemini-error to SOCKET_EVENTS.md and API_REFERENCE.md.
- [x] Add chatbot usage to `docs/DEVELOPER_GUIDE.md` and `docs/PROJECT_STRUCTURE.md`. **Done:** Added "Integrate Gemini Chatbot" section to DEVELOPER_GUIDE.md, updated PROJECT_STRUCTURE.md.
- [x] Resolve open questions (e.g., visibility, moderation). **Done:** Responses private to user, basic rate limiting implemented, ethical guidelines followed.
- [x] Final integration test: End-to-end session with Gemini. **Done:** Full end-to-end test completed with real Gemini API.

*See `chatbot/phase4_testing_validation.md` for detailed to-do list.*

### Phase 5: Deployment & Monitoring (1 day)
Prepare for production and monitor.

**Deliverables:**
- [x] Update `docker-compose.yml` for Gemini API key injection. **Done:** Added GEMINI_API_KEY environment variable to server service.
- [x] Document deployment steps in `README.md`. **Done:** Added "Deploying with Gemini Chatbot" section with setup, troubleshooting, and production notes.
- [x] Set up basic logging/monitoring for Gemini usage. **Done:** Added structured logging in geminiService.ts and session.ts for API calls and rate limits.
- [x] Plan for future enhancements (e.g., conversation history). **Done:** Added "Future Enhancements" section with features, priorities, and outlines.

*See `chatbot/phase5_deployment_monitoring.md` for detailed to-do list.*

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
- [x] Gemini responses are Socratic and helpful. **Done:** Verified responses guide reflection without direct answers.
- [x] No sensitive data leaked in prompts. **Done:** Prompts include session context but sanitized in logs.
- [x] UI integrates seamlessly with session screen. **Done:** GeminiChat added to session screen with toggle.
- [x] Performance: Responses within 5-10 seconds. **Done:** Tested response times are acceptable.

---

## Open Questions

1. **Visibility:** Should Gemini responses be visible to all session users or only the requester? **Resolved:** Private to requester for privacy.
2. **Context Management:** How much session history should be included in prompts? (e.g., last 5 messages) **Resolved:** Last 5 answers included.
3. **Moderation:** What controls for inappropriate content? (e.g., filter queries, flag responses) **Resolved:** Basic rate limiting; future advanced moderation planned.
4. **Rate Limiting:** Per user, per session, or global? **Resolved:** Per user with reset time.
5. **Offline Mode:** How to handle Gemini unavailability? **Open:** Graceful error handling implemented.
6. **Ethical Guidelines:** Ensure AI promotes learning, not cheating. **Resolved:** Socratic style enforced.

---

## Future Enhancements

Post-deployment, consider the following enhancements to improve the Gemini chatbot:

### Potential Features
- **Conversation History Persistence:** Store user-Gemini interactions in the database for continuity across sessions.
- **User Feedback on Responses:** Allow users to rate or provide feedback on Gemini responses to improve quality.
- **Advanced Moderation:** Implement content filtering for inappropriate queries or responses.
- **Multi-language Support:** Enable Gemini to respond in different languages based on user preference.
- **Conversation Summaries:** Provide session summaries including key insights from Gemini interactions.

### Prioritization
- **High Priority:** Conversation history persistence (improves UX continuity).
- **Medium Priority:** User feedback (helps refine AI responses).
- **Low Priority:** Multi-language support (nice-to-have for global users).

### Implementation Outlines
1. **Conversation History:**
   - Add a new MongoDB collection for chat logs.
   - Modify session.ts to save queries/responses.
   - Update frontend to load and display history.
   - Estimated effort: 2-3 days. Dependencies: MongoDB schema updates.

2. **User Feedback:**
   - Add feedback buttons (thumbs up/down) in GeminiChat component.
   - Store feedback in database and log for analysis.
   - Estimated effort: 1-2 days. Dependencies: UI updates, new API endpoints.

### Open Questions
- **Data Retention:** How long to keep conversation history? (e.g., 30 days, or per session).
- **Privacy:** Ensure history is user-private and not shared.
- **Scalability:** Monitor database impact of storing chat logs.

### Review Schedule
- Schedule a review 2 weeks after deployment to gather user feedback and prioritize enhancements.
- Update this plan based on feedback and technical feasibility.

---

## Timeline (Estimated)
- Phase 1: 1-2 days **Completed**
- Phase 2: 3-4 days **Completed**
- Phase 3: 3-4 days **Completed**
- Phase 4: 2-3 days **Completed**
- Phase 5: 1 day **Completed**

## Resources
- Gemini API Documentation: [link]
- Mettle Docs: See `docs/` for existing patterns.

This plan is ready for implementation. Review and iterate as needed.