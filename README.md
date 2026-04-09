# UtsavHub — Club Platform

> A modern digital home for teams, events, and student projects.

**Live →** [webweavebinarybears.vercel.app](https://webweavebinarybears.vercel.app/)

---

## What is UtsavHub?

UtsavHub is a full-featured club platform built by Binary Bears for WebWeave. It gives clubs a polished space to manage their team directory, run events, and showcase projects — all in one place.

---

## Features

| Area | What it does |
|---|---|
| Auth | Signup, login, protected routes, role-based access |
| Team | Browse, search, and filter members by role, domain, skills, and alumni status |
| Events | List and filter upcoming and past events. Admins can create and edit |
| Projects | Showcase work with tech stack, live links, and descriptions. Admins can manage |
| Admin | Dedicated controls for team, event, and project management |
| UI | Mobile-first, responsive design with reusable component system |

---

## Tech Stack

```
React          Hooks, Context API, React Router
Axios          REST API communication
Lucide Icons   UI icons
React Icons    Supplementary icon set
CSS            Custom design system (no UI framework)
```

---

## Project Structure

```
src/
├── components/
│   ├── cards/        TeamCard, EventCard, ProjectCard
│   ├── forms/        AuthForm
│   ├── layout/       Navbar, Footer, MainLayout
│   └── ui/           Loader, EmptyState, SectionTitle
├── context/          AuthContext
├── hooks/            useAuth, useFilter
├── pages/            HomePage, TeamPage, EventsPage, ProjectsPage
├── services/         api.js, teamService, eventService, projectService
├── styles/           global.css, pages.css, theme.css
└── utils/            constants.js, formatDate.js, storage.js
```

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-org/UtsavHub.git
cd UtsavHub

# 2. Install dependencies
npm install

# 3. Set your API base URL
cp .env.example .env
# Edit VITE_API_BASE_URL in .env

# 4. Start the dev server
npm run dev
```

---

## API

The frontend expects a REST API at the base URL defined in `.env`.

```
GET     /api/v1/team
GET     /api/v1/events?type=upcoming
GET     /api/v1/projects
POST    /api/v1/auth/login
POST    /api/v1/auth/signup
```

See `src/services/` for the full request shape and error handling.

---

## Environment Variables

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

> Never commit `.env` — it is gitignored by default.

---

## Notes

- API debug logs are active in development mode (`src/services/api.js`)
- Role-based guards are handled via `AuthContext` — admin routes require `role: "admin"`
- All cards and layout components are fully responsive down to 320px

---

Made with ♥ by **Binary Bears**