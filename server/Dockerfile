FROM node

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm ci

COPY . .

EXPOSE 5000

RUN npm install -g typescript

RUN tsc

CMD ["npm","run","dev"]