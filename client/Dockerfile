# Use an official Node.js runtime as the base image
FROM node:14

WORKDIR /app/client

# Copy package.json and package-lock.json to the container
COPY client/package*.json ./

# Install client dependencies
RUN npm install

# Copy the rest of the client application code to the container
COPY client/ .

# Build the React app
RUN npm run build

# Install npm i -g serve
RUN npm install -g serve

# Launch the client
CMD ["serve", "-s", "build", "-l", "80"]
