# MySQL Setup Guide - Wheel of Fortune

## 🎯 Quick Setup for MySQL

### Step 1: Install MySQL Server

**Windows:**
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run installer and select "Developer Default" or "Server only"
3. Follow installation wizard
4. Set root password during installation
5. Start MySQL as Windows service

**Verify Installation:**
```cmd
mysql --version
```

### Step 2: Create Database User

**Option A: Using MySQL Command Line**

1. Open Command Prompt as Administrator
2. Connect to MySQL:
```cmd
mysql -u root -p
```

3. Create user and database:
```sql
CREATE USER 'adeel'@'localhost' IDENTIFIED BY '<your-mysql-password>';
CREATE DATABASE wheel_of_fortune CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON wheel_of_fortune.* TO 'adeel'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Option B: Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect as root user
3. Go to: Server → Users and Privileges
4. Click "Add Account"
   - Login Name: `adeel`
   - Password: `<your-mysql-password>`
   - Confirm Password: `<your-mysql-password>`
5. Go to "Schema Privileges" tab
6. Click "Add Entry"
7. Select "wheel_of_fortune" or create new schema
8. Grant ALL privileges
9. Click "Apply"

### Step 3: Verify Connection

Test the connection:
```cmd
mysql -u adeel -p
# Enter password: <your-mysql-password>
```

If successful, you should see:
```
Welcome to the MySQL monitor.
mysql>
```

### Step 4: Start the Application

The application will automatically:
- Create the `wheel_of_fortune` database (if not exists)
- Run Flyway migrations
- Create tables
- Populate with sample data

```bash
cd C:\Users\adeel\Documents\Practice\WheelOfFotune
.\mvnw.cmd spring-boot:run
```

### Expected Output

You should see Flyway messages in the logs:
```
Flyway Community Edition by Redgate
Database: jdbc:mysql://localhost:3306/wheel_of_fortune
Successfully validated 2 migrations
Migrating schema "wheel_of_fortune" to version "1 - Create words table"
Migrating schema "wheel_of_fortune" to version "2 - Insert sample data"
Successfully applied 2 migrations to schema "wheel_of_fortune"
```

---

## 🔍 Verify Setup

### Check Database

```sql
USE wheel_of_fortune;
SHOW TABLES;
SELECT COUNT(*) FROM words;
```

Expected: 36 words

### Test API

```bash
curl http://localhost:8080/api/words/categories
```

Expected: List of 6 categories

---

## 🚨 Common Issues

### MySQL Service Not Running

**Windows:**
```cmd
# Start MySQL service
net start MySQL80

# Check status
sc query MySQL80
```

### Port 3306 Already in Use

Check what's using the port:
```cmd
netstat -ano | findstr :3306
```

### Cannot Connect - Access Denied

1. Verify user exists:
```sql
SELECT User, Host FROM mysql.user WHERE User = 'adeel';
```

2. Grant privileges again:
```sql
GRANT ALL PRIVILEGES ON wheel_of_fortune.* TO 'adeel'@'localhost';
FLUSH PRIVILEGES;
```

### Application Cannot Create Database

If auto-creation fails, manually create:
```sql
CREATE DATABASE wheel_of_fortune 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

---

## 🎉 You're Ready!

Once MySQL is set up and the application starts successfully, you can:
- Access the REST API at http://localhost:8080
- Query the database using MySQL Workbench or command line
- View migration history in `flyway_schema_history` table
- Add new migrations in `src/main/resources/db/migration/`

**Next Steps:**
- Test all API endpoints
- Add more word data via migrations
- Build frontend application

