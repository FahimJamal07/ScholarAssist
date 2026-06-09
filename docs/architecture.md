# ScholarAssist Platform Architecture

This document describes the high-level software architecture of **ScholarAssist**, detailing module responsibilities, structural boundaries, and data flows.

## 1. System Topology

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

## 2. Directory Layout & Boundaries

- **`frontend/`**: Runs as a single-page application built on React, Vite, and Tailwind CSS. Connects to backend endpoints using a centralized `api.js` client. Never contacts third-party model endpoints directly.
- **`backend/`**: Serves as the orchestration layer and API endpoint provider. Implemented in FastAPI.
  - **adapters/**: Isolates external API clients (Gemini, Claude, Chroma). Ensures change isolation.
  - **orchestrator/**: Evaluates task classifications and assigns queries to optimal providers (e.g. Gemini for summarization/QA, Claude for complex literature reviews). Handles automatic fallback parameters when outages occur.
- **`vector_store/`**: Encapsulates similarity index mapping and retrieve-and-rank queries against local/remote ChromaDB instances.
- **`database/`**: Manages the PostgreSQL relational database. Stores persistent models (users, papers, chunk relationships, reports, literature review histories).
- **`ai_services/`**: Holds prompts collections, token estimation routines, and safety validators.
