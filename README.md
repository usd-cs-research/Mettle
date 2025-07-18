# MEttLE

MEttLE is a tool to assist engineering students in learning and solving estimation problems. To read about it, follow [this link](https://link.springer.com/article/10.1186/s41039-018-0083-y).  
# Setup
## Docker 
### Setup Run
**Pre-requisites**

- Docker Desktop
    - Go to [Get Docker Desktop](https://docs.docker.com/get-started/introduction/get-docker-desktop/) for a download
- Node JS
    - Go to [Download Node.js](https://nodejs.org/en/download) for download instructions


Once the pre-requisites are installed you can run this command in a terminal: 
```bash
npm run setup:docker
```
This script will build all the Docker images and make the required configurations for a local run of the application. You can view it in your browser at http://localhost:3000.

## Local Development
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
For adding the environment variables for the project, you'll need to  create a `.env.local` file in both `server` and `client` directory with the required variables.
### Server 
Copy the following contents in the `.env.local` file of server directory with **proper credentials**
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

