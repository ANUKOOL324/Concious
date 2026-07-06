---
tags:
  - conscious
  - interview-prep
  - moc
aliases:
  - Interview Prep
  - Conscious Docs
---

# Conscious — Interview Prep

Map of content for understanding the **Conscious** codebase (Second Brain + RAG search + Ashqnor chat).

## Parts

| # | Doc | Status |
|---|-----|--------|
| 1 | [[01 - Backend Folder Structure]] | done |
| 2 | [[02 - RAG Architecture Overview]] | done |
| 3 | [[03 - Save and Index Pipeline]] | done |
| 4 | [[04 - Search Pipeline]] | planned |
| 5 | [[05 - Chat Pipeline]] | planned |

## Suggested reading order

1. [[01 - Backend Folder Structure]] — where everything lives
2. [[02 - RAG Architecture Overview]] — routes + flows + **code checkpoints (open files as you read)**
3. [[03 - Save and Index Pipeline]] — deep dive on `09_indexer.ts`
4. [[04 - Search Pipeline]] — hybrid retrieval + RRF
5. [[05 - Chat Pipeline]] — intent routing + grounding + LLM

## Quick reference

### API base
- All routes: `/api/v1`
- Entry: `concious_backend/src/app.ts` → `routes/index.ts`

### Core collections (MongoDB)
- `contents` — saved items
- `sourceartifacts` — raw extracted text
- `okfconcepts` — structured knowledge docs
- `contentchunks` — embedded RAG search units

### Key services
- `services/content.service.ts` — save + trigger indexing
- `services/search.service.ts` — hybrid search
- `services/chat.service.ts` — Ashqnor chatbot

### RAG folder (numbered pipeline)
- `rag/01_platform.ts` … `rag/13_confidence.ts`
- Barrel export: `rag/index.ts`

## Interview one-liner

> Express + TypeScript API with layered routes → controllers → services. On save, content is stored immediately and RAG indexing runs in the background (artifacts → OKF → chunks → HuggingFace embeddings). Search and chat both use hybrid chunk retrieval; chat adds reranking, confidence gating, and OpenRouter for grounded answers.

## Tags

- `#conscious/backend` — server structure
- `#conscious/rag` — indexing + retrieval
- `#conscious/search` — semantic search
- `#conscious/chat` — Ashqnor
