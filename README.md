# Todo App - Full Stack MERN Application

A modern, responsive Todo application built with the MERN stack (MongoDB, Express.js, React/Next.js, Node.js). It features a clean UI, robust API with validation and security middleware, and end‑to‑end task management.

## 🚀 Features

### Core Functionality
- **Create Tasks**: Add tasks with title, description, optional due date, and status
- **Read Tasks**: List tasks with server-side filtering, sorting, and pagination
- **Update Tasks**: Edit any task field (title, description, status, due date)
- **Delete Tasks**: Remove tasks with confirmation in the UI
- **Toggle Status**: One-click cycle through statuses via a dedicated endpoint

### Advanced Capabilities
- **Filtering & Sorting**: Filter by status; sort by title, description, status, or creation date; control sort order
- **Pagination**: `page` and `limit` query params for large lists
- **Task Statistics**: Dashboard cards summarizing totals and completion rate
- **Text Search (in development)**: Endpoint scaffolded; full server-side matching in progress
- **Bulk Operations (API)**: Perform delete/update/toggle on multiple tasks
- **Responsive Design**: Mobile-first UI with dark mode
  
Additional planned UI actions:
- **Bulk Import (UI) (in development)**
- **Export Tasks (UI) (in development)**

### User Experience
- **Modern UI**: Tailwind-based design and animations with Framer Motion
- **Dark Mode**: Built-in light/dark theme support
- **Loading & Error States**: Clear feedback during async operations
- **Accessibility**: Semantic markup and keyboard-focusable controls

## 🛠️ Tech Stack

### Backend
- **Node.js + Express** for the HTTP API
- **MongoDB + Mongoose** for data persistence
- **Joi** for request validation
- **Helmet** and **express-rate-limit** for security
- **CORS** with allowlist via environment variables
- **dotenv**, **morgan**

### Frontend
- **Next.js 15 (App Router)** with **React 19** and **TypeScript**
- **@tanstack/react-query** for data fetching/caching and mutations
- **Axios** HTTP client
- **Tailwind CSS** and **Framer Motion** for UI/animation

## 📁 Project Structure

```
TodoApp/
├── backend/
│   ├── controllers/         # Route controllers (HTTP layer)
│   ├── services/            # Business logic (CRUD, stats, rules)
│   ├── models/              # Mongoose schemas (Task)
│   ├── routes/              # Express routers (tasks)
│   ├── validators/          # Joi schemas (create/update/query/id)
│   ├── middleware/          # error handling, security, validation
│   ├── config/              # env-specific config (production.js)
│   ├── server.js            # App bootstrap, DB connect, middleware stack
│   └── package.json
└── frontend/
    ├── app/
    │   ├── components/      # UI components (TaskForm, TaskList, etc.)
    │   ├── hooks/           # React Query hooks (useTasks)
    │   ├── providers/       # QueryProvider
    │   ├── utils/           # api.ts (typed client)
    │   ├── page.tsx         # Dashboard page
    │   └── settings/        # Settings page
    └── package.json
```

## 🧱 Data Model

Task fields (MongoDB/Mongoose):
- `title: string` (required)
- `description: string` (required)
- `dueDate: Date | null` (optional)
- `status: 'todo' | 'in-progress' | 'done'` (default: `todo`)
- `createdAt: Date`, `updatedAt: Date`

## ✅ Validation Rules (Joi)

- Create: `title` (1–100 chars), `description` (1–500 chars), `status` in `todo|in-progress|done` (default `todo`), `dueDate` ISO date nullable
- Update: Same fields as create, all optional; `id` params validated as 24‑char hex
- Query: `status`, `sortBy` in `title|description|status|createdAt`, `sortOrder` in `asc|desc`, pagination via `page` and `limit`; text search via `q` on search route

## 🔐 Security & Middleware

- **Helmet** CSP, CORP/COEP tuned for API use
- **CORS** allowlist from `ALLOWED_ORIGINS`
- **Rate limits**: general API (100/15m); stricter for creation (20/15m)
- **Sanitization** of body/query to reduce XSS vectors
- **Centralized error handler** with operational errors via `AppError`

## 🔗 API Endpoints

Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| GET    | `/`                   | List tasks (filter/sort/paginate)        |
| GET    | `/stats`              | Aggregate task statistics                 |
| GET    | `/search?q=...`       | Text search (in development)             |
| GET    | `/:id`                | Get task by id                            |
| POST   | `/`                   | Create task                               |
| PUT    | `/:id`                | Update task                               |
| PATCH  | `/:id/toggle`         | Cycle status (todo → in‑progress → done)  |
| DELETE | `/:id`                | Delete task                               |
| POST   | `/bulk`               | Bulk delete/update/toggle                 |

Query params (list/search): `status`, `sortBy`, `sortOrder`, `page`, `limit`

Bulk request example:

```json
{
  "operation": "delete|update|toggle",
  "taskIds": ["<id1>", "<id2>"],
  "data": { "status": "done" }
}
```

## 🧭 Frontend Overview

- **React Query** manages caching, background refetch, and optimistic flows for create/update/delete/toggle
- **Components**: `TaskForm` (validation + create/edit), `TaskList` (client-side refine/sort), `TaskItem` (inline status toggle/edit/delete), `DashboardStats` (derived counts)
- **API client**: `api.ts` uses `NEXT_PUBLIC_API_URL` (required in production) and expects `{ success, data }` responses
- **Quick Actions**: Bulk Import and Export buttons are present but functionality is (in development)

## 🚧 In Development

- Text search: endpoint exists; server-side filtering logic is being finalized
- Bulk Import (UI)
- Export Tasks (UI)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

1) Change directory and install deps
```bash
cd backend && npm install
```

2) Create `.env`
```env
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

3) Run the server
```bash
npm run dev   # development
# or
npm start     # production
```

### Frontend Setup

1) Change directory and install deps
```bash
cd frontend && npm install
```

2) Configure API base URL
```env
# Required in production; optional in dev (defaults to http://localhost:5000/api/tasks)
NEXT_PUBLIC_API_URL=http://localhost:5000/api/tasks
```

3) Run the dev server
```bash
npm run dev
```

## 🌐 Deployment Notes

- Backend: set `MONGODB_URI`, `PORT`, `ALLOWED_ORIGINS`, `NODE_ENV=production`
- Frontend: set `NEXT_PUBLIC_API_URL` to your deployed backend `/api/tasks` base URL
- Ensure CORS allowlist includes your frontend origin

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using the MERN stack
