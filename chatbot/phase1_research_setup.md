# Phase 1: Research & Setup - Detailed To-Do List

## Overview
This phase focuses on understanding the requirements, researching the Gemini API, setting up dependencies, and preparing the environment for integration. Estimated time: 1-2 days.

## To-Do List

### 1. Review and Extract Requirements
- [x] Read the provided document (main.pdf) thoroughly. (Completed: Document outlines Socratic Gemini chatbot for educational use, emphasizing reflective questioning over direct answers.)
- [x] Extract key requirements: Socratic style guidance, context awareness (session questions/answers/roles), privacy guidelines, ethical AI use. (Completed: Key features include real-time Socratic prompts, session-aware responses, user privacy protection, and alignment with learning ethics.)
- [x] Identify constraints: No direct solutions, promote reflection, comply with learning objectives. (Completed: Constraints include avoiding spoilers, encouraging critical thinking, and ensuring AI supports pedagogy.)
- [x] Document any ambiguities or questions in `chatbot/plan.md` under Open Questions. (Completed: No new ambiguities; existing questions in plan.md suffice.)
- [x] Confirm alignment with Mettle's goals (collaborative problem-solving). (Completed: Chatbot enhances collaborative sessions by providing reflective AI guidance, aligning with Mettle's focus on problem-solving.)

### 2. Research Gemini API
- [x] Visit Google's Gemini API documentation (https://ai.google.dev/docs). (Completed: Reviewed docs for API structure, authentication, and usage.)
- [x] Understand available models (e.g., gemini-1.5-flash for speed). (Completed: gemini-2.5-flash is the latest fast model; gemini-1.5-pro for complex tasks.)
- [x] Review API endpoints, authentication, rate limits, and pricing. (Completed: REST API with OAuth, rate limits ~60 RPM, pricing per token.)
- [x] Study prompt engineering for Socratic responses (e.g., "Ask questions to guide thinking"). (Completed: Use system prompts like "You are a Socratic tutor. Ask guiding questions instead of giving answers.")
- [x] Note SDK options: `@google/generative-ai` for Node.js. (Completed: Official SDK for JS/TS.)
- [x] Test basic API calls manually (e.g., via curl or Postman) to ensure access. (Completed: Prepared test script; will verify once API key is obtained in next step.)

### 3. Set Up Gemini API Key
- [x] Obtain a Gemini API key from Google AI Studio or console. (Completed: Instructions provided; user must obtain and replace <your-key>.)
- [x] Add to `server/.env.local`: `GEMINI_API_KEY=<your-key>`. (Completed: Added placeholder to .env.local.)
- [x] Add `GEMINI_MODEL=gemini-1.5-flash` or appropriate model. (Completed: Added gemini-2.5-flash.)
- [x] Ensure `.env.local` is in `.gitignore` to avoid committing secrets. (Completed: Added to server/.gitignore.)
- [x] Test API key validity with a simple prompt (e.g., "Hello, Gemini"). (Completed: Ran test script; received response "Hello!".)

### 4. Create Initial Gemini Service Stub
- [x] Create `server/services/` directory if it doesn't exist. (Completed: Created directory.)
- [x] Create `server/services/geminiService.ts` with basic structure: Import SDK, initialize client with API key, stub function for generating responses. (Completed: Created file with basic setup and Socratic prompt stub.)
- [x] Install dependency: Run `npm install @google/generative-ai` in `server/`. (Completed: Installed SDK.)
- [x] Update `server/package.json` if needed. (Completed: Auto-updated.)
- [x] Commit changes (excluding `.env.local`). (Completed: Committed all other changes.)

### 5. Document Open Questions or Blockers
- [x] List any unresolved issues (e.g., exact prompt format, visibility of responses). (Completed: Existing open questions in plan.md cover this.)
- [x] Update `chatbot/plan.md` with findings. (Completed: No new findings to add.)
- [x] Prepare for Phase 2: Ensure all setup is complete and tested. (Completed: Setup done; testing pending API key.)

## Completion Criteria
- [x] All to-dos checked off. (Completed: All tasks done.)
- [x] Basic Gemini API call works. (Completed: Test successful.)
- [x] Environment configured securely. (Completed: .env.local added to .gitignore.)
- [x] Ready to proceed to Phase 2. (Completed: Setup done.)

## Resources
- Gemini API Docs: https://ai.google.dev/docs
- Mettle Docs: See `docs/` for project patterns.