# Pre-Deployment Checklist

## What You'll Need

1. **AWS Account with EC2 access**
2. **Domain name** (optional, but recommended)
3. **Your environment variables** (AWS keys, Razorpay keys, email credentials)
4. **SSH client** (PuTTY for Windows or terminal for Mac/Linux)

## EC2 Instance Specifications

### Recommended Instance Type:
- **Instance Type**: t2.small or t2.medium (minimum)
  - t2.micro may run out of memory during build
- **OS**: Ubuntu 22.04 LTS or Ubuntu 24.04 LTS
- **Storage**: 20 GB minimum
- **Security Group**:
  - Port 22 (SSH)
  - Port 80 (HTTP)
  - Port 443 (HTTPS)
  - Port 3000 (temporary, for testing)

## Files to Prepare

1. Your `.env` file with actual credentials (see `.env.template` in this folder)
2. Your `.pem` key file from AWS for SSH access
3. This deployment guide folder

## Time Estimate

- Fresh deployment: 30-45 minutes
- Includes Node.js installation, project setup, and nginx configuration
