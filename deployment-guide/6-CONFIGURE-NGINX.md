# Step 5: Configure Nginx as Reverse Proxy

## 5.1 Create Nginx Configuration File

```bash
sudo nano /etc/nginx/sites-available/website-builder
```

**Paste the following configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name YOUR_DOMAIN_OR_IP;  # Replace with your domain or EC2 public IP

    # Increase body size for file uploads
    client_max_body_size 50M;

    # Proxy settings
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

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Optimize static file serving
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Handle Next.js image optimization
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Error pages
    error_page 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

**Replace `YOUR_DOMAIN_OR_IP`** with one of:
- Your domain name: `example.com www.example.com`
- Your EC2 public IP: `13.233.XXX.XXX`

Save the file:
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

## 5.2 Enable the Configuration

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/website-builder /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm /etc/nginx/sites-enabled/default
```

## 5.3 Test Nginx Configuration

```bash
sudo nginx -t
```

You should see:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

## 5.4 Restart Nginx

```bash
sudo systemctl restart nginx

# Check nginx status
sudo systemctl status nginx
```

## 5.5 Test Your Application

Open your browser and navigate to:
```
http://13.233.XXX.XXX
```

Or if you configured a domain:
```
http://yourdomain.com
```

**Your application should now be accessible on port 80!**

---

**Next Step**: Proceed to `7-SETUP-SSL.md` (Optional but recommended for HTTPS)
