# RUN UBUNTU IMAGE
docker run --name ntgvn-ubuntu --network ntgvn-network -p 80:8080 -p 443:8443 -p 22:22 -itd ubuntu:latest

# ENTER INTO UBUNTU CONTAINER
docker exec -it ntgvn-ubuntu bash

# PACKAGES
apt update
apt install nano -y
apt install net-tools -y
apt install neofetch -y
apt install iputils-ping -y
apt install nginx -y
apt install systemctl -y
systemctl enable nginx
apt install curl -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install --lts
