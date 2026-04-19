# Concious

Concious is a full-stack second-brain app for collecting useful links, organizing them in a personal dashboard, sharing a public version of your brain, and querying saved content through hybrid search and a RAG-powered chatbot.

![Concious landing page](concious_frontend/public/hero.jpeg)

## Highlights

- Password-based signup and signin
- JWT-protected dashboard
- Create, edit, delete, and list saved content
- Shareable public brain link
- Responsive landing page and dashboard experience
- Hybrid search:
  - lexical keyword matching for direct hits
  - semantic retrieval for meaning-based discovery
- RAG chatbot (`Ashqnor`) grounded on the user's saved content
- MongoDB Atlas Vector Search over stored content embeddings

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Axios, GSAP
- **Backend:** Node.js, Express 5, TypeScript, MongoDB Atlas, Mongoose, JWT, bcryptjs, Zod
- **AI / Retrieval:**
  - Hugging Face Inference API for embeddings
  - MongoDB Atlas Vector Search for semantic retrieval
  - OpenRouter for response generation
- **Architecture:** hybrid search + Retrieval-Augmented Generation (RAG)
- **Tooling:** npm workspaces, ESLint, TypeScript project builds

## AI Search And Chat

Concious now includes a retrieval layer on top of saved content:

1. A saved content item is embedded and stored with an `embedding` vector.
2. MongoDB Atlas Vector Search indexes the `embedding` field.
3. Search combines:
   - lexical matching for obvious keyword hits
   - semantic similarity for related meaning
4. Chat uses RAG:
   - embed the user question
   - retrieve relevant saved items
   - pass grounded context to the model
   - return a response with source references

This keeps normal word search useful while improving recall with semantic retrieval.

## Project Structure

```text
.
|-- concious_backend/      # Express + TypeScript API
|   |-- src/
|   |-- .env.example
|   `-- package.json
|-- concious_frontend/     # React + Vite client
|   |-- public/
|   |-- src/
|   |-- .env.example
|   `-- package.json
|-- .gitignore
|-- package.json
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- A MongoDB Atlas connection string
- A Hugging Face API token with inference provider access
- An OpenRouter API key

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
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
JWT_PASSWORD=replace-with-a-long-random-secret
HF_API_KEY=hf_xxxxxxxxxxxxxxxxx
HF_EMBEDDING_MODEL=intfloat/e5-small-v2
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=mistralai/mistral-small-3.1-24b-instruct
```

### 3. Create the MongoDB Atlas Vector Search index

Create a vector index on the `contents` collection with:

- **Index name:** `vector_idx`
- **Field:** `embedding`
- **Dimensions:** `384`
- **Similarity:** `cosine`

Atlas index definition:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    }
  ]
}
```

### 4. Configure the frontend

```bash
cd ../concious_frontend
cp .env.example .env
```

Update `concious_frontend/.env` if your backend runs somewhere else:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### 5. Run the app

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
| `POST` | `/api/v1/search` | Hybrid lexical + semantic search |
| `POST` | `/api/v1/chat` | RAG chatbot over saved content |
| `POST` | `/api/v1/reindex-embeddings` | Backfill embeddings for existing content |
| `POST` | `/api/v1/brain/share` | Create or remove a share link |
| `GET` | `/api/v1/brain/:shareLink` | Read a shared public brain |

## How Search Works

Concious does not replace normal search with semantic search. It enhances it.

- Keyword search still returns strong direct matches such as exact titles or obvious terms.
- Semantic search improves retrieval when the wording differs but the meaning is related.
- The backend merges both result sets so users keep predictable search behavior while benefiting from embeddings.

## Security Notes

- Keep real `.env` files out of Git.
- Set a strong `JWT_PASSWORD` in every deployed environment.
- Do not commit MongoDB usernames, passwords, or connection strings.
- Rotate Hugging Face and OpenRouter keys if they are ever exposed.
