# RUN UBUNTU IMAGE
docker run --name ntgvn-ubuntu -p 80:8080 -p 443:8443 -p 22:22 -itd ubuntu:latest

# ENTER INTO UBUNTU CONTAINER
docker exec -it ntgvn-ubuntu bash
