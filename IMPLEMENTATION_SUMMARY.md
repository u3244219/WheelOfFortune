# Wheel of Fortune - Backend Implementation Summary

## ✅ Completed Implementation

### 1. Data Models

#### **WordEntity** (`model/WordEntity.java`)
Core entity representing a word puzzle with:
- `id` (Long) - Unique identifier
- `category` (Category enum) - Word category
- `word` (String) - The actual word/phrase
- `hint` (String) - Optional hint for players
- `difficulty` (Difficulty enum) - Puzzle difficulty level

#### **Category Enum** (`model/Category.java`)
Six predefined categories:
- LOCATION_PLACE - Geographic locations
- GENERAL_ITEM - Common objects
- FRUIT_VEGETABLE - Produce items
- DISH - Food dishes
- SWEET - Desserts
- CANDY - Confectionery

#### **Difficulty Enum** (`model/Difficulty.java`)
Three difficulty levels:
- EASY
- MEDIUM
- HARD

---

### 2. DTOs (Data Transfer Objects)

#### **WordResponse** (`dto/WordResponse.java`)
Returned when requesting a new word puzzle:
```json
{
  "wordId": 1,
  "category": "LOCATION_PLACE",
  "maskedWord": "_____",
  "hint": "Capital of France",
  "difficulty": "EASY",
  "wordLength": 5
}
```

#### **GuessRequest** (`dto/GuessRequest.java`)
Sent when guessing a letter:
```json
{
  "wordId": 1,
  "letter": "A",
  "currentMask": "_____"
}
```

#### **GuessResponse** (`dto/GuessResponse.java`)
Returned after processing a guess:
```json
{
  "correct": true,
  "updatedMask": "_A___",
  "occurrences": 1,
  "puzzleSolved": false,
  "message": "Correct! Found 1 occurrence(s) of 'A'"
}
```

---

### 3. Business Logic

#### **WordService** (`service/WordService.java`)
Core game logic:
- `getRandomWordByCategory()` - Returns random word with masked letters
- `processGuess()` - Evaluates letter guess, updates mask, checks if solved
- `createMask()` - Converts word to underscore pattern (preserves spaces/punctuation)

**Key Features:**
- Case-insensitive letter matching
- Preserves spaces and special characters in masked word
- Counts letter occurrences
- Detects puzzle completion
- Provides contextual feedback messages

#### **WordRepository** (`repository/WordRepository.java`)
In-memory data storage with 24 pre-loaded words:
- 4 words per category
- Mix of easy/medium/hard difficulties
- Includes hints for all words

**Methods:**
- `findById()` - Get word by ID
- `findRandomByCategory()` - Get random word from category
- `findAll()` - Get all words
- `findByCategory()` - Filter by category
- `save()` - Add/update words

---

### 4. REST API Endpoints

#### **WordController** (`controller/WordController.java`)

**1. GET `/api/words/categories`**
- Returns list of all available categories
- No parameters required

**2. GET `/api/words/random?category={CATEGORY}`**
- Returns random word from specified category
- Letters masked as underscores
- Includes hint and difficulty

**3. POST `/api/words/guess`**
- Processes letter guess
- Returns updated mask and game state
- Indicates correct/incorrect guess
- Reports if puzzle is solved

---

## 📦 Sample Data Included

**24 Pre-loaded Words Across All Categories:**

**LOCATION_PLACE:**
- PARIS (Easy) - "Capital of France"
- GRAND CANYON (Medium) - "Famous Arizona landmark"
- MOUNT EVEREST (Hard) - "Tallest mountain in the world"
- AUSTRALIA (Easy) - "Continent and country"

**GENERAL_ITEM:**
- BICYCLE (Easy) - "Two-wheeled vehicle"
- TELEPHONE (Medium) - "Communication device"
- REFRIGERATOR (Hard) - "Kitchen appliance for cooling"
- UMBRELLA (Easy) - "Rain protection"

**FRUIT_VEGETABLE:**
- BANANA (Easy) - "Yellow tropical fruit"
- PINEAPPLE (Medium) - "Spiky tropical fruit"
- CAULIFLOWER (Hard) - "White vegetable in florets"
- STRAWBERRY (Medium) - "Red berry"

**DISH:**
- PIZZA (Easy) - "Italian flatbread with toppings"
- SPAGHETTI (Medium) - "Long Italian pasta"
- CHICKEN PARMESAN (Hard) - "Breaded chicken with cheese"
- TACOS (Easy) - "Mexican tortilla dish"

**SWEET:**
- CAKE (Easy) - "Baked dessert"
- CHOCOLATE (Medium) - "Sweet cocoa confection"
- TIRAMISU (Hard) - "Italian coffee dessert"
- COOKIES (Easy) - "Baked sweet treats"

**CANDY:**
- LOLLIPOP (Easy) - "Candy on a stick"
- GUMMY BEARS (Medium) - "Chewy fruit candies"
- BUTTERSCOTCH (Hard) - "Buttery caramel candy"
- JELLY BEANS (Medium) - "Small bean-shaped candies"

---

## 🔧 Technical Details

### Architecture
- **Framework:** Spring Boot 3.5.7
- **Java Version:** 21
- **Build Tool:** Maven
- **Storage:** In-memory (easily upgradable to JPA/database)

### Key Design Decisions

1. **Letter Masking Logic:**
   - Letters → `_` (underscore)
   - Spaces → preserved as spaces
   - Special chars → preserved
   - Example: "GRAND CANYON" → "_____ ______"

2. **Case Handling:**
   - All words stored in UPPERCASE
   - Letter guesses converted to uppercase
   - Case-insensitive matching

3. **Game State Management:**
   - Client maintains current mask state
   - Server validates and updates based on guess
   - Stateless API design

4. **Response Structure:**
   - All responses in JSON format
   - Machine-readable and parseable
   - Consistent error handling

---

## 🚀 Running the Application

### Build:
```bash
./mvnw clean install
```

### Run:
```bash
./mvnw spring-boot:run
```

### Test API:
```bash
# Get categories
curl http://localhost:8080/api/words/categories

# Get random word
curl "http://localhost:8080/api/words/random?category=FRUIT_VEGETABLE"

# Make a guess
curl -X POST http://localhost:8080/api/words/guess \
  -H "Content-Type: application/json" \
  -d '{"wordId":1,"letter":"A","currentMask":"______"}'
```

---

## 📋 Example Game Flow

### 1. Request Categories
```bash
GET /api/words/categories
```
Response: `["LOCATION_PLACE", "GENERAL_ITEM", ...]`

### 2. Get Word Puzzle
```bash
GET /api/words/random?category=DISH
```
Response:
```json
{
  "wordId": 13,
  "category": "DISH",
  "maskedWord": "_____",
  "hint": "Italian flatbread with toppings",
  "difficulty": "EASY",
  "wordLength": 5
}
```

### 3. Guess Letters
```bash
POST /api/words/guess
Body: {"wordId":13,"letter":"P","currentMask":"_____"}
```
Response:
```json
{
  "correct": true,
  "updatedMask": "P____",
  "occurrences": 1,
  "puzzleSolved": false,
  "message": "Correct! Found 1 occurrence(s) of 'P'"
}
```

### 4. Continue Guessing
```bash
POST /api/words/guess
Body: {"wordId":13,"letter":"I","currentMask":"P____"}
```
Response:
```json
{
  "correct": true,
  "updatedMask": "PI__A",
  "occurrences": 2,
  "puzzleSolved": false,
  "message": "Correct! Found 2 occurrence(s) of 'I'"
}
```

### 5. Solve Puzzle
Eventually get:
```json
{
  "correct": true,
  "updatedMask": "PIZZA",
  "occurrences": 1,
  "puzzleSolved": true,
  "message": "Congratulations! You solved the puzzle!"
}
```

---

## 📖 Files Created/Modified

### Created:
- `src/main/java/com/adeel/wheeloffotune/model/Category.java`
- `src/main/java/com/adeel/wheeloffotune/model/Difficulty.java`
- `src/main/java/com/adeel/wheeloffotune/model/WordEntity.java`
- `src/main/java/com/adeel/wheeloffotune/dto/WordResponse.java`
- `src/main/java/com/adeel/wheeloffotune/dto/GuessRequest.java`
- `src/main/java/com/adeel/wheeloffotune/dto/GuessResponse.java`
- `src/main/java/com/adeel/wheeloffotune/repository/WordRepository.java`
- `src/main/java/com/adeel/wheeloffotune/service/WordService.java`
- `src/main/java/com/adeel/wheeloffotune/controller/WordController.java`
- `API_DOCUMENTATION.md`

### Modified:
- `pom.xml` - Added spring-boot-starter-web dependency

---

## ✨ Ready to Use!

The backend is now fully implemented and ready for frontend integration. All endpoints return structured JSON responses that can be easily consumed by any frontend framework (React, Angular, Vue, etc.).

**Next Steps:**
1. Run the application: `./mvnw spring-boot:run`
2. Test endpoints using curl or Postman
3. Integrate with frontend application
4. (Optional) Add database persistence layer
5. (Optional) Add authentication/authorization

