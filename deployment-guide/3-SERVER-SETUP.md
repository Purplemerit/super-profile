# Step 2: Server Setup and Dependencies

**Make sure you're SSH'd into your EC2 instance before running these commands.**

## 2.1 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

## 2.2 Install Node.js 20.x (LTS)

```bash
# Install curl if not already installed
sudo apt install -y curl

# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node -v
npm -v
```

Expected output:
```
node -v  -> v20.x.x
npm -v   -> 10.x.x
```

## 2.3 Install Git

```bash
sudo apt install -y git

# Verify installation
git --version
```

## 2.4 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Verify installation
pm2 -v
```

## 2.5 Install Nginx

```bash
sudo apt install -y nginx

# Start nginx
sudo systemctl start nginx

# Enable nginx to start on boot
sudo systemctl enable nginx

# Check nginx status
sudo systemctl status nginx
```

Press `q` to exit the status view.

## 2.6 Configure Firewall (UFW)

```bash
# Allow OpenSSH
sudo ufw allow OpenSSH

# Allow Nginx Full (HTTP + HTTPS)
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check firewall status
sudo ufw status
```

## 2.7 Verify Nginx is Running

Open your browser and navigate to your EC2 public IP:
```
http://13.233.XXX.XXX
```

You should see the default Nginx welcome page.

---

**Next Step**: Proceed to `4-DEPLOY-APPLICATION.md`
