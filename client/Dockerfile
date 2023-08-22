# Use an official Node.js runtime as the base image
FROM node:20-alpine3.17

# Set the working directory in the container
WORKDIR /app

# Copy the .env file to the container
COPY .env ./

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./ 

# Install project dependencies
RUN npm install

# Copy the entire client application to the container
COPY . .

# Display the contents of the current directory
RUN ls -al

# Expose the port on which your React app will run
EXPOSE 80

# Install global dependency 'serve'
RUN npm install -g serve

# Build the React app
RUN npm run build

# Launch the client
CMD ["serve", "-s", "build", "-l", "80"]
