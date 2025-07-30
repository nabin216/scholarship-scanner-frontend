# EC2 Frontend Deployment Guide

## Prerequisites
- Your EC2 instance is running and accessible via SSH
- You have the SSH key for your EC2 instance
- Node.js and npm are installed locally

## Quick Deployment Steps

### 1. Update Environment Variables
First, update your production environment variables:

```bash
# Create or update .env.production
echo "NEXT_PUBLIC_API_URL=http://13.61.181.192/api" > .env.production
```

### 2. Configure Next.js for Static Export (Optional)
Add to your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For server deployment
  // OR
  // output: 'export',  // For static deployment
  // trailingSlash: true,
  // images: { unoptimized: true }
}

module.exports = nextConfig
```

### 3. Run Deployment Script
```bash
# Make script executable (Git Bash/WSL)
chmod +x deploy-frontend-to-ec2.sh

# Run deployment
./deploy-frontend-to-ec2.sh
```

### 4. Manual SSH Alternative
If the script doesn't work, deploy manually:

```bash
# 1. Build locally
npm run build

# 2. Create deployment package
tar -czf frontend.tar.gz .next/

# 3. Upload to EC2
scp -i your-key.pem frontend.tar.gz ubuntu@13.61.181.192:/tmp/

# 4. SSH and deploy
ssh -i your-key.pem ubuntu@13.61.181.192
sudo mkdir -p /var/www/scholarship-portal/frontend
cd /var/www/scholarship-portal/frontend
sudo tar -xzf /tmp/frontend.tar.gz
sudo chown -R www-data:www-data .
```

## Testing Your Deployment

After deployment, test these URLs:

- **Frontend**: http://13.61.181.192
- **API**: http://13.61.181.192/api/
- **Admin**: http://13.61.181.192/admin/

## Nginx Configuration

The deployment script automatically configures Nginx to:
- Serve frontend on root path `/`
- Proxy API requests to `/api/`
- Proxy admin requests to `/admin/`

## Troubleshooting

### If deployment fails:
1. Check EC2 security groups (port 80 open)
2. Verify SSH access: `ssh ubuntu@13.61.181.192`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Check Django backend is running: `sudo systemctl status scholarship-portal`

### Common Issues:
- **Build fails**: Fix TypeScript/lint errors first
- **SSH connection refused**: Check security groups
- **502 Bad Gateway**: Django backend not running
- **404 errors**: Check Nginx configuration

## Architecture After Deployment

```
Client Browser → Nginx (Port 80) → {
    / → Next.js Frontend
    /api/ → Django Backend (Port 8000)
    /admin/ → Django Admin (Port 8000)
}
```
