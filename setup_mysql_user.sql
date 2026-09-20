-- Setup MySQL User and Database for Wheel of Fortune
-- Run this script as MySQL root user

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS wheel_of_fortune
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Drop user if exists (to recreate with proper permissions)
DROP USER IF EXISTS 'adeel'@'localhost';

-- Create user with password
CREATE USER 'adeel'@'localhost' IDENTIFIED BY '<your-mysql-password>';

-- Grant ALL privileges on the wheel_of_fortune database
GRANT ALL PRIVILEGES ON wheel_of_fortune.* TO 'adeel'@'localhost';

-- Also grant privileges to create/access flyway tables
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER
ON wheel_of_fortune.* TO 'adeel'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Verify user and privileges
SELECT User, Host FROM mysql.user WHERE User = 'adeel';
SHOW GRANTS FOR 'adeel'@'localhost';

