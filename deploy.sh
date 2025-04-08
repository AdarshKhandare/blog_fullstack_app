#!/bin/bash

# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory
sudo mkdir -p /opt/blog-app
cd /opt/blog-app

# Clone repository (replace with your repository)
git clone https://github.com/yourusername/blog-app.git .

# Build and start containers
sudo docker-compose up -d --build

# Set up Nginx as reverse proxy
sudo apt-get install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/blog-app << EOF
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/blog-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com

# Set up automatic updates
sudo tee /etc/cron.daily/docker-update << EOF
#!/bin/bash
docker-compose -f /opt/blog-app/docker-compose.yml pull
docker-compose -f /opt/blog-app/docker-compose.yml up -d
EOF

sudo chmod +x /etc/cron.daily/docker-update

echo "Deployment completed successfully!" 