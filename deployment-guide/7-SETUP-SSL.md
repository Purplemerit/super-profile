# Step 6: Setup SSL Certificate (HTTPS) - Optional

**Prerequisites**:
- You must have a domain name (e.g., example.com)
- Domain DNS must point to your EC2 public IP

## 6.1 Point Domain to EC2

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add/Edit DNS records:
   ```
   Type: A
   Name: @ (or your domain)
   Value: 13.233.XXX.XXX (your EC2 public IP)
   TTL: 3600

   Type: A
   Name: www
   Value: 13.233.XXX.XXX (your EC2 public IP)
   TTL: 3600
   ```
3. Wait 5-60 minutes for DNS propagation

## 6.2 Install Certbot

```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx
```

## 6.3 Obtain SSL Certificate

**Replace `yourdomain.com` with your actual domain:**

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
1. Enter your email address
2. Agree to terms of service (Y)
3. Choose whether to share email with EFF (your choice)
4. Certbot will automatically configure SSL

## 6.4 Test SSL Certificate

Open your browser and navigate to:
```
https://yourdomain.com
```

You should see a padlock icon indicating a secure connection.

## 6.5 Test Auto-Renewal

```bash
# Test renewal process (dry run)
sudo certbot renew --dry-run
```

Certbot will automatically renew your certificate before it expires.

## 6.6 Updated Nginx Configuration (Post-SSL)

Your nginx configuration should now look like this:

```bash
sudo cat /etc/nginx/sites-available/website-builder
```

Certbot automatically updated it to redirect HTTP to HTTPS.

---

**Congratulations! Your application is now deployed with SSL.**
