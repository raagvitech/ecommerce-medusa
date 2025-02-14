# RUO Website Documentation

## Installation Guide

Follow these steps to set up the RUO backend application:

### 1. Clone the Repository

```bash
git clone https://github.com/RUO-2025/backend.git
```
### 2. Installation 

```
yarn
```

### 2. Start the Application

Use Docker Compose to build and start the application:

```bash
docker compose up -d
```

### 3. Configure the Environment Variables

Create or update the `.env` file in the backend directory with the following configuration:

```env

# General Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=default
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret
DATABASE_URL=postgres://postgres:12345678@localhost/medusa-medusa-store

# MinIO Configuration
S3_FILE_URL=http://localhost:9001
S3_ACCESS_KEY_ID=minioadmin
S3_SECRET_ACCESS_KEY=minioadmin
S3_REGION=us-east-1
S3_BUCKET=medusa-bucket
S3_ENDPOINT=http://minio:9006


# Medusa Admin Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=default


GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
GOOGLE_CALLBACK_URL=<YOUR_GOOGLE_CALLBACK_URL>

RAZORPAY_ID=<your api key>
RAZORPAY_SECRET=<your api key secret>
RAZORPAY_ACCOUNT=<your razorpay account number/merchant id>
RAZORPAY_WEBHOOK_SECRET=<your web hook secret as defined in the webhook settings in the razorpay dashboard >
```

### 4. Install Development Dependencies

```bash
yarn medusa db:migrate
```
then

```bash
yarn seed
```

### 5. Create an Admin User

Run the following command to create an admin user:

```bash
npx medusa user -e admin-medusa@test.com -p supersecret
```

```bash
yarn dev
```
---

Now your RUO backend application is ready to use!
