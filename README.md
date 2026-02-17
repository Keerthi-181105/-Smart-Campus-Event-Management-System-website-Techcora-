## 🌐 Live Demo

[Click here to view the website](https://keerthi-181105.github.io/Smart-Campus-Event-Management-System-website-Techcora/)

# Smart Campus Event Management System (SRM University)

A full-stack platform for students to discover and register for campus events, and for organizers to create and manage events with real-time updates and analytics.

## Tech Stack

- Frontend: React + TypeScript + TailwindCSS (Vite)
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL (Prisma ORM)
- Auth: JWT with roles (Student, Organizer, Admin)
- Real-time: Socket.io
- Deployment: Frontend (Vercel), Backend (Render), Database (Supabase/Neon)

## Monorepo Structure

```
smart-campus-system/
 ├── frontend/
 ├── backend/
 ├── prisma/
 ├── docs/
 ├── tests/
 ├── docker-compose.yml
 └── README.md
```

## Quick Start (Local)

1. Prerequisites: Node 18+, pnpm/npm, Docker (optional), PostgreSQL (local or cloud)
2. Install deps:

```bash
cd smart-campus-system
npm install --prefix backend && npm install --prefix frontend
```

3. Configure env:

- Copy `backend/.env.example` to `backend/.env` and set values
- Ensure PostgreSQL is reachable

4. Database (Prisma):

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

5. Run dev:

```bash
# terminal A
cd backend && npm run dev
# terminal B
cd frontend && npm run dev
```

6. Docs: Swagger at `/api/docs`

## Docker (Full Stack)

```bash
docker compose up --build
```

- Backend: http://localhost:4000
- Frontend: http://localhost:5173
- Postgres: localhost:5432 (container)

## Deploy

- Frontend: Vercel – set `VITE_API_URL`
- Backend: Render – set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`
- Database: Supabase/Neon – use connection string in `DATABASE_URL`

## Theming

- Violet `#7c3aed` and Black `#0f0f0f`
- Default dark mode; glassmorphism cards; rounded 2xl; soft shadows

## Scripts

- Backend: `dev`, `build`, `start`, `seed`
- Frontend: `dev`, `build`, `preview`

## License

MIT

=======
# -Smart-Campus-Event-Management-System-website-Techcora-
Smart Campus — a full-stack app for managing and registering campus events.
>>>>>>> 4fbd706a5859af4313ec30d3963b9447bd42a8f2
