# Step 4: Setup PM2 Process Manager

PM2 will keep your application running in the background and automatically restart it if it crashes.

## 4.1 Start Application with PM2

```bash
cd /var/www/website-builder

# Start the application with PM2
pm2 start npm --name "website-builder" -- start
```

## 4.2 Configure PM2 Startup

```bash
# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup

# Copy and run the command that PM2 outputs
# It will look something like:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

**Important**: Copy the command that PM2 outputs and run it.

## 4.3 Verify PM2 is Running

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs website-builder

# View monitoring dashboard
pm2 monit
```

Press `Ctrl + C` to exit the dashboard.

## 4.4 Useful PM2 Commands

```bash
# Restart application
pm2 restart website-builder

# Stop application
pm2 stop website-builder

# Delete application from PM2
pm2 delete website-builder

# View real-time logs
pm2 logs website-builder --lines 100

# Clear logs
pm2 flush
```

## 4.5 Test Application is Running

```bash
# Check if app is responding
curl http://localhost:3000
```

You should see HTML output from your Next.js application.

---

**Next Step**: Proceed to `6-CONFIGURE-NGINX.md`
