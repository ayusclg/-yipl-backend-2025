Project Overview
Library Management Backend using Node.js, TypeScript, Express, Prisma, Redis, and SQLite.
APIs to manage books and authors with Redis caching. Dockerized for easy setup.

Clone the Repository

git clone git@github.com:ayusclg/-yipl-backend-2025.git
cd -yipl-backend-2025


Features

CRUD for books and authors

Redis caching

TypeScript

Prisma ORM

Dockerized backend

Prerequisites

Node.js >= 22

Docker (optional)

Docker Compose (optional)

SQLite (included via Docker volume)

Redis (Docker service)

Environment Variables (.env)

PORT=5000
DATABASE_URL="file:./dev.db"
REFRESH_TOKEN_SECRET=fjfbasjfkbda
REFRESH_TOKEN_EXPIRY=30d
ACCESS_TOKEN_SECRET=fjdkfbsjkf
ACCESS_TOKEN_EXPIRY=1d
REDIS_HOST=redis
REDIS_PORT=6379


Note: REDIS_HOST=redis when using Docker Compose

Project Setup

git clone git@github.com:ayusclg/-yipl-backend-2025.git
cd -yipl-backend-2025
npm install
npx prisma generate


Running the Project

Option 1: Docker Compose (Recommended)

docker compose up --build


Backend: http://localhost:5000

Redis: 6379

SQLite data persists in ./data

Option 2: Locally

npm run test  # dev server
npm run build
npm start     # production


Project Structure

src/
  Controllers/   # API routes
  Middlewares/   # Middleware
  Utils/         # Helper functions
  index.ts       # Entry point
Dockerfile
docker-compose.yml
data/            # SQLite storage
.env             # Environment variables
