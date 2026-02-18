# Database Migration Guide - Wheel of Fortune

## 🗄️ Overview

This project now uses **Flyway** for database migrations with **MySQL** database and **JPA** entities. The database schema is automatically created and populated on application startup.

---

## 📋 Migration Files

### Migration Naming Convention

Flyway uses versioned migration files with the naming pattern:
```
V{version}__{description}.sql
```

Example: `V1__Create_words_table.sql`

### Current Migrations

#### **V1__Create_words_table.sql**
Creates the initial database schema:
- `words` table with columns: id, category, word, hint, difficulty
- InnoDB engine for transactional support
- UTF8MB4 charset for proper Unicode support
- Indexes on category and difficulty for faster queries
- Constraints to ensure data integrity

#### **V2__Insert_sample_data.sql**
Populates the database with 36 sample words:
- 6 words per category (increased from 4)
- Mix of EASY, MEDIUM, and HARD difficulties
- All words include helpful hints

---

## 🚀 How It Works

### 1. **Automatic Migration on Startup**

When you start the application, Flyway automatically:
1. Checks if migrations have been applied
2. Runs any pending migrations in version order (V1, V2, V3...)
3. Tracks applied migrations in `flyway_schema_history` table

### 2. **Database Storage**

- **Type:** MySQL Database
- **Database Name:** `wheel_of_fortune`
- **Host:** localhost:3306
- **Auto-creation:** Database is created automatically if it doesn't exist
- **Persistence:** Data persists across application restarts

### 3. **JPA Entity Mapping**

The `WordEntity` class is now a proper JPA entity:
```java
@Entity
@Table(name = "words")
public class WordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    private Category category;
    
    // ... other fields
}
```

---

## 🔧 Configuration

### Application Properties

```properties
# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/wheel_of_fortune?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=adeel
spring.datasource.password=<your-mysql-password>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Flyway Configuration
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
```

### Prerequisites

**MySQL Server must be installed and running:**
- MySQL Server 8.0 or higher recommended
- Ensure MySQL service is running on localhost:3306
- User 'adeel' must have database creation and modification privileges

**Grant Privileges (if needed):**
```sql
CREATE USER 'adeel'@'localhost' IDENTIFIED BY '<your-mysql-password>';
GRANT ALL PRIVILEGES ON wheel_of_fortune.* TO 'adeel'@'localhost';
FLUSH PRIVILEGES;
```

---

## 🎯 Adding New Migrations

### Step 1: Create Migration File

Create a new file in `src/main/resources/db/migration/`:
```
V3__Add_new_feature.sql
```

**Important Rules:**
- Version numbers must be sequential (V1, V2, V3...)
- Use double underscore `__` after version
- Use descriptive names
- Never modify existing migration files once applied

### Step 2: Write SQL (MySQL Syntax)

Example - Adding a new column:
```sql
-- V3__Add_points_column.sql
ALTER TABLE words ADD COLUMN points INT DEFAULT 100;
UPDATE words SET points = 100 WHERE difficulty = 'EASY';
UPDATE words SET points = 200 WHERE difficulty = 'MEDIUM';
UPDATE words SET points = 300 WHERE difficulty = 'HARD';
```

### Step 3: Restart Application

Flyway will automatically detect and apply the new migration.

---

## 📊 Database Schema

### `words` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| category | VARCHAR(50) | NOT NULL | Word category |
| word | VARCHAR(100) | NOT NULL | The actual word/phrase |
| hint | VARCHAR(255) | NULL | Optional hint |
| difficulty | VARCHAR(20) | NOT NULL | Difficulty level |

**Table Properties:**
- Engine: InnoDB
- Charset: utf8mb4
- Collation: utf8mb4_unicode_ci

### Indexes
- `idx_words_category` - On category column
- `idx_words_difficulty` - On difficulty column

---

## 🛠️ MySQL Access

### Command Line Access

Connect to MySQL:
```bash
mysql -u adeel -p
# Enter password: <your-mysql-password>
```

### MySQL Workbench

1. Open MySQL Workbench
2. Create new connection:
   - Connection Name: Wheel of Fortune
   - Hostname: localhost
   - Port: 3306
   - Username: adeel
   - Password: <your-mysql-password>
3. Connect and select `wheel_of_fortune` database

### Useful MySQL Commands

```sql
-- Use the database
USE wheel_of_fortune;

-- View all words
SELECT * FROM words;

-- Count words by category
SELECT category, COUNT(*) as count FROM words GROUP BY category;

-- View migration history
SELECT * FROM flyway_schema_history ORDER BY installed_rank;

-- View table structure
DESCRIBE words;

-- Show all tables
SHOW TABLES;
```

---

## 🔄 Migration Status

### Check Migration Status

Flyway automatically logs migration status on startup:
```
Flyway Community Edition 10.x.x by Redgate
Database: jdbc:mysql://localhost:3306/wheel_of_fortune
Successfully validated 2 migrations
Current version of schema "wheel_of_fortune": 2
Migrating schema "wheel_of_fortune" to version "2 - Insert sample data"
Successfully applied 1 migration to schema "wheel_of_fortune"
```

### View Applied Migrations

Query the `flyway_schema_history` table:
```sql
USE wheel_of_fortune;
SELECT 
    installed_rank,
    version,
    description,
    type,
    script,
    installed_on,
    success
FROM flyway_schema_history 
ORDER BY installed_rank;
```

---

## 📦 Sample Data

### Current Dataset: 36 Words

**LOCATION_PLACE (6):**
- PARIS, GRAND CANYON, MOUNT EVEREST, AUSTRALIA, NEW YORK, NIAGARA FALLS

**GENERAL_ITEM (6):**
- BICYCLE, TELEPHONE, REFRIGERATOR, UMBRELLA, COMPUTER, MICROWAVE

**FRUIT_VEGETABLE (6):**
- BANANA, PINEAPPLE, CAULIFLOWER, STRAWBERRY, WATERMELON, BROCCOLI

**DISH (6):**
- PIZZA, SPAGHETTI, CHICKEN PARMESAN, TACOS, HAMBURGER, FISH AND CHIPS

**SWEET (6):**
- CAKE, CHOCOLATE, TIRAMISU, COOKIES, ICE CREAM, CHEESECAKE

**CANDY (6):**
- LOLLIPOP, GUMMY BEARS, BUTTERSCOTCH, JELLY BEANS, CHOCOLATE BAR, COTTON CANDY

### Adding More Data

Create a new migration file:
```sql
-- V3__Add_more_words.sql
INSERT INTO words (category, word, hint, difficulty) VALUES
('LOCATION_PLACE', 'TOKYO', 'Capital of Japan', 'EASY'),
('DISH', 'SUSHI', 'Japanese rice dish', 'EASY');
```

---

## 🔍 Repository Layer

### JPA Repository Interface

```java
@Repository
public interface WordJpaRepository extends JpaRepository<WordEntity, Long> {
    List<WordEntity> findByCategory(Category category);
    
    // Uses MySQL's RAND() function
    @Query(value = "SELECT * FROM words WHERE category = :category ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<WordEntity> findRandomByCategory(@Param("category") String category);
}
```

### Wrapper Repository

```java
@Repository
public class WordRepository {
    private final WordJpaRepository jpaRepository;
    
    // Provides consistent interface
    public Optional<WordEntity> findRandomByCategory(Category category) {
        return jpaRepository.findRandomByCategory(category.name());
    }
}
```

---

## 🚨 Troubleshooting

### Issue: Cannot connect to MySQL

**Error:** `Communications link failure`

**Solution:**
1. Ensure MySQL server is running:
   ```bash
   # Windows (as Administrator)
   net start MySQL80
   
   # Check status
   sc query MySQL80
   ```
2. Verify MySQL is listening on port 3306
3. Check firewall settings

### Issue: Access denied for user

**Error:** `Access denied for user 'adeel'@'localhost'`

**Solution:**
1. Verify username and password in `application.properties`
2. Grant proper privileges:
   ```sql
   GRANT ALL PRIVILEGES ON wheel_of_fortune.* TO 'adeel'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Issue: Database does not exist

**Error:** `Unknown database 'wheel_of_fortune'`

**Solution:**
- The `createDatabaseIfNotExist=true` parameter should auto-create it
- Manually create if needed:
  ```sql
  CREATE DATABASE wheel_of_fortune 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;
  ```

### Issue: Migration Checksum Mismatch

**Error:** `Migration checksum mismatch`

**Cause:** An existing migration file was modified after being applied

**Solution:**
1. Never modify applied migrations
2. Create a new migration to fix issues
3. Or, for development: Drop and recreate database
   ```sql
   DROP DATABASE wheel_of_fortune;
   CREATE DATABASE wheel_of_fortune 
   CHARACTER SET utf8mb4 
   COLLATE utf8mb4_unicode_ci;
   ```

### Issue: Table already exists

**Error:** `Table 'words' already exists`

**Cause:** Running migrations on existing schema

**Solution:**
- Flyway will baseline existing database
- Or clean and migrate:
  ```sql
  DROP DATABASE wheel_of_fortune;
  # Restart application
  ```

---

## 🧪 Testing Migrations

### Fresh Database Test

1. Drop existing database:
   ```sql
   DROP DATABASE IF EXISTS wheel_of_fortune;
   ```

2. Start application:
   ```bash
   ./mvnw spring-boot:run
   ```

3. Verify migrations applied:
   - Check logs for Flyway messages
   - Connect to MySQL and query tables
   ```sql
   USE wheel_of_fortune;
   SHOW TABLES;
   SELECT COUNT(*) FROM words;
   ```

### Verify Data Populated

```bash
curl http://localhost:8080/api/words/categories
```

Expected: All 6 categories returned

```bash
curl "http://localhost:8080/api/words/random?category=DISH"
```

Expected: Random word from DISH category

---

## 📚 Best Practices

### ✅ DO:
- Use sequential version numbers (V1, V2, V3...)
- Write idempotent migrations when possible
- Test migrations on fresh database
- Include descriptive comments in SQL
- Keep migrations small and focused
- Commit migration files to version control
- Use UTF8MB4 charset for proper Unicode support
- Use InnoDB engine for transactional support

### ❌ DON'T:
- Modify existing migration files after applying
- Skip version numbers
- Use same version number twice
- Delete applied migration files
- Mix DDL and DML in same migration (unless necessary)
- Use MyISAM engine (use InnoDB instead)

---

## 🔄 Migration Examples (MySQL)

### Example 1: Add New Column
```sql
-- V3__Add_created_date.sql
ALTER TABLE words 
ADD COLUMN created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

### Example 2: Create New Table
```sql
-- V4__Create_game_sessions.sql
CREATE TABLE game_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    player_name VARCHAR(100),
    score INT,
    word_id BIGINT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    INDEX idx_player_name (player_name),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Example 3: Data Migration
```sql
-- V5__Normalize_word_case.sql
UPDATE words SET word = UPPER(word);
```

### Example 4: Index Creation
```sql
-- V6__Add_performance_indexes.sql
CREATE INDEX idx_game_sessions_player ON game_sessions(player_name);
CREATE INDEX idx_game_sessions_created ON game_sessions(created_at);
```

### Example 5: Add Full-Text Search
```sql
-- V7__Add_fulltext_search.sql
ALTER TABLE words ADD FULLTEXT INDEX ft_word_hint (word, hint);
```

---

## 🎯 Summary

✅ **Flyway** manages database schema versions  
✅ **MySQL Database** provides robust, scalable storage  
✅ **JPA Entities** map to database tables  
✅ **Automatic migration** on application startup  
✅ **36 sample words** pre-loaded  
✅ **UTF8MB4** charset for Unicode support  
✅ **InnoDB** engine for ACID compliance  

**Prerequisites:**
- MySQL Server 8.0+ installed and running
- User 'adeel' with proper privileges
- Port 3306 accessible

**Ready to use!** Start the application and Flyway will handle the rest.
