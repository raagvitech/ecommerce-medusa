# 🚀 Backend & Storefront Run Guide

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
# Clone the backend repository
git clone https://github.com/RUO-2025/backend.git

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

# 🛒 Storefront Setup Guide

## ⚙️ Configure Environment Variables

Create a `.env` file in the **storefront** directory and add the following configuration:

```env
# Your Medusa backend, should be updated to where you are hosting your server. Remember to update CORS settings for your server.
MEDUSA_BACKEND_URL=http://localhost:9000

# Your publishable key that can be attached to sales channels.
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_eb032fc41246f7661c3560e72f1207c69f6a4fddb49554c4d1aa80f756d15baf

# Your store URL, should be updated to where you are hosting your storefront.
NEXT_PUBLIC_BASE_URL=http://localhost:8000

NEXT_PUBLIC_RAZORPAY_KEY="rzp_test_YGYx1WdfJOjOOR"
NEXT_PUBLIC_SHOP_NAME="Mersate"
NEXT_PUBLIC_SHOP_DESCRIPTION="Best clothing brand globally"

# Your preferred default region.
NEXT_PUBLIC_DEFAULT_REGION=us

# Your Next.js revalidation secret.
REVALIDATE_SECRET=supersecret

# MeiliSearch Configuration
MEILISEARCH_HOST=https://ms-d9c51c8dd4c7-18859.lon.meilisearch.io
MEILISEARCH_API_KEY=7c26f26e2051023bab033eb8c3bec8c56ac5e14e
NEXT_PUBLIC_INDEX_NAME=products
NEXT_PUBLIC_FEATURE_SEARCH_ENABLED=true
```
Install dependencies
Use Yarn to install all dependencies.

yarn

Start developing
You are now ready to start up your project.

yarn dev
---



## 📚 Additional Notes
- Ensure that **Docker** is running before executing `docker compose up -d`.
- If you face permission issues with WSL, restart your system and try again.
- Update the `.env` file with valid Google OAuth credentials before using authentication features.

Happy Coding! 🚀

