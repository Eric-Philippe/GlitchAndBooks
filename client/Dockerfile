# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire client application to the container
COPY . .

# Expose the port on which your React app will run
EXPOSE 80

# Build the React app
RUN npm run build

# Install npm i -g serve
RUN npm install -g serve

# Launch the client
CMD ["serve", "-s", "build", "-l", "80"]
