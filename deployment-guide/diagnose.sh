#!/bin/bash

# EC2 Website Deployment Diagnostic Script
# Run this on your EC2 instance to collect diagnostic information

echo "=================================================="
echo "EC2 Website Deployment Diagnostic Report"
echo "Generated: $(date)"
echo "=================================================="
echo ""

echo "=== 1. PM2 Status ==="
pm2 status
echo ""

echo "=== 2. PM2 Logs (Last 30 lines) ==="
pm2 logs website-builder --lines 30 --nostream 2>&1 || echo "PM2 logs not available"
echo ""

echo "=== 3. Port 3000 Check ==="
sudo netstat -tlnp | grep 3000 || echo "Port 3000 not listening"
echo ""

echo "=== 4. Test localhost:3000 ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000 2>&1
echo ""

echo "=== 5. Nginx Status ==="
sudo systemctl status nginx --no-pager | head -20
echo ""

echo "=== 6. Nginx Configuration Test ==="
sudo nginx -t 2>&1
echo ""

echo "=== 7. Nginx Error Log (Last 20 lines) ==="
sudo tail -20 /var/log/nginx/error.log 2>&1 || echo "No nginx error log available"
echo ""

echo "=== 8. Nginx Access Log (Last 10 lines) ==="
sudo tail -10 /var/log/nginx/access.log 2>&1 || echo "No nginx access log available"
echo ""

echo "=== 9. UFW Firewall Status ==="
sudo ufw status
echo ""

echo "=== 10. Disk Space ==="
df -h
echo ""

echo "=== 11. Memory Usage ==="
free -h
echo ""

echo "=== 12. Environment File Check ==="
if [ -f "/var/www/website-builder/.env" ]; then
    echo ".env file exists"
    echo "File size: $(stat -c%s /var/www/website-builder/.env) bytes"
    echo "Checking for required variables (without showing values):"
    grep -q "AWS_ACCESS_KEY_ID" /var/www/website-builder/.env && echo "✓ AWS_ACCESS_KEY_ID present" || echo "✗ AWS_ACCESS_KEY_ID missing"
    grep -q "AWS_SECRET_ACCESS_KEY" /var/www/website-builder/.env && echo "✓ AWS_SECRET_ACCESS_KEY present" || echo "✗ AWS_SECRET_ACCESS_KEY missing"
    grep -q "AWS_REGION" /var/www/website-builder/.env && echo "✓ AWS_REGION present" || echo "✗ AWS_REGION missing"
    grep -q "AWS_BUCKET_NAME" /var/www/website-builder/.env && echo "✓ AWS_BUCKET_NAME present" || echo "✗ AWS_BUCKET_NAME missing"
else
    echo "✗ .env file NOT FOUND at /var/www/website-builder/.env"
fi
echo ""

echo "=== 13. Build Directory Check ==="
if [ -d "/var/www/website-builder/.next" ]; then
    echo "✓ .next directory exists"
    echo "Build size: $(du -sh /var/www/website-builder/.next 2>/dev/null | cut -f1)"
else
    echo "✗ .next directory NOT FOUND - Build may have failed"
fi
echo ""

echo "=== 14. Node and NPM Versions ==="
node -v
npm -v
echo ""

echo "=== 15. Running Node Processes ==="
ps aux | grep node | grep -v grep
echo ""

echo "=================================================="
echo "Diagnostic Complete"
echo "=================================================="
echo ""
echo "Quick Checks:"
echo ""

# Check PM2
pm2 list 2>&1 | grep -q "online" && echo "✓ PM2 application is online" || echo "✗ PM2 application is NOT online"

# Check port 3000
sudo netstat -tlnp 2>&1 | grep -q ":3000" && echo "✓ Application is listening on port 3000" || echo "✗ Application is NOT listening on port 3000"

# Check nginx
sudo systemctl is-active --quiet nginx && echo "✓ Nginx is running" || echo "✗ Nginx is NOT running"

# Check nginx config
sudo nginx -t &>/dev/null && echo "✓ Nginx configuration is valid" || echo "✗ Nginx configuration has errors"

echo ""
echo "Copy this entire output when asking for help!"
