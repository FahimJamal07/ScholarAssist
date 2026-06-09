# ScholarAssist

ScholarAssist is a production-grade full-stack AI research intelligence platform designed to aid researchers in parsing, summarizing, comparing, and analyzing academic literature using multi-model orchestration, vector databases, and relational databases.

## Architecture Overview

ScholarAssist follows a scalable, modular architecture separating the frontend, backend, AI adapters, vector retriever, and relational database layers:

```
                  ┌───────────────────────┐
                  │    React Frontend     │
                  └───────────┬───────────┘
                              │ HTTP / JSON
                              ▼
                  ┌───────────────────────┐
                  │    FastAPI Backend    │
                  └───────────┬───────────┘
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
   ┌──────────────────┐┌─────────────┐┌────────────────┐
   │ AI Orchestrator  ││ PostgreSQL  ││   ChromaDB     │
   │ (Gemini/Claude)  ││ (SQLAlchemy)││ (Vector Store) │
   └──────────────────┘└─────────────┘└────────────────┘
```

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Axios + React Router + Context API / Zustand
- **Backend**: FastAPI (Python 3.11+) + SQLAlchemy + Pydantic
- **Relational DB**: PostgreSQL
- **Vector DB**: ChromaDB
- **LLM APIs**: Gemini API (for Q&A, Summarization) and Claude API (for Literature Review, Long-form Synthesis)
- **Multi-Model Orchestrator**: Routing logic to automatically choose, backup, and aggregate model responses.

## Folder Structure

The repository is organized as follows:

- `frontend/` - React SPA (Vite)
- `backend/` - FastAPI web app
- `ai_services/` - LLM orchestrator, evaluation routines, prompt templates
- `vector_store/` - ChromaDB client, document ingestion, indexing, and retrieval utilities
- `database/` - PostgreSQL DB connections, SQL schema templates, and seeds
- `docs/` - Architectural documentation, system design, API references
- `tests/` - Automated unit and integration testing suite

## Getting Started

Refer to the documents in the `docs/` folder for installation, database migrations, model configurations, and local development instructions.
