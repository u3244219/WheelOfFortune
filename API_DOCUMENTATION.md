# Wheel of Fortune - Backend API Documentation

## Data Model

### WordEntity
The core entity storing categorized words in the system.

```json
{
  "id": 1,
  "category": "LOCATION_PLACE",
  "word": "PARIS",
  "hint": "Capital of France",
  "difficulty": "EASY"
}
```

### Enumerations

**Category:**
- `LOCATION_PLACE` - Geographic locations
- `GENERAL_ITEM` - Common objects
- `FRUIT_VEGETABLE` - Produce items
- `DISH` - Food dishes
- `SWEET` - Desserts
- `CANDY` - Confectionery

**Difficulty:**
- `EASY`
- `MEDIUM`
- `HARD`

---

## API Endpoints

### 1. Get Categories
**GET** `/api/words/categories`

Returns all available word categories.

**Response:**
```json
[
  "LOCATION_PLACE",
  "GENERAL_ITEM",
  "FRUIT_VEGETABLE",
  "DISH",
  "SWEET",
  "CANDY"
]
```

---

### 2. Get Random Word by Category
**GET** `/api/words/random?category={CATEGORY}`

Returns a random word from the specified category with masked letters.

**Query Parameters:**
- `category` (required) - One of the available categories

**Example Request:**
```
GET /api/words/random?category=LOCATION_PLACE
```

**Success Response (200 OK):**
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

**Notes:**
- Letters are replaced with underscores (`_`)
- Spaces and special characters are preserved
- Example: "GRAND CANYON" → "_____ ______"

---

### 3. Process Letter Guess
**POST** `/api/words/guess`

Processes a letter guess and returns updated puzzle state.

**Request Body:**
```json
{
  "wordId": 1,
  "letter": "A",
  "currentMask": "_____"
}
```

**Success Response (200 OK) - Correct Guess:**
```json
{
  "correct": true,
  "updatedMask": "_A___",
  "occurrences": 1,
  "puzzleSolved": false,
  "message": "Correct! Found 1 occurrence(s) of 'A'"
}
```

**Success Response (200 OK) - Incorrect Guess:**
```json
{
  "correct": false,
  "updatedMask": "_____",
  "occurrences": 0,
  "puzzleSolved": false,
  "message": "Sorry, 'Z' is not in the word"
}
```

**Success Response (200 OK) - Puzzle Solved:**
```json
{
  "correct": true,
  "updatedMask": "PARIS",
  "occurrences": 1,
  "puzzleSolved": true,
  "message": "Congratulations! You solved the puzzle!"
}
```

**Error Response (404 Not Found):**
Invalid wordId provided.

---

## Sample Game Flow

### Step 1: Get Categories
```bash
curl http://localhost:8080/api/words/categories
```

### Step 2: Request a Word
```bash
curl "http://localhost:8080/api/words/random?category=FRUIT_VEGETABLE"
```

Response:
```json
{
  "wordId": 9,
  "category": "FRUIT_VEGETABLE",
  "maskedWord": "______",
  "hint": "Yellow tropical fruit",
  "difficulty": "EASY",
  "wordLength": 6
}
```

### Step 3: Guess Letters
```bash
curl -X POST http://localhost:8080/api/words/guess \
  -H "Content-Type: application/json" \
  -d '{
    "wordId": 9,
    "letter": "A",
    "currentMask": "______"
  }'
```

Response:
```json
{
  "correct": true,
  "updatedMask": "_A_A_A",
  "occurrences": 3,
  "puzzleSolved": false,
  "message": "Correct! Found 3 occurrence(s) of 'A'"
}
```

### Step 4: Continue Guessing
```bash
curl -X POST http://localhost:8080/api/words/guess \
  -H "Content-Type: application/json" \
  -d '{
    "wordId": 9,
    "letter": "B",
    "currentMask": "_A_A_A"
  }'
```

Response:
```json
{
  "correct": true,
  "updatedMask": "BA_A_A",
  "occurrences": 1,
  "puzzleSolved": false,
  "message": "Correct! Found 1 occurrence(s) of 'B'"
}
```

Continue until `puzzleSolved: true`

---

## Sample Data Included

The system includes 24 pre-loaded words across all categories:

**LOCATION_PLACE:**
- PARIS (Easy)
- GRAND CANYON (Medium)
- MOUNT EVEREST (Hard)
- AUSTRALIA (Easy)

**GENERAL_ITEM:**
- BICYCLE (Easy)
- TELEPHONE (Medium)
- REFRIGERATOR (Hard)
- UMBRELLA (Easy)

**FRUIT_VEGETABLE:**
- BANANA (Easy)
- PINEAPPLE (Medium)
- CAULIFLOWER (Hard)
- STRAWBERRY (Medium)

**DISH:**
- PIZZA (Easy)
- SPAGHETTI (Medium)
- CHICKEN PARMESAN (Hard)
- TACOS (Easy)

**SWEET:**
- CAKE (Easy)
- CHOCOLATE (Medium)
- TIRAMISU (Hard)
- COOKIES (Easy)

**CANDY:**
- LOLLIPOP (Easy)
- GUMMY BEARS (Medium)
- BUTTERSCOTCH (Hard)
- JELLY BEANS (Medium)

---

## Implementation Notes

### Data Storage
- Currently uses in-memory storage via `WordRepository`
- Can be easily migrated to JPA/Hibernate with database persistence
- All data is lost on application restart (add persistence layer as needed)

### Letter Matching
- Case-insensitive matching
- All words stored in UPPERCASE
- Spaces and punctuation preserved in masked word

### Error Handling
- 400 Bad Request: Invalid category name
- 404 Not Found: Invalid wordId or no words in category
- 200 OK: Successful operation

---

## Running the Application

1. Build the project:
```bash
./mvnw clean install
```

2. Run the application:
```bash
./mvnw spring-boot:run
```

3. Server starts on: `http://localhost:8080`

4. Test the API:
```bash
curl http://localhost:8080/api/words/categories
```

