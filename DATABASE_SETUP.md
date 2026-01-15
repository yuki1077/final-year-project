# Database Setup Guide

## Problem
MySQL connection is established, but tables are not created automatically when you run `npm run dev`.

## Solution: Run Database Initialization

### Step 1: Ensure Database Exists

First, make sure the database is created in MySQL:

```sql
CREATE DATABASE IF NOT EXISTS EduConnect;
```

You can do this via MySQL command line:
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE IF NOT EXISTS EduConnect;
EXIT;
```

### Step 2: Check Your .env File

Make sure your `server/.env` file has the correct database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=EduConnect
DB_PORT=3306
```

### Step 3: Initialize Database Tables

Navigate to the server directory and run:

```bash
cd server
npm run db:init
```

This will:
- Read the `server/database/schema.sql` file
- Create all necessary tables (users, books, orders, order_items, progress_entries, feedback)
- Show success message: `✅ Database tables ensured.`

### Step 4: (Optional) Create Superadmin

After tables are created, you can create a superadmin:

```bash
npm run db:seed:superadmin
```

---

## Alternative Method: Manual SQL

If the script doesn't work, you can manually run the SQL:

```bash
mysql -u root -p EduConnect < server/database/schema.sql
```

Or connect to MySQL and paste the contents of `server/database/schema.sql`:

```bash
mysql -u root -p
USE EduConnect;
```

Then copy and paste all the SQL from `server/database/schema.sql`

---

## Verify Tables Are Created

Check if tables exist:

```bash
mysql -u root -p EduConnect -e "SHOW TABLES;"
```

You should see:
- users
- books
- orders
- order_items
- progress_entries
- feedback

---

## Troubleshooting

### Error: "Database doesn't exist"
```sql
CREATE DATABASE EduConnect;
```

### Error: "Access denied"
- Check your MySQL username and password in `.env`
- Make sure MySQL user has CREATE privileges

### Error: "Cannot find module"
Make sure you're in the `server` directory when running:
```bash
cd server
npm run db:init
```

### Error: "Table already exists"
This is fine! The script uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times.

---

## Complete Setup Checklist

- [ ] MySQL is running
- [ ] Database `EduConnect` is created
- [ ] `.env` file has correct database credentials
- [ ] Run `npm run db:init` successfully
- [ ] Tables are created (verify with `SHOW TABLES`)
- [ ] (Optional) Run `npm run db:seed:superadmin`
- [ ] Start server: `npm run dev`






