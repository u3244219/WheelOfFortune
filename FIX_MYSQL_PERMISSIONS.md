# MySQL User Permission Fix - Quick Guide

## Problem Identified
The application successfully connected to MySQL, but user 'adeel' lacks sufficient privileges.

**Error:** `SELECT command denied to user 'adeel'@'localhost' for table 'flyway_schema_history'`

## Solution: Grant Proper Privileges

### Option 1: Using MySQL Command Line

1. Open Command Prompt as Administrator
2. Connect to MySQL as root:
```cmd
mysql -u root -p
```
(Enter your root password when prompted)

3. Run these commands:
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS wheel_of_fortune 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Recreate user with proper privileges
DROP USER IF EXISTS 'adeel'@'localhost';
CREATE USER 'adeel'@'localhost' IDENTIFIED BY '<your-mysql-password>';

-- Grant ALL privileges
GRANT ALL PRIVILEGES ON wheel_of_fortune.* TO 'adeel'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect as root user
3. Go to: **Administration** → **Users and Privileges**
4. Select user 'adeel' (or create if doesn't exist)
5. Go to **Schema Privileges** tab
6. Click **Add Entry**
7. Select `wheel_of_fortune` database
8. Click **Select ALL** to grant all privileges
9. Click **Apply**

### Verify the Fix

After granting privileges, test the connection:
```cmd
mysql -u adeel -p wheel_of_fortune
# Enter password: <your-mysql-password>
```

If successful, you should see:
```
mysql> 
```

## Then Run the Application Again

```cmd
cd C:\Users\adeel\Documents\Practice\WheelOfFotune
.\mvnw.cmd spring-boot:run
```

## Expected Success Output

You should see Flyway messages like:
```
Database: jdbc:mysql://localhost:3306/wheel_of_fortune (MySQL 8.0)
Successfully validated 2 migrations
Migrating schema "wheel_of_fortune" to version "1 - Create words table"
Migrating schema "wheel_of_fortune" to version "2 - Insert sample data"
Successfully applied 2 migrations
```

Then:
```
Tomcat started on port 8080
Started WheelOfFotuneApplication
```

---

## What the Application Will Do

Once privileges are fixed:
1. ✅ Connect to MySQL on localhost:3306
2. ✅ Use database `wheel_of_fortune` (auto-created if needed)
3. ✅ Create `flyway_schema_history` table
4. ✅ Run V1 migration - Create `words` table
5. ✅ Run V2 migration - Insert 36 sample words
6. ✅ Start server on port 8080

---

**Current Status:** Application tried to start but failed due to insufficient MySQL user privileges. Follow the steps above to grant proper access, then restart the application.

