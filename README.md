## EduConnect

Modern platform that connects schools, publishers, and administrators. The project now ships with a full-stack setup:

- **Frontend:** React + Vite + Tailwind (mobile-first, dashboard experience)
- **Backend:** Node.js + Express + MySQL (REST API, JWT auth, Stripe-ready payments, Cloudinary uploads)

---

### Getting Started

#### Frontend
```bash
cd /home/shifu/Downloads/educonnect-dashboard-main
npm install
npm run dev
```
The app runs on `http://localhost:8080` by default (update `FRONTEND_URL` in the backend `.env` if you change this).

#### Backend
```bash
cd /home/shifu/Downloads/educonnect-dashboard-main/server
npm install
cp .env.example .env   # fill/verify secrets
npm run dev
```
The API is served from `http://localhost:5000`. The frontend already points to that base URL (`VITE_API_URL` can override it).

---

### Backend Highlights

- **Auth:** Email/password registration & login with bcrypt + JWT. Admin/publisher accounts default to `pending` status; schools are auto-approved for a quick start.
- **Document verification:** Publisher and school registrations upload a verification image that is stored on Cloudinary and reviewable by the super admin.
- **Role-based access:** Middleware guards ensure only authorized roles can hit sensitive endpoints.
- **Database:** MySQL connection pool with sample schema (`server/database/schema.sql`) covering users, books, orders, and order items.
- **Books & Orders:** CRUD helpers for books (with Cloudinary cover uploads, author/grade/subject metadata) and transactional order creation with line items.
- **Payments & Media:** Stripe payment intent endpoint and Cloudinary upload helper, ready for future UI hooks.
- **Notifications:** Nodemailer integration for welcome emails. Verified automatically on server boot.
- **Health & monitoring:** `/health` endpoint, Helmet, CORS, and morgan logging.

---

### Environment Variables

All backend secrets live in `server/.env` (see `server/.env.example` for the exact values already configured for local work). Key settings:

- Database: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
- Server: `PORT`, `NODE_ENV`, `FRONTEND_URL`
- Security: `JWT_SECRET`
- Integrations: Gmail credentials, Cloudinary, Stripe keys
- Super admin overrides (optional): `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_NAME`

---

### Database

1. Start/verify MySQL on `localhost:3306`
2. Create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS EduConnect;
   ```
3. Create tables (pick one):
   ```bash
   # Recommended: automated script
   cd server
   npm run db:init

   # Alternatively: run the SQL manually
   mysql -u root -p EduConnect < server/database/schema.sql
   ```
4. Seed the built-in super admin (optional but recommended):
   ```bash
   npm run db:seed:superadmin
   ```
   - Default credentials: `superadmin@educonnect.com / SuperAdmin@123`
   - Override via env: `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD`, `SUPER_ADMIN_NAME`

Seed at least one admin/publisher/school user (or use the frontend dummy logins for UI smoke tests).

---

### API Routes (high level)

| Method | Endpoint                 | Description                              | Auth            |
|--------|--------------------------|------------------------------------------|-----------------|
| POST   | `/api/auth/register`     | Register new user                        | Public          |
| POST   | `/api/auth/login`        | Login, returns JWT token                 | Public          |
| GET    | `/api/auth/me`           | Current user profile                     | Auth            |
| GET    | `/api/books`             | List all books                           | Auth            |
| POST   | `/api/books`             | Create book (publisher/admin)            | Publisher/Admin |
| PUT    | `/api/books/:id`         | Update book                              | Publisher/Admin |
| DELETE | `/api/books/:id`         | Delete book                              | Admin           |
| GET    | `/api/orders`            | Orders filtered by role                  | Auth            |
| POST   | `/api/orders`            | Create order (school)                    | School          |
| PATCH  | `/api/orders/:id`        | Update order status/payment              | Admin/Publisher |
| GET    | `/api/users`             | List users                               | Admin           |
| PATCH  | `/api/users/:id/status`  | Update approval status                   | Admin           |
| POST   | `/api/payments/intent`   | Stripe payment intent                    | Auth            |

---

### Dummy Credentials (Frontend Convenience)

The frontend login screen exposes instant logins for quick demos:

- Admin — `admin@educonnect.com / password123`
- Publisher — `publisher@educonnect.com / password123`
- School — `school@educonnect.com / password123`

These are intercepted on the client store layer so you can preview dashboards before wiring the database with real data.

---

### Scripts Recap

| Location | Command          | Purpose                          |
|----------|------------------|----------------------------------|
| root     | `npm run dev`    | Start Vite frontend              |
| root     | `npm run build`  | Production build (frontend)      |
| server   | `npm run dev`    | Start Express API with nodemon   |
| server   | `npm start`      | Production Express server        |

---

## 📚 Additional Documentation

- [Superadmin Setup Guide](./SUPERADMIN_SETUP.md) - Instructions for creating and managing superadmin accounts
- [Email Notifications Setup](./EMAIL_SETUP.md) - Configure email notifications for users
- [Java Backend](./Java%20Backend/README.md) - Spring Boot MVC implementation (demonstration)

---

## 🔧 Backend Options

This project includes **two backend implementations**:

### 1. **Node.js Backend** (Primary - Currently Active)
- Location: `server/`
- Framework: Express.js
- Database: MySQL
- Currently integrated with the frontend
- Full API documentation in server code

### 2. **Java Backend** (Demonstration)
- Location: `Java Backend/`
- Framework: Spring Boot 3.2.0
- Architecture: MVC with proper layering
- Fully functional REST API with JWT authentication
- Complete documentation included
- For learning/reference purposes

---

Happy building! Let me know if you'd like seed data, Docker compose, or automated tests next.