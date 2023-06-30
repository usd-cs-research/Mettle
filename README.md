# meTTle

--- description ---
# Setup
## Docker 
### Setup Run
```bash
npm run setup:docker
```
This script will build all the Docker images and make the required configurations for a local run of the application.
### Docker development
**Pre-requisites**

- Docker
- Docker-compose

```
npm run serve:docker
```
This script will set up everything and real-time development can be started directly by editing the code.
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
This script will serve the client on the specified port and can be accessed on http://localhost:3000 or any other port

## Environment Variables

## Configurations

Detailed configurations can be found in the respective folders README.md

