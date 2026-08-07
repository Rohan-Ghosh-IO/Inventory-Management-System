# 🚀 Project Setup Guide

## 🗄️ Database ER Diagram

View the complete database schema here:

**DB Diagram:**  
https://dbdiagram.io/d/6a75a9de35ee2e87b052ae78

---

# 📚 API Documentation (Swagger)

After starting the application, Swagger documentation is available at:

### Authentication Service

```text
http://localhost:5001/api-docs
```

### Inventory Service

```text
http://localhost:5002/api-docs
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root using the following template:

```env
# ==================================================
# Node Environment
# ==================================================
NODE_ENV=development

# ==================================================
# Service Ports
# ==================================================
PORT_AUTH=5001
PORT_INVENTORY=5002

# ==================================================
# Frontend URL
# ==================================================
FRONTEND_URL=http://localhost:5173

# ==================================================
# PostgreSQL Database
# ==================================================
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inventory_db?schema=public"

# ==================================================
# JWT Configuration
# ==================================================
JWT_SECRET=super_secret_production_grade_jwt_signing_key_32_bytes
JWT_EXPIRES_IN=7d

# ==================================================
# Cloudinary Configuration
# ==================================================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note**
>
> Never commit your actual `.env` file to GitHub. Only commit a `.env.example` file with placeholder values.

---

# 🛠️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd inventory-management-system
```

---

## 2️⃣ Install Dependencies

Install all workspace dependencies.

```bash
npm install
```

---

## 3️⃣ Start PostgreSQL

If using Docker:

```bash
docker compose up -d
```

If you're using a local PostgreSQL installation, make sure it is running before continuing.

---

## 4️⃣ Configure Environment Variables

Create a `.env` file in the project root.

Copy the contents from `.env.example`.

Update the following values:

- DATABASE_URL
- JWT_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

---

## 5️⃣ Push Prisma Schema

Create the database tables.

```bash
npm run prisma:db:push
```

---

## 6️⃣ Seed the Database

This command creates:

- Default Admin User
- Sample Categories
- Sample Suppliers
- Sample Products (if configured)

```bash
npm run prisma:seed
```

---

## 7️⃣ Run the Application

Start the complete application.

```bash
npm run dev
```

This command starts:

- Authentication Service
- Inventory Service
- Frontend (Vite)

---

# 🌐 Application URLs

### Frontend

```text
http://localhost:5173
```

### Authentication Swagger

```text
http://localhost:5001/api-docs
```

### Inventory Swagger

```text
http://localhost:5002/api-docs
```

---

# 🔑 Default Admin Credentials

If you seeded the database successfully, you can log in using:

```text
Email:
admin@inventory.com

Password:
Admin@123456
```

---

# 🏗️ Build for Production

Generate production builds for all workspaces.

```bash
npm run build
```

---

# 📦 Available Scripts

| Command | Description |
|----------|-------------|
| `npm install` | Install all project dependencies |
| `npm run dev` | Start frontend and backend services |
| `npm run build` | Build all workspaces |
| `npm run prisma:db:push` | Push Prisma schema to PostgreSQL |
| `npm run prisma:seed` | Seed default admin account and sample data |

---

# 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Framer Motion
- React Hot Toast
- Lucide React
- Recharts

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation
- Multer
- Cloudinary

### DevOps & Tools

- Docker
- Swagger (OpenAPI)
- Prisma
- PostgreSQL
- Cloudinary

---

# 📁 Project Structure

```text
inventory-management-system
│
├── backend
│   ├── auth-service
│   ├── inventory-service
│   └── prisma
│
├── frontend
│
├── docs
│
├── docker-compose.yml
├── package.json
├── .env.example
└── README.md
```

---

# ✅ Setup Checklist

- Clone the repository
- Install dependencies
- Configure `.env`
- Start PostgreSQL
- Push Prisma schema
- Seed the database
- Run the application
- Open the frontend
- Explore APIs using Swagger
- View the database schema using the DB Diagram
