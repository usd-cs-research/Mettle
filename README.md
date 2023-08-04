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
### Setup

```bash
npm run setup:dev
```
This script will install all the required dependencies and compile and build all the required files

### Serving 
```
npm run serve:server
```
This script will run the server on a particular port.

```
npm run serve:client
```
This script will serve the client on the specified port and can be accessed on http://localhost:5000 or any other port

## Environment Variables
For adding the environment variables for the project create a `.env.local` file in both `server` and `client` directory with the required variables.
### Server 
Copy the following contents in the `.env.local` file of server directory with proper credentials
```
MONGODB_URL_DOCKER="mongodb://root:secret@mongo:4000/mettle?authSource=admin"
PORT=5000
MONGODB_URL="mongodb+srv://<username>:<password>@cluster0.zzpjqzz.mongodb.net/prod"
JWT_SECRET="somesecret"
```
### Client
Copy the following content in the `.env.local` file of the client directory
```
REACT_APP_API_URL="http://localhost:5000"
```
## Configurations

Detailed configurations can be found in the respective folders README.md

