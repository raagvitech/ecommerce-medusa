# 🚀 Backend Run Guide

## 📌 Prerequisites

Before setting up the backend, ensure you have the following installed:

- **Docker**: Install the Docker app on your local machine.
- **Windows Subsystem for Linux (WSL)**: Follow these steps to install WSL:
  1. Open **Command Prompt** as an administrator.
  2. Run the following command:
     ```bash
     wsl --install
     ```
  3. Download and install Docker from [Docker's official site](https://www.docker.com/).

---

## 📥 Installation Guide

### 1️⃣ Clone the Repository

Clone the required repositories:

```bash
# Clone the Medusa E-commerce repository
git clone https://github.com/raagvitech/ecommerce-medusa.git
```

### 2️⃣ Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install **Yarn** globally:

```bash
npm install -g yarn
```

After installation, run:

```bash
yarn
```

### 3️⃣ Start Docker Services

Run the following command to start Docker services:

```bash
docker compose up -d
```

---

## ⚙️ Configure Environment Variables

Create a `.env` file in the **backend** directory and add the following configuration:

```env
# General Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=default
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret
DATABASE_URL=postgres://postgres:12345678@localhost/medusa-medusa-store

# Medusa Admin Configuration
MEDUSA_ADMIN_ONBOARDING_TYPE=default
RAZORPAY_ACCOUNT="GlBP8nTCUY1pzK"
RAZORPAY_ID="rzp_test_YGYx1WdfJOjOOR"
RAZORPAY_SECRET="hJu83H2zNUvQVIyE5g370O9a"
RAZORPAY_WEBHOOK_SECRET="Shubham@2003"
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
GOOGLE_CALLBACK_URL=<YOUR_GOOGLE_CALLBACK_URL>
STORE_URL=http://localhost:8000
ADMIN_URL=http://localhost:9000
```

---

## 🛠️ Setup Database and Seed Data

Run database migrations:

```bash
yarn medusa db:migrate
```

Seed the database with initial data:

```bash
yarn seed
```

---

## 👤 Create an Admin User

Create an admin user by running:

```bash
npx medusa user -e admin-medusa@test.com -p supersecret
```

---

## 🚀 Start the Backend Server

Run the development server:

```bash
yarn dev
```

Your backend application is now up and running! 🎉

---

## 📚 Additional Notes
- Ensure that **Docker** is running before executing `docker compose up -d`.
- If you face permission issues with WSL, restart your system and try again.
- Update the `.env` file with valid Google OAuth credentials before using authentication features.

Happy Coding! 🚀

