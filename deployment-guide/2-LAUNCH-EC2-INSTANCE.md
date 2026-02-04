# Step 1: Launch EC2 Instance

## 1.1 Login to AWS Console
1. Go to https://console.aws.amazon.com
2. Navigate to EC2 Dashboard
3. Click "Launch Instance"

## 1.2 Configure Instance

### Name and Tags
```
Name: website-builder-production
```

### Application and OS Images
```
AMI: Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
Architecture: 64-bit (x86)
```

### Instance Type
```
Instance Type: t2.small (or t2.medium for better performance)
```

### Key Pair
```
1. Click "Create new key pair"
2. Key pair name: website-builder-key
3. Key pair type: RSA
4. Private key file format: .pem
5. Click "Create key pair"
6. SAVE THE .pem FILE - you cannot download it again!
```

### Network Settings
```
1. Click "Edit" on Network settings
2. Auto-assign public IP: Enable
3. Firewall (Security Groups): Create security group
   - Security group name: website-builder-sg
   - Description: Security group for website builder

4. Add the following rules:

   Inbound Rules:
   - SSH (Port 22) - Source: My IP (or 0.0.0.0/0 if you need access from anywhere)
   - HTTP (Port 80) - Source: 0.0.0.0/0
   - HTTPS (Port 443) - Source: 0.0.0.0/0
   - Custom TCP (Port 3000) - Source: 0.0.0.0/0 (temporary, for testing)
```

### Configure Storage
```
Size: 20 GiB
Volume Type: gp3 (General Purpose SSD)
```

## 1.3 Launch Instance

1. Review all settings
2. Click "Launch Instance"
3. Wait for instance to be in "running" state
4. Note down the **Public IPv4 address** and **Public IPv4 DNS**

Example:
```
Public IPv4: 13.233.XXX.XXX
Public DNS: ec2-13-233-XXX-XXX.ap-south-1.compute.amazonaws.com
```

## 1.4 Prepare SSH Key (Windows Users)

If you're on Windows:
```
1. Move the .pem file to a safe location (e.g., C:\Users\YourName\.ssh\)
2. Open PowerShell and run:
   icacls "C:\Users\YourName\.ssh\website-builder-key.pem" /inheritance:r
   icacls "C:\Users\YourName\.ssh\website-builder-key.pem" /grant:r "%username%:R"
```

If you're on Mac/Linux:
```bash
chmod 400 /path/to/website-builder-key.pem
```

## 1.5 Test SSH Connection

Windows (PowerShell):
```bash
ssh -i "C:\Users\YourName\.ssh\website-builder-key.pem" ubuntu@13.233.XXX.XXX
```

Mac/Linux:
```bash
ssh -i /path/to/website-builder-key.pem ubuntu@13.233.XXX.XXX
```

If successful, you should see the Ubuntu welcome screen and be logged in as `ubuntu@ip-XXX-XXX-XXX-XXX`.

**Keep this SSH session open - you'll use it in the next steps.**
