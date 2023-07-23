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
This script will build all the Docker images and make the required configurations for a local run of the application.
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

## Configurations

Detailed configurations can be found in the respective folders README.md

