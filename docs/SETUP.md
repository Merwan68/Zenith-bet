# Local Development & Setup Guide

## Quick Start (Under 2 Minutes)

### 1. Environment Setup
```bash
git clone https://github.com/zenith-arena/platform.git
cd platform
cp .env.example .env
npm install
```

### 2. Environment Variables (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://zenith_admin:zenith_secret@localhost:5432/zenith_db
TELEBIRR_SANDBOX_ENDPOINT=https://api.sandbox.telebirr.et
SPORTRADAR_API_KEY=
SPRIBE_MERCHANT_ID=
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## Running with Docker Compose

To boot the full stack including PostgreSQL 15 and Redis:
```bash
docker compose up -d
```
The database will automatically initialize using `/database/schema.sql` and `/database/seed.sql`.
