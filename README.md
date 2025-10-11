<img width="947" height="866" alt="Screenshot 2025-10-11 141155" src="https://github.com/user-attachments/assets/08d64c75-99ff-40c2-a092-9078048190db" />
<img width="748" height="601" alt="Screenshot 2025-10-11 141144" src="https://github.com/user-attachments/assets/ae469ba2-8a60-4f93-a51d-96a151aa59ea" />
<img width="1884" height="925" alt="Screenshot 2025-10-11 141132" src="https://github.com/user-attachments/assets/684c16c4-79bc-4687-ba4b-63b9127298e7" />
<img width="1882" height="918" alt="Screenshot 2025-10-11 141228" src="https://github.com/user-attachments/assets/ae725408-9113-49be-ac10-917a7a1e4014" />
<img width="1888" height="921" alt="Screenshot 2025-10-11 141216" src="https://github.com/user-attachments/assets/b16cb053-484a-4608-8bc8-cb12e87f8752" />
<img width="1888" height="1012" alt="Screenshot 2025-10-11 141109" src="https://github.com/user-attachments/assets/217e9b42-f184-4637-84ad-d4f181aa76f4" />
<img width="1883" height="928" alt="Screenshot 2025-10-11 141058" src="https://github.com/user-attachments/assets/854f5ede-eb71-4b45-b53a-3f451d8c3105" />
<<<<<<< HEAD
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
