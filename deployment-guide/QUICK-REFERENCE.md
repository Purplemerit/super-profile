# Quick Deployment Reference

This is a condensed version for quick reference. For detailed instructions, see the numbered files.

## Complete Deployment Commands (Copy-Paste Ready)

### On AWS Console
1. Launch EC2 Ubuntu 22.04 (t2.small or higher)
2. Security Group: Ports 22, 80, 443, 3000
3. Download .pem key file
4. Note public IP address

### On Local Machine
```bash
# SSH into EC2 (replace path and IP)
ssh -i /path/to/key.pem ubuntu@YOUR_EC2_IP
```

### On EC2 Server (Run in order)

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# 3. Install PM2
sudo npm install -g pm2

# 4. Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 5. Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# 6. Create app directory
sudo mkdir -p /var/www/website-builder
sudo chown -R ubuntu:ubuntu /var/www/website-builder
cd /var/www/website-builder

# 7. Upload your files using SCP from local machine (in new terminal):
# scp -i /path/to/key.pem -r /path/to/project/* ubuntu@YOUR_EC2_IP:/var/www/website-builder/

# 8. Create .env file
nano .env
# Paste your environment variables, save with Ctrl+X, Y, Enter

# 9. Install dependencies and build
npm install
npm run build

# 10. Start with PM2
pm2 start npm --name "website-builder" -- start
pm2 save
pm2 startup
# Run the command that PM2 outputs

# 11. Configure Nginx
sudo nano /etc/nginx/sites-available/website-builder
```

Paste this nginx config:
```nginx
server {
    listen 80;
    server_name YOUR_EC2_IP;  # Replace with your IP or domain
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Continue:
```bash
# 12. Enable nginx config
sudo ln -s /etc/nginx/sites-available/website-builder /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 13. Done! Visit http://YOUR_EC2_IP
```

## SSL Setup (If you have a domain)

```bash
# Point your domain DNS to EC2 IP first, then:
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Common Maintenance Commands

```bash
# Update application
cd /var/www/website-builder
git pull  # or upload new files
npm install
npm run build
pm2 restart website-builder

# View logs
pm2 logs website-builder

# Restart services
pm2 restart website-builder
sudo systemctl restart nginx

# Check status
pm2 status
sudo systemctl status nginx
```

## Troubleshooting

```bash
# Check if app is running
pm2 status
curl http://localhost:3000

# Check logs
pm2 logs website-builder --lines 50
sudo tail -f /var/log/nginx/error.log

# Restart everything
pm2 restart website-builder
sudo systemctl restart nginx
```

## Environment Variables Template

```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your-bucket

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```
