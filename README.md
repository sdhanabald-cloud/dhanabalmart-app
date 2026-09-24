# DhanabalMart — Full-Stack E-Commerce Marketplace

[![Production Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![Render Deployment](https://img.shields.io/badge/Deploy%20on-Render-46E3B7?logo=render&logoColor=white)](render.yaml)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Relational%20DB-4169E1?logo=postgresql&logoColor=white)](backend/src/main/resources/schema.sql)
[![Java Spring Boot](https://img.shields.io/badge/Java%2017-Spring%20Boot%203-6DB33F?logo=springboot&logoColor=white)](backend/pom.xml)
[![React Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](frontend/package.json)

**DhanabalMart** is a complete, production-ready, full-stack e-commerce marketplace application built with an enterprise relational database, role-based portals for **Admin**, **Seller**, and **Buyer**, a luxury **Peacock Green & Metallic Gold** visual design system, and multi-stage containerization tailored for **GitHub** and **Render** deployment.

---

## 1. Project Architecture

```
                                  +------------------------------------+
                                  |     DhanabalMart Marketplace       |
                                  |         (React 18 + Vite)          |
                                  +-----------------+------------------+
                                                    |
                                                    | REST API (JWT Authenticated)
                                                    v
                                  +-----------------+------------------+
                                  |   Java Spring Boot 3 REST Server   |
                                  |     Port: process.env.PORT (0.0.0.0)|
                                  +-----------------+------------------+
                                                    |
                                                    | HikariCP JDBC / JPA
                                                    v
                                  +-----------------+------------------+
                                  |       PostgreSQL Relational DB      |
                                  |  (Local Container or Render Cloud) |
                                  +------------------------------------+
```

- **Frontend**: React 18, Vite, React Router 6, responsive luxury styling with the Peacock Green (`#063737`) brand theme and metallic gold typography.
- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Spring Security, JJWT authentication, REST APIs.
- **Database**: PostgreSQL with normalized schema (`users`, `admins`, `sellers`, `buyers`, `categories`, `products`, `carts`, `cart_items`, `orders`, `order_items`, `payments`).
- **Containerization**: Multi-stage `Dockerfile` (Node builder + Maven compiler + minimal Eclipse Temurin JRE runtime), `docker-compose.yml` for local multi-container development, and `render.yaml` for Render infrastructure-as-code.

---

## 2. Luxury Design System & Color Palette

| Color Element | Hex Code | Visual Application |
|---|---|---|
| **Peacock Green** | `#063737` | Primary background, brand canvas, and header theme |
| **Light Pink** | `#E8C9CF` | Secondary accents, subtle labels, card borders |
| **Brown** | `#A25524` | Merchant hub elements, earthy action buttons |
| **Olive** | `#808000` | Trust badges, verification marks, active statuses |
| **Metallic Gold** | Gradient (`#FFE894` &rarr; `#D4AF37` &rarr; `#A67C1E`) | DhanabalMart logo, main headings, highlighted prices, borders, active navigation items |

---

## 3. Dedicated Login Modules & Portals

DhanabalMart strictly isolates portals and protects both frontend routes and backend REST endpoints using JWT role-based authorization.

### 🛡️ Admin Portal (`/login/admin`)
- **Route**: `/login/admin`
- **Dashboard**: Platform GMV, total transaction orders, active users, and merchant approval queues.
- **Manage Sellers**: Review store profiles, audit GSTIN tax numbers, and **Approve**, **Reject**, or **Hold** merchant applications.
- **Manage Buyers**: Inspect buyer accounts and toggle account status (**Active** / **Blocked**).
- **Manage Products**: Oversee all live marketplace listings and moderate inappropriate goods.
- **All Orders**: Platform-wide transaction ledger and order fulfillment tracking.
- **Reports**: Category revenue share and Average Order Value (AOV) analytics.
- **Admin Profile**: System privileges audit.

### 🏪 Seller Portal (`/login/seller`)
- **Route**: `/login/seller` & `/register/seller`
- **Dashboard**: Store sales volume, active listings, order backlog, and low stock warnings.
- **Add Product**: Form with category selection, price, stock, description, and high-res image URL.
- **Manage Products**: Catalog table with real-time stock levels, edit details, and delete actions.
- **Seller Orders**: Incoming customer purchases containing seller products with status transitions (**PROCESSING** &rarr; **SHIPPED** &rarr; **DELIVERED**).
- **Seller Profile**: Store branding, business address, and compliance credentials.

### 🛍️ Buyer Portal (`/login/buyer`)
- **Route**: `/login/buyer` & `/register/buyer`
- **Catalog Browsing**: Real-time search by keywords, category filtering, and price sorting.
- **Product Details**: Authenticity marks, seller store credit, stock count, and quantity picker.
- **Cart Management**: Add items, increase/decrease quantities, line totals, and free shipping.
- **Express Checkout**: Delivery address configuration, payment method selection (Card, UPI, Net Banking), and instant checkout.
- **Order Tracking**: Comprehensive invoice view, items ordered, and delivery timeline.
- **Buyer Profile**: Manage contact info and default shipping addresses.

---

## 4. Development Seed Data & Demo Credentials

Pre-loaded with 1 Admin, 3 Sellers (approved & pending), 2 Buyers, 5 Categories, and 12+ realistic e-commerce products.

| Portal | Role | Demo Email | Password | Access Route |
|---|---|---|---|---|
| **Platform Admin** | `ROLE_ADMIN` | `admin@dhanabalmart.com` | `Admin@123` | `/login/admin` |
| **Approved Seller 1** | `ROLE_SELLER` | `seller1@dhanabalmart.com` | `Seller@123` | `/login/seller` |
| **Approved Seller 2** | `ROLE_SELLER` | `seller2@dhanabalmart.com` | `Seller@123` | `/login/seller` |
| **Pending Seller 3** | `ROLE_SELLER` | `seller3@dhanabalmart.com` | `Seller@123` | `/login/seller` |
| **Verified Buyer 1** | `ROLE_BUYER` | `buyer1@gmail.com` | `Buyer@123` | `/login/buyer` |
| **Verified Buyer 2** | `ROLE_BUYER` | `buyer2@gmail.com` | `Buyer@123` | `/login/buyer` |

---

## 5. REST API Documentation

### Public Endpoints
- `GET /health` &mdash; Returns `{"status":"OK","application":"DhanabalMart"}`
- `GET /api/products` &mdash; Filter catalog by `?categoryId=` or `?search=`
- `GET /api/products/:id` &mdash; Fetch single product specifications
- `GET /api/categories` &mdash; Fetch all featured categories

### Authentication Endpoints
- `POST /api/auth/login` &mdash; Validates credentials & role, issues JWT bearer token
- `POST /api/auth/register` &mdash; Creates Buyer or Seller account
- `GET /api/auth/me` &mdash; Returns current authenticated profile
- `PUT /api/auth/profile` &mdash; Updates profile details
- `POST /api/auth/logout` &mdash; Terminates session

### Buyer Endpoints (Authenticated)
- `GET /api/cart` &mdash; Retrieve shopping cart items
- `POST /api/cart` &mdash; Add product to cart with quantity validation
- `PUT /api/cart/items/:id` &mdash; Update item quantity
- `DELETE /api/cart/items/:id` &mdash; Remove item from cart
- `DELETE /api/cart` &mdash; Clear entire cart
- `POST /api/orders` &mdash; Execute checkout & generate order
- `GET /api/orders` &mdash; View buyer's order history
- `GET /api/orders/:id` &mdash; Order invoice & details

### Seller Endpoints (`ROLE_SELLER` or `ROLE_ADMIN`)
- `GET /api/products/seller/me` &mdash; Products published by logged-in seller
- `POST /api/products` &mdash; List new product
- `PUT /api/products/:id` &mdash; Modify product details and inventory
- `DELETE /api/products/:id` &mdash; Remove product
- `GET /api/orders/seller/me` &mdash; Customer orders for this seller
- `PUT /api/orders/:id/status` &mdash; Transition order status (`PROCESSING`, `SHIPPED`, `DELIVERED`)

### Admin Endpoints (`ROLE_ADMIN`)
- `GET /api/admin/users` &mdash; View all platform users
- `GET /api/admin/sellers` &mdash; View all merchant stores & GSTINs
- `GET /api/admin/buyers` &mdash; View all registered patrons
- `PUT /api/admin/sellers/:id` &mdash; Update seller approval status (`APPROVED`, `REJECTED`, `PENDING`)
- `PUT /api/admin/users/:id/status` &mdash; Block or activate account (`ACTIVE`, `BLOCKED`)
- `GET /api/admin/orders` &mdash; Full platform order history
- `GET /api/admin/stats` &mdash; Aggregated revenue, orders, and user count

---

## 6. Local Development Instructions

### Option 1: Running with Maven (Host Java 17+)
Because Java and Maven are already configured, you can run DhanabalMart directly without external setup:
```powershell
cd backend
mvn spring-boot:run
```
Open your browser at `http://localhost:8080/`. The backend automatically detects your local environment, initializes an in-memory database with the full seed dataset if a local PostgreSQL service is not active, and serves the complete interactive DhanabalMart Single-Page Application.

### Option 2: Running with Docker Compose (Application + PostgreSQL)
To run DhanabalMart alongside a dedicated PostgreSQL 16 container with persistent volumes:
```bash
docker compose up --build
```
This builds the production multi-stage container and runs PostgreSQL with volume persistence at `localhost:8080`.

---

## 7. Exact GitHub Push Commands

Follow these exact steps to push DhanabalMart to your GitHub account:

### Step 1 — Open the project
```bash
cd DhanabalMart
```

### Step 2 — Initialize Git
```bash
git init
```

### Step 3 — Check status
```bash
git status
```

### Step 4 — Add files
```bash
git add .
```

### Step 5 — First commit
```bash
git commit -m "Initial commit - DhanabalMart"
```

### Step 6 — Rename branch
```bash
git branch -M main
```

### Step 7 — Create GitHub repository
Create an empty GitHub repository named:
```
dhanabal-mart
```
*Do not initialize it with a README, `.gitignore`, or License.*

### Step 8 — Connect GitHub
Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/dhanabal-mart.git
```

### Step 9 — Verify remote
```bash
git remote -v
```

### Step 10 — Push
```bash
git push -u origin main
```

Your GitHub repository will be live at:
```
https://github.com/YOUR_GITHUB_USERNAME/dhanabal-mart
```

---

## 8. Updating GitHub

Whenever code is updated or modified:
```bash
git add .
git commit -m "Update DhanabalMart"
git push
```

> [!CAUTION]
> Never commit `.env`, `node_modules/`, `target/`, database passwords, JWT secrets, or private tokens. All secrets must remain in environment variables.

---

## 9. Render Deployment Instructions

Deploy DhanabalMart on Render as a containerized Docker Web Service.

### Step 1
Push the project to GitHub following the instructions in Section 7.

### Step 2
Open [Render Dashboard](https://dashboard.render.com).

### Step 3
Select:
```
New + → Web Service
```

### Step 4
Connect your GitHub repository:
```
GitHub → dhanabal-mart
```

### Step 5
Set the runtime environment to:
```
Docker
```
> [!IMPORTANT]
> The deployment **must** use the project's root `Dockerfile`. Do **NOT** use Render's automatic Node.js runtime.

### Step 6
Create or connect a **Render PostgreSQL** database:
1. In Render, select **New + &rarr; PostgreSQL**.
2. Name it `dhanabalmart-db` with database name `dhanabalmart`.
3. Copy the **Internal Database URL** (e.g., `postgresql://dhanabal_user:...@dhanabalmart-db:5432/dhanabalmart`).

### Step 7
In your Web Service configuration, add the following Environment Variables:
```env
PORT=10000
DATABASE_URL=<Paste your Render PostgreSQL Internal Connection String>
JWT_SECRET=DhanabalMartProductionSecretKeyWith256BitsMinimumEntropy2026!
NODE_ENV=production
```
*(Render will automatically map `PORT` to the server process, and DhanabalMart listens on `0.0.0.0:${PORT}`)*.

### Step 8
Click **Deploy Web Service**. Render will execute the multi-stage Docker build, compile the assets, and start the service.

### Step 9
Test the health check endpoint to verify zero-downtime startup:
```
https://<YOUR-RENDER-SERVICE-NAME>.onrender.com/health
```
Expected response:
```json
{
  "status": "OK",
  "application": "DhanabalMart"
}
```

### Step 10
Open the generated Render URL in your web browser.

---

## 10. Application and Login Links

Once deployed on Render, access your application using the URLs generated for your service:

- **Main Application**:
  `https://<YOUR-RENDER-SERVICE-NAME>.onrender.com/`
- **Admin Login**:
  `https://<YOUR-RENDER-SERVICE-NAME>.onrender.com/login/admin`
- **Seller Login**:
  `https://<YOUR-RENDER-SERVICE-NAME>.onrender.com/login/seller`
- **Buyer Login**:
  `https://<YOUR-RENDER-SERVICE-NAME>.onrender.com/login/buyer`
- **API Health Check**:
  `https://<YOUR-RENDER-SERVICE-NAME>.onrender.com/health`

*(Example: `https://dhanabal-mart.onrender.com`)*.

---

## 11. Verification Checklist

- [x] Java Spring Boot 3 enterprise REST backend compiled with Maven (`BUILD SUCCESS`)
- [x] Multi-stage `Dockerfile` with Node 20 builder, Maven compiler, and Temurin 17 JRE runtime
- [x] `docker-compose.yml` with persistent PostgreSQL 16 volume
- [x] Dynamic Render port binding (`server.address=0.0.0.0`, `server.port=${PORT:8080}`)
- [x] Relational database schema with primary keys, foreign keys, timestamps, and indexes
- [x] Auto-detecting database configuration (PostgreSQL & dev in-memory fallback)
- [x] Health check route `GET /health` returning `{"status":"OK","application":"DhanabalMart"}`
- [x] Three dedicated login modules (`/login/admin`, `/login/seller`, `/login/buyer`)
- [x] Role-based access control protecting frontend routes & backend APIs
- [x] Complete shopping cart, checkout, and order status workflow
- [x] Luxury Peacock Green (`#063737`), Light Pink (`#E8C9CF`), Brown (`#A25524`), Olive (`#808000`), and Metallic Gold typography
- [x] `.env.example`, `.dockerignore`, `.gitignore`, `render.yaml`
- [x] Exact GitHub push commands & Render deployment guide
"# dhanabalmart-app" 
