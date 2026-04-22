FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy rest of code
COPY . .

# Build TypeScript
RUN npx tsc

EXPOSE 5000

CMD ["npm", "run", "dev"]