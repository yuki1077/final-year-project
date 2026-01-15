# How to Create Superadmin on Another Laptop

## Method 1: Using the Seed Script (Recommended)

### Step 1: Set up the environment
1. Make sure you have the `.env` file in the `server` directory with database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=EduConnect
   DB_PORT=3306
   ```

2. (Optional) Customize superadmin credentials in `.env`:
   ```env
   SUPER_ADMIN_EMAIL=admin@educonnect.com
   SUPER_ADMIN_PASSWORD=YourSecurePassword123
   SUPER_ADMIN_NAME=Super Admin
   ```

### Step 2: Run the seed script
Navigate to the server directory and run:
```bash
cd server
npm run db:seed:superadmin
```

**Default credentials** (if not customized):
- **Email**: `superadmin@educonnect.com`
- **Password**: `SuperAdmin@123`

---

## Method 2: Manual SQL Insert

If you prefer to create the admin manually via SQL:

1. Connect to your MySQL database:
   ```bash
   mysql -u root -p EduConnect
   ```

2. Run this SQL command (replace values as needed):
   ```sql
   INSERT INTO users (name, email, password, role, status)
   VALUES (
     'Super Admin',
     'admin@educonnect.com',
     '$2a$10$YourHashedPasswordHere',
     'admin',
     'approved'
   );
   ```

   **Note**: You need to hash the password first. You can use Node.js:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hashed = await bcrypt.hash('YourPassword123', 10);
   console.log(hashed);
   ```

---

## Method 3: Direct Database Query (Quick Method)

If you have access to the database, you can use this Node.js script:

```javascript
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'EduConnect'
  });

  const email = 'admin@educonnect.com';
  const password = 'Admin@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  await connection.query(
    `INSERT INTO users (name, email, password, role, status)
     VALUES (?, ?, ?, 'admin', 'approved')`,
    ['Super Admin', email, hashedPassword]
  );

  console.log(`✅ Admin created: ${email} / ${password}`);
  await connection.end();
}

createAdmin();
```

---

## Verification

After creating the admin, verify by:
1. Starting the server: `npm run dev` (in server directory)
2. Logging in at: `http://localhost:5173/login`
3. Using the credentials you created
4. You should be redirected to `/admin` dashboard

---

## Troubleshooting

- **"Super admin already exists"**: The email is already in use. Either use that account or change the email.
- **Database connection error**: Check your `.env` file database credentials.
- **Password hash error**: Make sure `bcryptjs` is installed: `npm install bcryptjs`


