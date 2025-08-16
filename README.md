# B2B Platform

**B2B Platform** is a full-stack Business-to-Business web application that allows companies to manage products, place and track orders, and maintain user roles and authentication. The project consists of a **backend API** built with Node.js/Express and a **frontend** built with Angular/Ionic.  

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Setup & Installation](#setup--installation)  
- [Environment Configuration](#environment-configuration)  
- [API Documentation](#api-documentation)  
- [Docker Setup](#docker-setup)  
- [Usage](#usage)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- User Management: Admin, Customer, Supplier roles
- JWT-based login/logout
- Product CRUD
- Orders: create, view, update, delete
- Admin actions: view all orders, update order statuses, delete products/orders
- Responsive dashboard
- Pagination and dynamic order forms
- Swagger/OpenAPI documentation
- Docker support for backend + database

---

## Tech Stack

**Backend:** Node.js, Express, Sequelize, PostgreSQL, JWT, Swagger  
**Frontend:** Angular, Ionic, TypeScript, RxJS  
**DevOps / Tools:** Docker, Docker Compose, ESLint, Prettier, GitHub

---

## Project Structure

b2b-platform/
├─ b2b-backend/
│ ├─ src/routes/ # API routes (auth, products, orders)
│ ├─ swagger/ # OpenAPI specification (openapi.yaml)
│ ├─ app.js # Express entry point
│ ├─ package.json
│ ├─ .env
│ ├─ Dockerfile
│ └─ docker-compose.yml
├─ b2b-frontend/
│ ├─ src/
│ │ ├─ app/
│ │ └─ environments/
│ ├─ package.json
│ └─ angular.json
└─ README.md


---

## Setup & Installation

### Backend

Clone repository:

```bash
cd b2b-platform/b2b-backend
npm install


Create .env file:

PORT=4000
JWT_SECRET=change_me_please
DB_HOST=localhost
DB_PORT=5432
DB_NAME=b2b_db
DB_USER=postgres
DB_PASS=admin
NODE_ENV=development
FRONTEND_URL=http://localhost:8100


Start backend server:

node app.js


Swagger API docs: http://localhost:4000/api/docs

Frontend
cd ../b2b-frontend
npm install
ionic serve


Frontend available at: http://localhost:8100

Environment Configuration

Backend: .env.development, .env.production

Frontend: src/environments/environment.ts (dev), environment.prod.ts (prod)

API Documentation

Access Swagger/OpenAPI:

http://localhost:4000/api/docs


Endpoints include:

/api/auth - login, register

/api/products - CRUD products

/api/orders - create, update, view, delete orders

Docker Setup

Run backend + PostgreSQL with Docker Compose:

docker-compose up --build


Services:

backend (Node.js API)

db (PostgreSQL)

Access:

Backend API: http://localhost:4000

Swagger docs: http://localhost:4000/api/docs

Usage

Login as Admin, Customer, or Supplier

Manage products and orders

Track order history and status

Use Swagger to explore and test API endpoints

Contributing

Fork the repository

Create a branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m "Add feature")

Push to your branch (git push origin feature/your-feature)

Open a Pull Request