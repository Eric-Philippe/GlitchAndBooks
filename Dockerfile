# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory within the container

# Copy package.json and package-lock.json for client and install dependencies
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy package.json and package-lock.json for server and install dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy the rest of the client and server files
COPY client/ ./client/
COPY server/ ./server/

# Build the client and server
RUN cd client && npm run build
RUN cd server && npm run build

# Expose the desired port
EXPOSE 3000

# Start the server
CMD ["node", "server/dist/server.js"]
