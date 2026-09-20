# Wheel of Fortune

A word-guessing game built for family play on a TV or tablet: a Spring Boot
backend serving a MySQL word bank, and a React frontend with a prize wheel,
sound effects, multiplayer scoring and full keyboard navigation.

## Stack

- **Backend** — Spring Boot 3.5.7, Java 21, Spring Data JPA, Flyway
- **Database** — MySQL (`wheel_of_fortune`), migrations in `src/main/resources/db/migration`
- **Frontend** — React 19 (Create React App), Framer Motion, Howler, Axios

## Prerequisites

- JDK 21
- MySQL 8 running on `localhost:3306`
- Node.js 18 or newer

## Database setup

Create the schema and application user, then let Flyway load the word bank on
first start:

```bash
mysql -u root -p < setup_mysql_user.sql
```

`reset_database.sql` drops and recreates the data if you want a clean word
bank. Connection settings live in `src/main/resources/application.properties`.
See `docs/MYSQL_SETUP.md` for a walkthrough and `docs/FIX_MYSQL_PERMISSIONS.md`
if the app cannot connect.

## Running it

Backend, from the project root:

```bash
./mvnw spring-boot:run        # mvnw.cmd on Windows
```

It binds to `0.0.0.0:8080`, so other devices on the same WiFi can reach it.

Frontend:

```bash
cd frontend
npm install
npm start
```

The frontend reads the backend URL from `frontend/.env`
(`REACT_APP_API_BASE_URL`). Set it to your machine's LAN IP to play from a
phone or TV — details in `docs/LOCAL_NETWORK_ACCESS.md`.

## API

All endpoints sit under `/api/words`:

- `GET /categories` — available puzzle categories
- `GET /random?category={name}` — a random puzzle with its hint
- `POST /guess` — submit a letter or full-word guess
- `GET /letter-points` — Scrabble letter values used for scoring

Full request and response shapes are in `docs/API_DOCUMENTATION.md`.

## Deployment

`deploy-windows.ps1` and `deploy.sh` push the repository to GitHub. The
frontend deploys to GitHub Pages at
`https://u3244219.github.io/WheelOfFortune` via `npm run deploy` in
`frontend/` — see `docs/GITHUB_PAGES_DEPLOYMENT.md`.

## Docs

- `docs/API_DOCUMENTATION.md` — endpoint reference
- `docs/MYSQL_SETUP.md`, `docs/FIX_MYSQL_PERMISSIONS.md` — database setup and troubleshooting
- `docs/MIGRATION_GUIDE.md` — history of the SQLite to MySQL move
- `docs/LOCAL_NETWORK_ACCESS.md` — playing from other devices on the network
- `docs/GITHUB_PAGES_DEPLOYMENT.md` — frontend deployment
- `docs/GAME_ENHANCEMENTS_RESEARCH.md` — ideas and research for future gameplay features

## A note on credentials

`application.properties` currently carries the MySQL username and password in
plain text. Before this repository goes anywhere public, move them to
environment variables (`SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD`).
