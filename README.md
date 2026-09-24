# DhanabalMart — Full-Stack E-Commerce Marketplace (100% Pure Java)

[![Production Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![Render Deployment](https://img.shields.io/badge/Deploy%20on-Render-46E3B7?logo=render&logoColor=white)](render.yaml)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Relational%20DB-4169E1?logo=postgresql&logoColor=white)](backend/src/main/resources/schema.sql)
[![Java 17](https://img.shields.io/badge/Java%2017-LTS-ED8B00?logo=openjdk&logoColor=white)](backend/pom.xml)
[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?logo=springboot&logoColor=white)](backend/pom.xml)
[![Thymeleaf UI](https://img.shields.io/badge/UI-Thymeleaf%203%20%2B%20Pure%20CSS-005F0F?logo=thymeleaf&logoColor=white)](backend/src/main/resources/templates/)
[![Zero JavaScript](https://img.shields.io/badge/JavaScript-0%25%20(Pure%20Java)-black)](backend/)

**DhanabalMart** is a production-ready, full-stack e-commerce marketplace built exclusively with **100% Pure Java** (Java 17 LTS, Spring Boot 3, Thymeleaf 3, Spring Security 6, Spring Data JPA, and PostgreSQL). It features zero client-side JavaScript overhead, native server-side rendering with pure CSS, dedicated role-based portals for **Admin**, **Seller**, and **Buyer**, an opulent **Peacock Green & Metallic Gold** visual design system, and a multi-stage Docker build ready for immediate deployment to **GitHub** and **Render**.

---

## 1. Direct App Links & Portal Navigation

| Portal / Page | Relative URL Path | Live Production URL Example | Description |
|---|---|---|---|
| **Marketplace Home** | `/` | `https://<your-render-app>.onrender.com/` | Hero banner, categories, and featured luxury offerings |
| **Catalog Explorer** | `/products` | `https://<your-render-app>.onrender.com/products` | Search by keywords, filter by category, add to cart |
| **Product Details** | `/products/{id}` | `https://<your-render-app>.onrender.com/products/1` | Specs, stock status, seller info, and purchase actions |
| **About Platform** | `/about` | `https://<your-render-app>.onrender.com/about` | Enterprise architecture and technical documentation |
| **Health Check Endpoint** | `/health` | `https://<your-render-app>.onrender.com/health` | Public Render monitoring check (`{"status":"OK","application":"DhanabalMart"}`) |
| **Access Portals Gateway** | `/login` | `https://<your-render-app>.onrender.com/login` | Central gateway directing users to their portal |
| **Admin Terminal Sign In** | `/login/admin` | `https://<your-render-app>.onrender.com/login/admin` | Super administrator system login |
| **Seller Center Sign In** | `/login/seller` | `https://<your-render-app>.onrender.com/login/seller` | Verified merchant login |
| **Buyer Sign In** | `/login/buyer` | `https://<your-render-app>.onrender.com/login/buyer` | Consumer shopping account sign in |
| **Buyer Registration** | `/register/buyer` | `https://<your-render-app>.onrender.com/register/buyer` | New customer account creation |
| **Seller Registration** | `/register/seller` | `https://<your-render-app>.onrender.com/register/seller` | Merchant onboarding & store application |
| **Shopping Cart** | `/cart` | `https://<your-render-app>.onrender.com/cart` | Line items, quantities, subtotal calculation |
| **Checkout Flow** | `/checkout` | `https://<your-render-app>.onrender.com/checkout` | Shipping destination & transaction authorization |
| **Buyer Dashboard** | `/buyer/dashboard` | `https://<your-render-app>.onrender.com/buyer/dashboard` | Customer overview & quick links |
| **Buyer Orders** | `/buyer/orders` | `https://<your-render-app>.onrender.com/buyer/orders` | Order history & shipment progress tracking |
| **Seller Dashboard** | `/seller/dashboard` | `https://<your-render-app>.onrender.com/seller/dashboard` | Merchant revenue GMV, low stock alerts, stats |
| **Seller Products** | `/seller/products` | `https://<your-render-app>.onrender.com/seller/products` | Inventory management, edit & delete items |
| **Seller Add Product** | `/seller/products/new` | `https://<your-render-app>.onrender.com/seller/products/new` | Create and publish product to catalog |
| **Seller Orders** | `/seller/orders` | `https://<your-render-app>.onrender.com/seller/orders` | Fulfill customer orders & transition lifecycle |
| **Admin Dashboard** | `/admin/dashboard` | `https://<your-render-app>.onrender.com/admin/dashboard` | Platform metrics, GMV, total transaction tally |
| **Admin Seller Governance** | `/admin/sellers` | `https://<your-render-app>.onrender.com/admin/sellers` | Approve, reject, or audit merchant stores |
| **Admin Buyer Directory** | `/admin/buyers` | `https://<your-render-app>.onrender.com/admin/buyers` | Audit accounts & manage user active status |
| **Admin Catalog Moderation**| `/admin/products` | `https://<your-render-app>.onrender.com/admin/products` | Moderation over platform-wide product listings |
| **Admin Order Ledger** | `/admin/orders` | `https://<your-render-app>.onrender.com/admin/orders` | Global order stream & transaction hashes |
| **Admin Financial Reports** | `/admin/reports` | `https://<your-render-app>.onrender.com/admin/reports` | GMV analytics, order lifecycle distribution |

---

## 2. Pre-Seeded Demonstration Credentials

The application automatically seeds initial data on startup so evaluators and testers can log in immediately:

| Portal | Role | Email Address | Password | Account Standing |
|---|---|---|---|---|
| **Admin Terminal** | `ROLE_ADMIN` | `admin@dhanabalmart.com` | `Admin@123` | `ACTIVE` |
| **Seller Center** | `ROLE_SELLER` | `seller1@dhanabalmart.com` | `Seller@123` | `APPROVED` |
| **Seller Center** | `ROLE_SELLER` | `seller2@dhanabalmart.com` | `Seller@123` | `APPROVED` |
| **Seller Center** | `ROLE_SELLER` | `seller3@dhanabalmart.com` | `Seller@123` | `APPROVED` |
| **Buyer Portal** | `ROLE_BUYER` | `buyer1@gmail.com` | `Buyer@123` | `ACTIVE` |
| **Buyer Portal** | `ROLE_BUYER` | `buyer2@gmail.com` | `Buyer@123` | `ACTIVE` |

---

## 3. Technology Stack & Design Architecture

```
                                  +------------------------------------+
                                  |     Pure CSS & Thymeleaf 3 UI      |
                                  |    (Zero JavaScript Dependencies)  |
                                  +-----------------+------------------+
                                                    |
                                                    | HTTP Forms / Session & REST
                                                    v
                                  +-----------------+------------------+
                                  |  Java 17 LTS + Spring Boot 3.2.5   |
                                  |   Spring Security 6 (BCrypt Auth)  |
                                  |   Binds dynamically to 0.0.0.0:$PORT
                                  +-----------------+------------------+
                                                    |
                                                    | HikariCP JDBC / Hibernate 6
                                                    v
                                  +-----------------+------------------+
                                  |       PostgreSQL Relational DB      |
                                  |  (Render Managed or Local Docker)  |
                                  +------------------------------------+
```

### Luxury Design System & Color Palette
- **Peacock Green (`#063737`)**: Primary canvas, brand headers, and deep background.
- **Peacock Dark (`#032121`)**: Input fields, high-contrast tables, and dark card surfaces.
- **Light Pink (`#E8C9CF`)**: Subtext, labels, border outlines, and soft accents.
- **Brown (`#A25524`)**: Warm earthy merchant buttons and primary actions.
- **Olive (`#808000`)**: Approved status badges, active indicators, and security checkmarks.
- **Metallic Gold (`#D4AF37`)**: Luxury gold gradient (`#FFE894` &rarr; `#D4AF37` &rarr; `#A67C1E`), Cinzel serif typography, and brand logo.

---

## 4. GitHub Push Instructions

Follow these exact commands to push the entire pure Java codebase to your GitHub repository:

```bash
# 1. Navigate to the root project directory
cd c:\Users\acer\Desktop\dhananal

# 2. Stage all modifications, new templates, controllers, and deleted JS files
git add .

# 3. Commit the changes
git commit -m "feat: complete pure java architecture with thymeleaf, role portals, and render docker configuration"

# 4. Push to your main branch on GitHub
git push origin main
```

---

## 5. Render Deployment Instructions (Step-by-Step)

DhanabalMart is configured with a two-stage **Dockerfile**, environment variable auto-detection, and `render.yaml` for zero-configuration cloud deployment.

### Step 5.1: Create a PostgreSQL Database on Render
1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** &rarr; **PostgreSQL**.
3. Fill in the database parameters:
   - **Name**: `dhanabalmart-db`
   - **Database**: `dhanabalmart`
   - **User**: `dhanabal_user`
   - **Plan**: `Free`
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** (e.g. `postgres://dhanabal_user:...@dhanabalmart-db:5432/dhanabalmart`).

---

### Step 5.2: Create the Web Service on Render
1. In the Render Dashboard, click **New +** &rarr; **Web Service**.
2. Connect your GitHub repository (`balakarkki2007/dhananal` or your cloned repo).
3. Configure the service settings:
   - **Name**: `dhanabal-mart`
   - **Region**: Select region closest to your database (e.g., `Singapore` or `Oregon`).
   - **Branch**: `main`
   - **Root Directory**: *(Leave blank)*
   - **Environment / Runtime**: **Docker** *(Render will detect and build using `Dockerfile`)*
   - **Plan**: `Free`
4. Add the following **Environment Variables**:
   | Key | Value | Description |
   |---|---|---|
   | `DATABASE_URL` | *(Paste Internal Database URL from Step 5.1)* | PostgreSQL connection string |
   | `SPRING_PROFILES_ACTIVE` | `prod` | Activates production profile |
   | `JWT_SECRET` | `DhanabalMartSuperSecretKey2026WithSufficientBitsForHMACSHA256Encryption!` | 256-bit encryption key |
5. Configure the **Health Check Path**:
   - Set **Health Check Path** to `/health`.
6. Click **Create Web Service**.

---

### Step 5.3: Verify Deployment
1. Render will build the Docker container using Maven and launch the minimal Temurin JRE runtime.
2. In the deployment logs, you will observe:
   ```
   Tomcat started on port 10000 (http) with context path ''
   Started DhanabalMartApplication in 10.5 seconds
   DhanabalMart seed data successfully loaded!
   ```
3. Click your Render web service URL (`https://dhanabal-mart.onrender.com`).
4. Test the endpoints:
   - `https://dhanabal-mart.onrender.com/health` &rarr; `{"status":"OK","application":"DhanabalMart"}`
   - `https://dhanabal-mart.onrender.com/login` &rarr; Portal Gateway
   - `https://dhanabal-mart.onrender.com/login/admin` &rarr; Admin Login
   - `https://dhanabal-mart.onrender.com/login/seller` &rarr; Seller Login
   - `https://dhanabal-mart.onrender.com/login/buyer` &rarr; Buyer Login

---

## 6. Local Development Execution

### Option A: Direct Maven Execution
```bash
cd backend
mvn clean spring-boot:run
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

### Option B: Docker Compose (Local Multi-Container with PostgreSQL)
```bash
docker-compose up --build
```
This automatically spins up both the PostgreSQL database container and the DhanabalMart application container.

---

## 7. Verification Checklist

- [x] **100% Pure Java**: Zero `.js`, `.jsx`, `node_modules`, `npm`, or `package.json` files in the repository.
- [x] **Thymeleaf 3 + Pure CSS**: Clean server-rendered HTML templates with responsive luxury design.
- [x] **Role-Based Portals**: Isolated portals for Super Admin, Certified Sellers, and Registered Buyers.
- [x] **Health Check**: `GET /health` returns `{"status":"OK","application":"DhanabalMart"}`.
- [x] **Dynamic Port Binding**: Application binds dynamically to `0.0.0.0:${PORT:-8080}` required by Render.
- [x] **Relational Database**: PostgreSQL entities for Users, Admins, Sellers, Buyers, Categories, Products, Carts, Orders, and Payments.
- [x] **Docker Multi-Stage Build**: Optimized container with unprivileged security user and minimal JRE footprint.
- [x] **Full E-Commerce Flow Tested**: Catalog search &rarr; Add to Cart &rarr; Checkout &rarr; Order Creation &rarr; Seller Fulfillment all verified end-to-end.
