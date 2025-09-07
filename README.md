# Library Management Backend

## Project Overview
Library Management Backend using Node.js, TypeScript, Express, Prisma, Redis, and SQLite.  
APIs to manage books and authors with Redis caching. Dockerized for easy setup.


```bash

Project Setup
git clone git@github.com:ayusclg/-yipl-backend-2025.git
cd -yipl-backend-2025
npm install
npx prisma generate

## Features
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

.env
PORT=5000
DATABASE_URL="file:./dev.db"
REFRESH_TOKEN_SECRET=fjfbasjfkbda
REFRESH_TOKEN_EXPIRY=30d
ACCESS_TOKEN_SECRET=fjdkfbsjkf
ACCESS_TOKEN_EXPIRY=1d

Running the Project
Option 1:
 Docker Compose
docker compose up --build
Locally
Option 2 :
npm run test  # dev server
npm run build**
npm start     # production
