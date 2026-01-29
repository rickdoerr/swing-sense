#!/bin/bash

# Build the docker images
docker compose build

# Save the agent image
docker save -o agent_image.tar swing-sense-agent:latest

# Save the webapp image
docker save -o webapp_image.tar swing-sense-webapp:latest

# Transfer to host
#scp docker-compose.yaml agent_image.tar webapp_image.tar svetlo@webserver.local:~/swing-sense/

# Load the images into cache
docker load -i agent_image.tar
docker load -i webapp_image.tar

# Run the deployment
docker compose up -d