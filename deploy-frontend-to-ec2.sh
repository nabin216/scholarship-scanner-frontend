#!/bin/bash

# Frontend Deployment Script for EC2
# This script deploys the Next.js frontend to your EC2 instance

echo "🚀 Starting Frontend Deployment to EC2..."

# Configuration
EC2_USER="ubuntu"  # Change if your EC2 user is different
EC2_HOST="13.61.181.192"
REMOTE_PATH="/var/www/scholarship-portal"
LOCAL_BUILD_PATH="./out"  # Next.js static export directory

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build the frontend for production
echo -e "${YELLOW}📦 Building frontend for production...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Please fix build errors before deploying.${NC}"
    exit 1
fi

# Step 2: Create static export (optional - for pure static hosting)
echo -e "${YELLOW}📤 Creating static export...${NC}"
npm run export 2>/dev/null || echo "Static export not configured, using build output"

# Step 3: Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
tar -czf frontend-deploy.tar.gz -C .next/static . 2>/dev/null || tar -czf frontend-deploy.tar.gz .next/

# Step 4: Upload to EC2
echo -e "${YELLOW}🌐 Uploading to EC2...${NC}"
scp frontend-deploy.tar.gz ${EC2_USER}@${EC2_HOST}:/tmp/

# Step 5: Deploy on EC2
echo -e "${YELLOW}🔧 Deploying on EC2...${NC}"
ssh ${EC2_USER}@${EC2_HOST} << 'EOF'
# Create frontend directory
sudo mkdir -p /var/www/scholarship-portal/frontend
cd /var/www/scholarship-portal/frontend

# Extract new frontend
sudo rm -rf * 2>/dev/null || true
sudo tar -xzf /tmp/frontend-deploy.tar.gz

# Set permissions
sudo chown -R www-data:www-data /var/www/scholarship-portal/frontend
sudo chmod -R 755 /var/www/scholarship-portal/frontend

# Configure Nginx for frontend
sudo tee /etc/nginx/sites-available/scholarship-frontend > /dev/null << 'NGINX_CONFIG'
server {
    listen 80;
    server_name _;
    
    # Frontend (Next.js static files)
    location / {
        root /var/www/scholarship-portal/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API Backend (Django)
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Admin Backend (Django)
    location /admin/ {
        proxy_pass http://localhost:8000/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files for Django admin
    location /static/ {
        alias /var/www/scholarship-portal/scholarship-backend/static/;
    }
}
NGINX_CONFIG

# Enable the site
sudo ln -sf /etc/nginx/sites-available/scholarship-frontend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Frontend deployed successfully!"
EOF

# Clean up
rm -f frontend-deploy.tar.gz

echo -e "${GREEN}🎉 Frontend deployment completed!${NC}"
echo -e "${GREEN}🌐 Your site should be available at: http://13.61.181.192${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Test the frontend: http://13.61.181.192"
echo -e "   2. Test the API: http://13.61.181.192/api/"
echo -e "   3. Test the admin: http://13.61.181.192/admin/"
