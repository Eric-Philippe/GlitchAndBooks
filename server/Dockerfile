# Use an official Node.js image as the base image
FROM node:14-alpine

# Set the working directory inside the container for the server
WORKDIR /app/server

# Copy package.json and package-lock.json to the container
COPY server/package*.json ./

# Install server dependencies
RUN npm install

# Copy the rest of the server application code to the container
COPY server/ .

# Build the Express app
RUN npm run build