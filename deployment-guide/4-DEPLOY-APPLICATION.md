# Step 3: Deploy Application

## 3.1 Create Application Directory

```bash
# Create directory for your application
sudo mkdir -p /var/www/website-builder

# Change ownership to ubuntu user
sudo chown -R ubuntu:ubuntu /var/www/website-builder

# Navigate to the directory
cd /var/www/website-builder
```

## 3.2 Upload Your Project

### Option A: Using Git (Recommended)

If your project is on GitHub/GitLab:

```bash
# Clone your repository
git clone https://github.com/your-username/website-builder.git .

# If it's a private repo, you'll need to authenticate
```

### Option B: Using SCP to Upload Files

**On your local machine** (not on EC2), open a new terminal/PowerShell:

Windows (PowerShell):
```bash
scp -i "C:\Users\YourName\.ssh\website-builder-key.pem" -r "C:\Users\harsh\OneDrive\Desktop\New folder (5)\website-builder\*" ubuntu@13.233.XXX.XXX:/var/www/website-builder/
```

Mac/Linux:
```bash
scp -i /path/to/website-builder-key.pem -r /path/to/website-builder/* ubuntu@13.233.XXX.XXX:/var/www/website-builder/
```

This will upload all your project files to the server.

### Option C: Using FileZilla or WinSCP (GUI Method)

1. Download FileZilla or WinSCP
2. Connect using:
   - Host: Your EC2 public IP
   - Username: ubuntu
   - Key file: your .pem file
3. Upload all project files to `/var/www/website-builder/`

## 3.3 Create Environment File

```bash
cd /var/www/website-builder

# Create .env file
nano .env
```

**Copy and paste your environment variables** (see `.env.template` in this deployment-guide folder):

```env
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your-bucket-name

# Razorpay Credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email Credentials (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Save the file:
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

## 3.4 Install Dependencies

```bash
cd /var/www/website-builder

# Install all dependencies
npm install
```

**Note**: This may take 5-10 minutes depending on your instance type.

## 3.5 Build the Application

```bash
npm run build
```

**Note**: This may take 5-15 minutes. If you get memory errors, you may need to upgrade to t2.medium.

## 3.6 Test the Application

```bash
# Start the application in development mode first to test
npm run start
```

Open your browser and navigate to:
```
http://13.233.XXX.XXX:3000
```

Your application should be running!

**Press `Ctrl + C` to stop the application.**

---

**Next Step**: Proceed to `5-SETUP-PM2.md`
