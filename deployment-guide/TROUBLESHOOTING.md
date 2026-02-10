# Troubleshooting Guide - Website Not Loading on EC2

## Quick Diagnostic Checklist

Follow these steps to identify and fix the issue:

### 1. Check if PM2 is Running

```bash
pm2 status
```

**Expected output**: `website-builder` should show `status: online`

**If status is `errored` or `stopped`:**
```bash
# View detailed logs
pm2 logs website-builder --lines 50

# Try restarting
pm2 restart website-builder

# If restart fails, check detailed error
pm2 describe website-builder
```

### 2. Check if Application is Responding on Port 3000

```bash
# Test from within EC2
curl http://localhost:3000

# Or check if port 3000 is listening
sudo netstat -tlnp | grep 3000
```

**Expected**: You should see HTML output or see node process on port 3000

**If not working:**
```bash
# Check application logs
pm2 logs website-builder --lines 100

# Common issues to look for in logs:
# - "Error: Cannot find module" -> run: npm install
# - "EADDRINUSE" -> Port already in use
# - Environment variable errors -> check .env file
```

### 3. Test Application Manually

```bash
cd /var/www/website-builder

# Stop PM2
pm2 stop website-builder

# Run manually to see errors
npm run start
```

This will show you real-time errors. Common issues:

#### Issue: "Module not found" or "Cannot find module"
```bash
# Solution: Reinstall dependencies
npm install
npm run build
pm2 restart website-builder
```

#### Issue: "Port 3000 already in use"
```bash
# Solution: Find and kill the process
sudo lsof -ti:3000 | xargs kill -9
pm2 restart website-builder
```

#### Issue: Environment variables not loading
```bash
# Solution: Verify .env file exists and has correct values
cat /var/www/website-builder/.env

# Make sure file is in the correct location
ls -la /var/www/website-builder/.env

# Restart after fixing
pm2 restart website-builder
```

### 4. Check Nginx Configuration

```bash
# Test nginx config
sudo nginx -t

# Check if nginx is running
sudo systemctl status nginx

# View nginx error logs
sudo tail -f /var/log/nginx/error.log
```

**Common Nginx Issues:**

#### Issue: "Connection refused" in logs
**Cause**: Application is not running on port 3000
**Solution**: Fix PM2 issue first (see step 1-3)

#### Issue: "502 Bad Gateway"
**Cause**: Nginx can't connect to your app
```bash
# Check if app is running
pm2 status
curl http://localhost:3000

# Restart both services
pm2 restart website-builder
sudo systemctl restart nginx
```

#### Issue: Nginx config test fails
```bash
# Check syntax
sudo nginx -t

# If errors, review your config
sudo nano /etc/nginx/sites-available/website-builder

# Make sure server_name matches your IP or domain
# Make sure proxy_pass points to http://localhost:3000
```

### 5. Check Security Groups (AWS)

**Very Important**: Your EC2 Security Group must allow these ports:

1. Go to AWS Console -> EC2 -> Instances
2. Click your instance
3. Click "Security" tab
4. Click on your security group
5. Check "Inbound rules"

**Required rules:**
```
Type: SSH
Port: 22
Source: Your IP or 0.0.0.0/0

Type: HTTP
Port: 80
Source: 0.0.0.0/0

Type: Custom TCP (for testing)
Port: 3000
Source: 0.0.0.0/0
```

**If port 80 is not open**, add it:
1. Click "Edit inbound rules"
2. Add rule: Type = HTTP, Port = 80, Source = 0.0.0.0/0
3. Save rules

### 6. Check Firewall (UFW)

```bash
# Check UFW status
sudo ufw status

# If needed, allow Nginx
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### 7. Test Direct Access to Port 3000

**From your browser**, try accessing:
```
http://YOUR_EC2_IP:3000
```

**If port 3000 works but port 80 doesn't:**
- Issue is with Nginx configuration
- Follow step 4 above

**If port 3000 also doesn't work:**
- Issue is with the application itself
- Follow steps 1-3 above

### 8. Check Build Output

```bash
cd /var/www/website-builder

# Check if .next folder exists
ls -la .next/

# If missing or empty, rebuild
npm run build

# Watch for errors during build
# If build succeeds, restart
pm2 restart website-builder
```

### 9. Memory Issues

```bash
# Check available memory
free -h

# If low memory, check running processes
top

# Press 'q' to exit
```

**If out of memory:**
```bash
# Create swap file (2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify swap is active
free -h

# Rebuild
cd /var/www/website-builder
npm run build
pm2 restart website-builder
```

## Complete Reset Procedure

If nothing works, try this complete reset:

```bash
# 1. Stop PM2
pm2 stop website-builder
pm2 delete website-builder

# 2. Clean up
cd /var/www/website-builder
rm -rf .next
rm -rf node_modules

# 3. Reinstall
npm install

# 4. Rebuild
npm run build

# 5. Restart with PM2
pm2 start npm --name "website-builder" -- start
pm2 save

# 6. Restart Nginx
sudo systemctl restart nginx

# 7. Check status
pm2 status
sudo systemctl status nginx
```

## Viewing Logs (Most Important for Debugging)

### Application Logs (PM2)
```bash
# Real-time logs
pm2 logs website-builder

# Last 100 lines
pm2 logs website-builder --lines 100

# Only errors
pm2 logs website-builder --err

# Clear all logs and start fresh
pm2 flush
```

### Nginx Logs
```bash
# Error logs
sudo tail -f /var/log/nginx/error.log

# Access logs
sudo tail -f /var/log/nginx/access.log

# Last 50 lines of errors
sudo tail -50 /var/log/nginx/error.log
```

### System Logs
```bash
# Nginx service logs
sudo journalctl -u nginx -n 50

# Follow logs in real-time
sudo journalctl -u nginx -f
```

## Common Error Messages and Solutions

### Error: "ECONNREFUSED"
**Cause**: Application not running or not listening on correct port
**Solution**:
```bash
pm2 restart website-builder
curl http://localhost:3000
```

### Error: "Cannot find module"
**Cause**: Dependencies not installed or out of sync
**Solution**:
```bash
cd /var/www/website-builder
npm install
pm2 restart website-builder
```

### Error: "Permission denied"
**Cause**: Wrong file ownership
**Solution**:
```bash
sudo chown -R ubuntu:ubuntu /var/www/website-builder
```

### Error: "Address already in use"
**Cause**: Port 3000 is occupied
**Solution**:
```bash
sudo lsof -ti:3000 | xargs kill -9
pm2 restart website-builder
```

### Error: "502 Bad Gateway"
**Cause**: Nginx can't reach your app
**Solution**:
```bash
# Check if app is running
pm2 status
pm2 logs website-builder

# Restart both
pm2 restart website-builder
sudo systemctl restart nginx
```

### Error: AWS S3 "Access Denied"
**Cause**: Wrong AWS credentials or permissions
**Solution**:
```bash
# Check .env file
cat /var/www/website-builder/.env

# Verify AWS credentials are correct
# Make sure AWS_BUCKET_NAME matches your actual bucket
# Restart after fixing
pm2 restart website-builder
```

## Still Not Working?

**Collect diagnostic information:**

```bash
# Run this script to collect all relevant info
echo "=== PM2 Status ===" && pm2 status
echo "=== PM2 Logs (last 20) ===" && pm2 logs website-builder --lines 20 --nostream
echo "=== Port 3000 Check ===" && sudo netstat -tlnp | grep 3000
echo "=== Nginx Status ===" && sudo systemctl status nginx --no-pager
echo "=== Nginx Config Test ===" && sudo nginx -t
echo "=== Nginx Error Log ===" && sudo tail -20 /var/log/nginx/error.log
echo "=== Firewall ===" && sudo ufw status
echo "=== Disk Space ===" && df -h
echo "=== Memory ===" && free -h
echo "=== Environment Check ===" && cd /var/www/website-builder && ls -la .env
```

Copy this output when asking for help.

## Quick Test Checklist

- [ ] PM2 shows status: online
- [ ] `curl http://localhost:3000` returns HTML
- [ ] Nginx config test passes: `sudo nginx -t`
- [ ] Port 80 is open in AWS Security Group
- [ ] UFW allows Nginx: `sudo ufw status`
- [ ] `.env` file exists with correct values
- [ ] Build completed without errors
- [ ] No errors in PM2 logs
- [ ] No errors in Nginx logs
