# MEttLE

MEttLE is a tool to assist engineering students in learning and solving estimation problems. To read about it, follow [this link](https://link.springer.com/article/10.1186/s41039-018-0083-y).  
# Setup

**Pre-requisites**

- Docker Desktop
    - Go to [Get Docker Desktop](https://docs.docker.com/get-started/introduction/get-docker-desktop/) for a download
- Node JS
    - Go to [Download Node.js](https://nodejs.org/en/download) for download instructions
- MongoDB Compass + Community Server
    - Go to [Download MondoDB Compass](https://www.mongodb.com/try/download/compass) to download the GUI
    - Go to [Download MongoDB Community Server](https://www.mongodb.com/try/download/community) to download the community server
    - MongoDB Compass won't work without the Community Server!

## Docker 
### Setup Run

Once the pre-requisites are installed you can run this command in a terminal: 
```bash
npm run setup:docker
```
This script will build all the Docker images and make the required configurations for a local run of the application. You'll need to have Docker Desktop open to view and manage the servers. Once it's up and running, you can view the MEttLE app in your browser at http://localhost:3000.



## Environment Variables
For adding the environment variables for the project, you'll need to  create a `.env.local` file in both `server` and `client` directory with the required variables.
### Server 

To get the dev environment working, copy the following contents in the `.env.local` file of server directory. 

```
MONGODB_URL_DOCKER="mongodb://root:secret@mongo:27017/mettle?authSource=admin"
PORT=5000
MONGODB_URL="mongodb://localhost:27017/mettle"
JWT_SECRET="somesecret"
```

If you have **proper credentials**, copy the following contents in the `.env.local` file of server directory and edit accordingly. If you don't have credentials use the above. 
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

## Running MongoDB
Before you run the development mode, you'll need to install and configure this MondoDB stuff. Make sure that you've installed both MongoDB Community Server and MongoDB Compass before proceeding. 

1. Open MongoDB Compass and add a new connection. Click Save and Connect. The URL should be http://localhost:27017, which is default. 
    - If you don't have the community server installed, you'll get a connection error. 
2. Hover over the new connection on the left and click the small '+' sign to create a new database. 
3. Name this new database "mettle" and name the collection "users". Then click "Create Database". 

Once these steps are completed you can run the local development commands and access the app at http://localhost:3000.


## Local Development
### Setup
You'll need to run all three of the following commands. The first one will run and stop but the serve commands will need to be running in separate terminals. 
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
Once these two processes are running, you can access the app at http://localhost:3000. 

## Other things to note
- You'll need to have a complete question created using a teacher account before fully accessing the tool. 
- You currently need two connections (one driver and one navigator) before you can start working on a question. 
    - Using two different browsers to access http://localhost:3000 works. 


## Configurations

Detailed configurations can be found in the respective folders README.md

