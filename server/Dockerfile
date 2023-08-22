# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY ./client/package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY ./client ./

# Build the React app for production
RUN npm run build

# Expose the port that your React app will listen on (usually 3000)
EXPOSE 3000

# Define the command to start your React app
CMD ["npm", "start"]
