# Concious

Concious is a full-stack second-brain app for collecting useful links, organizing them in a personal dashboard, and sharing a public version of your brain with one generated link.

![Concious landing page](concious_frontend/public/hero.jpeg)

## Highlights

- Password-based signup and signin
- JWT-protected dashboard
- Create, edit, delete, and list saved content
- Shareable public brain link
- Responsive React landing page with animated visual sections
- Express API with MongoDB persistence

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Axios, GSAP
- **Backend:** Node.js, Express 5, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, Zod
- **Tooling:** npm workspaces, ESLint, TypeScript project builds

## Project Structure

```text
.
├── concious_backend/      # Express + TypeScript API
│   ├── src/
│   ├── .env.example
│   └── package.json
├── concious_frontend/     # React + Vite client
│   ├── public/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A MongoDB connection string

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend

```bash
cd concious_backend
cp .env.example .env
```

Update `concious_backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/concious
JWT_PASSWORD=replace-with-a-long-random-secret
```

### 3. Configure the frontend

```bash
cd ../concious_frontend
cp .env.example .env
```

Update `concious_frontend/.env` if your backend runs somewhere else:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### 4. Run the app

Open two terminals:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

The frontend will run through Vite. The backend listens on the `PORT` from `concious_backend/.env`.

## Available Scripts

From the repository root:

```bash
npm run dev:backend
npm run dev:frontend
npm run build
npm run build:backend
npm run build:frontend
npm run lint:frontend
```

## API Overview

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/signup` | Create an account |
| `POST` | `/api/v1/signin` | Sign in and receive a JWT |
| `GET` | `/api/v1/content` | List authenticated user's content |
| `POST` | `/api/v1/content` | Add content |
| `PATCH` | `/api/v1/content/:id` | Rename content |
| `DELETE` | `/api/v1/content/:id` | Delete content |
| `POST` | `/api/v1/brain/share` | Create or remove a share link |
| `GET` | `/api/v1/brain/:shareLink` | Read a shared public brain |

## Security Notes

- Keep real `.env` files out of Git.
- Set a strong `JWT_PASSWORD` in every deployed environment.
- Do not commit MongoDB usernames, passwords, or connection strings.
