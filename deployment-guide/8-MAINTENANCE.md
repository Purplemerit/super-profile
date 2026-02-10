# Maintenance and Common Tasks

## Updating Your Application

### Method 1: Using Git

```bash
cd /var/www/website-builder

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild application
npm run build

# Restart PM2
pm2 restart website-builder
```

### Method 2: Manual Upload

1. Upload new files using SCP or FileZilla (see Step 3)
2. SSH into server and run:

```bash
cd /var/www/website-builder
npm install
npm run build
pm2 restart website-builder
```

## Viewing Logs

```bash
# PM2 logs (application logs)
pm2 logs website-builder

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## Restarting Services

```bash
# Restart application
pm2 restart website-builder

# Restart Nginx
sudo systemctl restart nginx

# Restart both
pm2 restart website-builder && sudo systemctl restart nginx
```

## Updating Environment Variables

```bash
cd /var/www/website-builder

# Edit .env file
nano .env

# After saving, restart application
pm2 restart website-builder
```

## Checking Server Resources

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# PM2 monitoring
pm2 monit
```

## Backup Your Application

```bash
# Create backup directory
mkdir -p ~/backups

# Backup application files
tar -czf ~/backups/website-builder-$(date +%Y%m%d).tar.gz /var/www/website-builder

# Backup .env separately (important!)
cp /var/www/website-builder/.env ~/backups/.env-$(date +%Y%m%d)
```

## Security Updates

```bash
# Update system packages regularly
sudo apt update && sudo apt upgrade -y

# Update Node.js packages
cd /var/www/website-builder
npm audit
npm audit fix
```

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs website-builder --lines 50

# Try manual start
cd /var/www/website-builder
npm run start
```

### Nginx Issues

```bash
# Check nginx configuration
sudo nginx -t

# Check nginx status
sudo systemctl status nginx

# Restart nginx
sudo systemctl restart nginx
```

### Out of Memory Errors

```bash
# Check memory
free -h

# If needed, create swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Port Already in Use

```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>

# Restart PM2
pm2 restart website-builder
```

## Monitoring Website Uptime

### Using PM2 Plus (Free Monitoring)

```bash
# Create account at https://app.pm2.io
pm2 link <secret_key> <public_key>

# Monitor from web dashboard
```

### Using UptimeRobot (External Monitoring)

1. Sign up at https://uptimerobot.com
2. Add your website URL
3. Get alerts when site goes down

## Security Checklist

- [ ] Keep system packages updated
- [ ] Keep Node.js and npm updated
- [ ] Don't expose port 3000 externally (remove from security group after nginx setup)
- [ ] Use SSL certificate (HTTPS)
- [ ] Regularly backup your application and database
- [ ] Monitor logs for suspicious activity
- [ ] Use strong passwords for SSH keys
- [ ] Disable root login via SSH
- [ ] Enable automatic security updates

```bash
# Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```
