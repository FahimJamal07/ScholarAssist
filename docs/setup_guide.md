# ScholarAssist Setup Guide

This document describes how to install and launch the frontend and backend applications locally.

## 1. Prerequisites
- Python 3.11+
- Node.js v18+ & npm
- PostgreSQL running locally or in Docker

---

## 2. Backend Setup

1. **Create Virtual Environment**:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install Packages**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Keys**:
   Copy `.env` variables and insert active keys (e.g. `GEMINI_API_KEY`, `CLAUDE_API_KEY`, `DATABASE_URL`).

4. **Initialize PostgreSQL Schema**:
   Run schemas against PostgreSQL database:
   ```bash
   psql -U postgres -d scholar_assist -f ../database/schema.sql
   ```

5. **Seed Database (Optional)**:
   ```bash
   python -m database.seed
   ```

6. **Start FastAPI Application**:
   ```bash
   python main.py
   ```
   The backend API will listen on [http://localhost:8000](http://localhost:8000).

---

## 3. Frontend Setup

1. **Install Packages**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   The Vite web dashboard will run on [http://localhost:3000](http://localhost:3000).

---

## 4. Testing Suite
Execute pytest integration matches:
```bash
pytest
```
