# Wongnok Recipes

A modern recipe management web application built with Nuxt 3, Bun, Prisma, and PostgreSQL.

## Features
- Recipe creation, editing, and browsing
- User authentication
- Ratings and difficulty levels
- Fast, modern UI with Nuxt 3 and @nuxt/ui

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed

### Quick Start (Recommended)

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/novian-star/514930-wongnok-recipes.git
   cd 514930-wongnok-recipes
   ```

2. **Start the app and database:**
   ```powershell
   docker-compose up --build
   ```
   This will start both the PostgreSQL database and the Nuxt app. The app will be available at [http://localhost:3000](http://localhost:3000).

3. **Stop the services:**
   Press `Ctrl+C` in the terminal, then run:
   ```powershell
   docker-compose down
   ```

### Manual Setup (Development)

1. **Install [Bun](https://bun.sh/):**
   Follow the instructions on the Bun website for your OS.

2. **Install dependencies:**
   ```powershell
   bun install
   ```

3. **Set up PostgreSQL:**
   - You can use Docker as above, or install PostgreSQL locally.
   - Create a database named `wongnok_recipes` and a user `root` with password `password` (or update the `DATABASE_URL` in your environment).

4. **Run database migrations:**
   ```powershell
   bunx prisma migrate deploy
   ```

5. **Start the development server:**
   ```powershell
   bun run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables
- `DATABASE_URL` (default: `postgres://root:password@postgres:5432/wongnok_recipes`)
- `PORT` (default: `3000`)

## Useful Commands
- `bun run build` — Build the app for production
- `bun run dev` — Start the development server
- `bunx prisma migrate deploy` — Run database migrations
- `bunx prisma studio` — Open Prisma Studio to view/edit the database

## License
MIT
