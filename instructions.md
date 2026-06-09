## Backend + Frontend + Cloud + AI Orchestration Instructions

---

# 1. ROLE OVERVIEW

You are responsible for:

- FastAPI backend development
- React frontend development
- AI orchestration layer
- API integrations
- Database integration
- Authentication
- Cloud integration
- Frontend ↔ Backend communication
- Deployment preparation

You are NOT responsible for:

- local embedding generation
- GPU-heavy model inference
- vector embedding model creation

These are handled by Member A.

---

# 2. PRIMARY OBJECTIVES

Your goals:

1. Build scalable FastAPI backend
2. Build modern React frontend
3. Integrate Gemini + Claude APIs
4. Create orchestration layer
5. Connect vector retrieval services
6. Implement production-style architecture
7. Maintain modular codebase
8. Prepare cloud-ready project structure

---

# 3. TECH STACK (STRICTLY FOLLOW)

# Backend

- FastAPI
- Python 3.11+

# Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

# Database

- PostgreSQL

# AI APIs

- Gemini API
- Claude API

# Authentication

- JWT Authentication

# Cloud

- Google Cloud Platform (preferred)

# ORM

- SQLAlchemy

# Validation

- Pydantic

# Async HTTP

- httpx

---

# 4. FRONTEND TECH STACK RULES

STRICTLY USE:

## Required

- React + Vite
- Tailwind CSS
- Axios
- React Router DOM

## Recommended

- React Query / TanStack Query
- Framer Motion
- Recharts

DO NOT USE:

- Bootstrap
- jQuery
- inline CSS everywhere
- unstructured component architecture

---

# 5. PROJECT ARCHITECTURE

Follow THIS structure strictly.

```text id="m31v2r"
frontend/
backend/
ai_services/
database/
vector_store/
```

---

# 6. FRONTEND FILE STRUCTURE

STRICTLY FOLLOW:

```text id="fs9d4f"
frontend/
│
├── public/
│
├── src/
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Upload.jsx
│   │   ├── Chat.jsx
│   │   ├── Compare.jsx
│   │   ├── LiteratureReview.jsx
│   │   ├── Novelty.jsx
│   │   └── Analytics.jsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── chat/
│   │   ├── upload/
│   │   ├── analytics/
│   │   ├── cards/
│   │   └── ui/
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── paperService.js
│   │
│   ├── hooks/
│   │   ├── useChat.js
│   │   ├── useUpload.js
│   │   └── useAnalytics.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ChatContext.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

# 7. BACKEND FILE STRUCTURE

STRICTLY FOLLOW:

```text id="3c2kh4"
backend/
│
├── main.py
│
├── config/
│   ├── settings.py
│   ├── database.py
│   └── logging_config.py
│
├── api/
│   ├── routes/
│   │   ├── upload_routes.py
│   │   ├── chat_routes.py
│   │   ├── comparison_routes.py
│   │   ├── literature_routes.py
│   │   ├── novelty_routes.py
│   │   └── analytics_routes.py
│   │
│   └── middleware/
│       ├── auth_middleware.py
│       ├── request_logger.py
│       └── rate_limiter.py
│
├── services/
│   ├── upload_service.py
│   ├── chat_service.py
│   ├── comparison_service.py
│   ├── literature_service.py
│   └── novelty_service.py
│
├── orchestrator/
│   ├── task_router.py
│   ├── model_selector.py
│   ├── response_aggregator.py
│   └── fallback_handler.py
│
├── adapters/
│   ├── gemini_adapter.py
│   ├── claude_adapter.py
│   ├── vector_adapter.py
│   └── embedding_adapter.py
│
├── models/
│   ├── request_models.py
│   ├── response_models.py
│   └── database_models.py
│
├── utils/
│   ├── helpers.py
│   ├── validators.py
│   └── security.py
│
├── requirements.txt
└── .env
```

---

# 8. STRICT ENGINEERING RULES

## RULE 1 — MODULAR ARCHITECTURE ONLY

DO NOT:

- create giant files
- mix UI logic with API logic
- write monolithic code

ALWAYS:

- separate components
- separate services
- separate adapters
- separate routes

---

## RULE 2 — COMPONENT REUSABILITY

ALL UI components MUST be reusable.

Examples:

- Button
- Modal
- Sidebar
- Card
- Loader

DO NOT duplicate UI logic.

---

## RULE 3 — NO HARDCODED VALUES

NEVER hardcode:

- API URLs
- keys
- ports
- credentials

Use:

```env id="fy7m7r"
VITE_API_BASE_URL=
GEMINI_API_KEY=
CLAUDE_API_KEY=
DATABASE_URL=
JWT_SECRET=
```

---

## RULE 4 — ADAPTER PATTERN IS MANDATORY

Every AI provider MUST have:

- its own adapter
- isolated implementation

DO NOT directly call APIs inside routes.

---

# 9. API DESIGN REQUIREMENTS

Required APIs:

## Upload

```text id="nzb1o9"
POST /upload
```

## Chat

```text id="1ezd4f"
POST /chat
```

## Compare Papers

```text id="l7k8nq"
POST /compare
```

## Literature Review

```text id="3i3r0x"
POST /literature-review
```

## Novelty Detection

```text id="0h7mn4"
POST /novelty
```

## Analytics

```text id="kzjuy3"
GET /analytics
```

---

# 10. RESPONSE FORMAT STANDARD

ALL APIs MUST return:

```json id="92b9o8"
{
  "success": true,
  "message": "",
  "data": {}
}
```

Errors:

```json id="zjlwmn"
{
  "success": false,
  "error": ""
}
```

---

# 11. FRONTEND REQUIREMENTS

Frontend MUST include:

## Pages

- Dashboard
- Upload Papers
- Chat with Papers
- Compare Papers
- Literature Review
- Novelty Detection
- Citation Analytics

---

# 12. UI REQUIREMENTS

Design must feel:

- modern
- clean
- AI SaaS style
- professional

Use:

- cards
- clean typography
- spacing consistency
- loading animations
- skeleton loaders

DO NOT:

- clutter pages
- use random colors
- create inconsistent layouts

---

# 13. STATE MANAGEMENT RULES

Use:

- React Context
  OR
- Zustand

DO NOT:

- prop drill excessively
- store everything in local state

---

# 14. API COMMUNICATION RULES

Use:

```javascript id="lix8yk"
axios.create();
```

Create centralized API service.

DO NOT:

- scatter fetch calls everywhere

---

# 15. ASYNC RULES

ALL:

- API calls
- backend routes
- DB operations

must be async where possible.

---

# 16. GEMINI INTEGRATION RULES

Gemini handles:

- summarization
- QA
- explanations

Gemini should NOT:

- perform retrieval
- manage orchestration
- perform vector search

---

# 17. CLAUDE INTEGRATION RULES

Claude handles:

- literature review generation
- long-form synthesis
- comparative analysis

---

# 18. RAG FLOW RULES

MANDATORY FLOW:

```text id="7tbqdo"
User Query
    ↓
Vector Retrieval
    ↓
Context Building
    ↓
LLM Generation
```

DO NOT:

- directly send PDFs to LLM
- bypass retrieval pipeline

---

# 19. SECURITY RULES

Required:

- JWT authentication
- input validation
- upload validation
- request sanitization
- rate limiting

---

# 20. FILE UPLOAD RULES

Allowed:

- PDF only

Validate:

- MIME type
- extension
- file size

Maximum:

- 50MB

---

# 21. LOGGING RULES

Use logging everywhere.

Log:

- API failures
- AI failures
- orchestration routing
- upload failures
- DB failures

---

# 22. ERROR HANDLING RULES

Required:

- try/except everywhere
- graceful UI fallbacks
- proper status codes
- readable error messages

---

# 23. DATABASE RULES

Use PostgreSQL.

Required tables:

- papers
- chunks
- users
- literature_reviews
- novelty_reports

DO NOT store embeddings in PostgreSQL.

---

# 24. FRONTEND ↔ BACKEND FLOW

```text id="d73o2m"
React Frontend
      ↓
FastAPI Backend
      ↓
Orchestrator
      ↓
AI Services
      ↓
Response
```

Frontend MUST NEVER directly call AI APIs.

---

# 25. CODE QUALITY RULES

Required:

- reusable functions
- type hints
- docstrings
- proper naming
- modular components

DO NOT:

- duplicate logic
- create massive functions
- use vague variable names

---

# 26. GIT RULES

Branch naming:

```text id="8xpf75"
feature/frontend-ui
feature/backend-api
feature/orchestrator
```

Commit naming:

```text id="iz20ku"
feat: added literature review API
fix: resolved upload validation bug
```

---

# 27. TESTING RULES

Required:

- API testing
- frontend testing
- integration testing

Use:

- pytest
- React Testing Library

---

# 28. PERFORMANCE RULES

Optimize:

- frontend rendering
- API latency
- retrieval speed

Avoid:

- unnecessary re-renders
- duplicate API calls
- huge payload transfers

---

# 29. ABSOLUTE DO NOTS

DO NOT:

- write monolithic code
- directly call AI APIs from frontend
- hardcode secrets
- skip validation
- skip logging
- tightly couple modules

---

# 30. FINAL PROJECT GOAL

The system should feel like:

- enterprise AI software
- modern SaaS platform
- modular multi-LLM system

NOT:

- a basic chatbot
- a college mini-project
- a single-file application

---

# 31. FINAL DELIVERABLE EXPECTATIONS

The system MUST support:

- paper uploads
- semantic search
- RAG QA
- literature review generation
- novelty analysis
- multi-model orchestration
- clean frontend dashboard
- cloud-ready architecture

---

# 32. DEVELOPMENT ORDER

## Phase 1

- React setup
- FastAPI setup
- upload API

## Phase 2

- frontend pages
- API integration

## Phase 3

- Gemini integration
- chatbot

## Phase 4

- literature review
- novelty detection

## Phase 5

- orchestration layer
- optimization
- deployment preparation

---

# 33. IMPORTANT FINAL NOTE

Every engineering decision should prioritize:

- scalability
- modularity
- maintainability
- readability
- production-style architecture

The final codebase should feel:
like a real startup product.
