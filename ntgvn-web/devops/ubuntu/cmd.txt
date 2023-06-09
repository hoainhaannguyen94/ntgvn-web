# RUN UBUNTU IMAGE
docker run --name local-ubuntu -p 80:8080 -p 443:8443 -p 22:22 -itd ubuntu

# ENTER INTO UBUNTU CONTAINER
docker exec -it local-ubuntu bash
