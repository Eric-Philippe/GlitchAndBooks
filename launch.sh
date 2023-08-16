#bin/bash

echo "Stopping all the previous running containers"

# Stop all running containers
sudo docker stop $(sudo docker ps -q)

echo "Build the "

# Build and run the containers in the background
sudo docker-compose up --build &

