# meTTle

--- description ---
# Setup
## Docker 
### Setup Run
**Pre-requisites**

- Docker
- Docker-compose
```bash
npm run setup:docker
```
This script will build all the Docker images and make the required configurations for a local run of the application in an interactive terminal.
## Local Development
**Pre-requisites**

- Node JS
- MongoDB (install with `sudo pacman -S mongodb` on Manjaro, or equivalent for your distro)

### Setup

```bash
npm run setup:dev
```

This script will install all the required dependencies and compile and build all the required files

### Starting Services

First, start MongoDB:

```bash
sudo systemctl start mongodb
```

Or for manual start:

```bash
mongod --dbpath /var/lib/mongodb
```

Then start the server:

```bash
npm run serve:server
```

And in another terminal, start the client:

```bash
npm run serve:client
```

### Serving 
The client will be accessible on http://localhost:3000, and the server API on http://localhost:5000.

## Environment Variables
For adding the environment variables for the project create a `.env.local` file in both `server` and `client` directory with the required variables.
### Server 
Copy the following contents in the `.env.local` file of server directory with proper credentials
```
MONGODB_URL_DOCKER="mongodb://root:secret@mongo:4000/mettle?authSource=admin"
PORT=5000
MONGODB_URL="mongodb+srv://<username>:<password>@cluster0.zzpjqzz.mongodb.net/prod"
JWT_SECRET="somesecret"
GEMINI_API_KEY="<your-gemini-api-key>"
GEMINI_MODEL="gemini-2.5-flash"
```
### Client
Copy the following content in the `.env.local` file of the client directory
```
REACT_APP_API_URL="http://localhost:5000"
```

## Deploying with Gemini Chatbot

The application includes an optional Gemini AI chatbot for Socratic guidance in sessions. To enable this feature:

1. **Obtain a Gemini API Key:**
   - Visit [Google AI Studio](https://ai.google.dev/aistudio) and create an API key.

2. **Configure Environment Variables:**
   - Add `GEMINI_API_KEY` and `GEMINI_MODEL` to `server/.env.local` as shown above.

3. **Build and Run with Docker Compose:**
   - Ensure Docker and Docker Compose are installed.
   - Run `npm run setup:docker` to build and start the services.
   - The chatbot will be available in session screens.

4. **Troubleshooting:**
   - **API Key Errors:** Verify the key is valid and has sufficient quota.
   - **Network Timeouts:** Check internet connectivity for Gemini API calls.
   - **Rate Limits:** The server implements rate limiting; avoid excessive queries.

5. **Production Considerations:**
   - Use secure secrets management (e.g., Docker secrets, Kubernetes secrets) for the API key.
   - Monitor API usage to avoid unexpected costs.
   - Ensure compliance with privacy regulations; responses are private to the user.

For more details, see the chatbot documentation in `docs/`.
```
## Configurations

Detailed configurations can be found in the respective folders README.md

