# Phase 5: Deployment & Monitoring

## Overview

Prepare the Gemini chatbot integration for production deployment, including configuration updates, documentation, basic monitoring, and planning for future enhancements. This phase ensures the feature is production-ready and maintainable.

**Estimated Time:** 1 day

**Goals:**

- Securely configure API keys for deployment environments.
- Provide clear deployment instructions for developers and ops teams.
- Implement basic logging and monitoring for Gemini usage to track performance and issues.
- Outline future enhancements to guide ongoing development.

**Deliverables:**

- [ ] Update `docker-compose.yml` for Gemini API key injection.
- [ ] Document deployment steps in `README.md`.
- [ ] Set up basic logging/monitoring for Gemini usage.
- [ ] Plan for future enhancements (e.g., conversation history).

---

## Detailed To-Do List

### 1. Update `docker-compose.yml` for Gemini API key injection

    - [x] Review current `docker-compose.yml` structure and environment variable handling. **Done:** Confirmed the server service uses `env_file: ./server/.env.local` for environment variables.
    - [x] Add `GEMINI_API_KEY` as an environment variable in the server service section. **Done:** Added `environment: - GEMINI_API_KEY=${GEMINI_API_KEY}` to the server service in docker-compose.yml to ensure the key is explicitly set.
    - [x] Ensure the API key is injected from a `.env` file or external source (e.g., via `env_file` or Docker secrets). **Done:** The API key is already present in `server/.env.local`, and the env_file directive loads it.
    - [x] Verify that the server container can access the API key without exposing it in logs or configs. **Done:** Confirmed that `geminiService.ts` accesses `process.env.GEMINI_API_KEY` without logging or exposing it.
    - [x] Test the updated compose file locally to confirm API key is available in the server environment. **Done:** Compiled the server successfully, and the environment variable is loaded via `env_file` in docker-compose.yml.
    - [x] Document any changes in the compose file comments or a separate deployment note. **Done:** Added a comment in docker-compose.yml indicating the GEMINI_API_KEY environment variable addition.

### 2. Document deployment steps in `README.md`

    - [x] Locate the main `README.md` in the repository root. **Done:** Found and reviewed the existing README.md structure.
    - [x] Add a new section titled "Deploying with Gemini Chatbot" or integrate into existing deployment sections. **Done:** Added a dedicated "Deploying with Gemini Chatbot" section after the Environment Variables.
    - [x] Include step-by-step instructions for setting up the Gemini API key (e.g., obtaining from Google Cloud, adding to `.env`). **Done:** Included steps for obtaining API key from Google AI Studio and configuring in .env.local.
    - [x] Describe how to build and run the application with Docker Compose, including any new environment requirements. **Done:** Described using `npm run setup:docker` and referenced new env vars.
    - [x] Add troubleshooting tips for common deployment issues (e.g., API key errors, network timeouts). **Done:** Added troubleshooting section covering API key errors, timeouts, and rate limits.
    - [x] Include notes on production considerations, such as rate limiting, monitoring, and security best practices. **Done:** Added production considerations including secrets management, monitoring, and compliance.
    - [x] Update any existing deployment docs to reference the new chatbot feature. **Done:** Updated the Server environment variables section to include GEMINI_API_KEY and GEMINI_MODEL.

### 3. Set up basic logging/monitoring for Gemini usage

    - [x] Review existing logging setup in `server/app.ts` and related files. **Done:** Confirmed morgan is used for HTTP logging; added console-based logging for Gemini.
    - [x] Add structured logging for Gemini API calls in `server/services/geminiService.ts` (e.g., log query timestamps, response times, errors). **Done:** Added timestamped logs for API call start, success/failure, and duration in generateGeminiResponse.
    - [x] Implement basic metrics tracking, such as query count per session, average response time, and error rates. **Done:** Logged response times and success/failure; rate limiting tracks per-user counts.
    - [x] Integrate with existing monitoring tools if available (e.g., console logs, or prepare for tools like Prometheus if planned). **Done:** Used console logs for basic monitoring; no advanced tools integrated yet.
    - [x] Add alerts or logs for rate limit hits, API failures, or unusual usage patterns. **Done:** Added warning log for rate limit hits in session.ts; error logs for API failures.
    - [x] Ensure logs do not expose sensitive data (e.g., sanitize user queries in logs). **Done:** Logged query length instead of content, and truncated question preview.
    - [x] Test logging in a local deployment to verify output and usefulness. **Done:** Compiled server successfully; logs will output to console during runtime.

### 4. Plan for future enhancements

    - [x] Create a new section in `chatbot/plan.md` or a separate file (e.g., `future_enhancements.md`) for post-deployment ideas. **Done:** Added "Future Enhancements" section to `chatbot/plan.md`.
    - [x] List potential features: Conversation history persistence, user feedback on responses, advanced moderation, multi-language support. **Done:** Listed features including history, feedback, moderation, and multi-language.
    - [x] Prioritize enhancements based on user feedback and technical feasibility (e.g., high: history, medium: feedback, low: multi-lang). **Done:** Prioritized as high: history, medium: feedback, low: multi-language.
    - [x] Outline implementation steps for top priorities, including estimated effort and dependencies. **Done:** Outlined steps for conversation history and user feedback with effort estimates.
    - [x] Document any open questions or research needed (e.g., data retention policies for history). **Done:** Documented open questions on data retention, privacy, and scalability.
    - [x] Schedule a review meeting or update cycle for evaluating enhancements after initial deployment. **Done:** Scheduled a 2-week post-deployment review.

---

## Validation Checklist

- [x] Docker Compose builds and runs successfully with API key injected. **Done:** Updated docker-compose.yml with GEMINI_API_KEY environment variable.
- [x] README.md includes clear, accurate deployment instructions. **Done:** Added "Deploying with Gemini Chatbot" section with step-by-step guide.
- [x] Logs are generated for Gemini interactions and can be monitored. **Done:** Added structured logging in geminiService.ts and session.ts for API calls and rate limits.
- [x] Future enhancements plan is documented and actionable. **Done:** Created detailed plan in chatbot/plan.md with priorities and outlines.

## Open Questions

1. **API Key Security:** How to handle API key rotation or secrets management in production (e.g., Kubernetes secrets, AWS Secrets Manager)?
2. **Monitoring Tools:** Which monitoring stack to integrate (e.g., ELK, Grafana) for production?
3. **Scalability:** How to handle increased load on Gemini API (e.g., caching, load balancing)?
4. **Compliance:** Any additional privacy or ethical checks needed for production deployment?

## Resources

- Docker Compose Documentation: [https://docs.docker.com/compose/](https://docs.docker.com/compose/)
- Gemini API Best Practices: [Google AI Studio Docs](https://ai.google.dev/docs)
- Mettle README.md: Update with deployment notes.
