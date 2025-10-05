# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory within the container

# Copy package.json and package-lock.json for client and install dependencies
COPY client/package*.json ./client/
RUN cd client && npm install --silent

# Copy package.json and package-lock.json for server and install dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --silent

# Copy the rest of the client and server files
COPY client/ ./client/
COPY server/ ./server/

# Build the client and server
RUN cd client && npm run build
RUN cd server && npm run build

# Delete client node_modules to reduce image size
RUN rm -rf client/node_modules

# Expose the desired port
EXPOSE 80

# Start the server
CMD ["node", "server/dist/server.js"]
