-- DDL Schema for ScholarAssist PostgreSQL Relational DB

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);

-- Academic Papers Table
CREATE TABLE IF NOT EXISTS papers (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    authors TEXT,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);

-- Text Chunks Metadata Table (Actual vectors reside in ChromaDB)
CREATE TABLE IF NOT EXISTS chunks (
    id VARCHAR(100) PRIMARY KEY,
    paper_id VARCHAR(100) NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    text_content TEXT NOT NULL,
    index INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);

-- Literature Reviews Table
CREATE TABLE IF NOT EXISTS literature_reviews (
    id SERIAL PRIMARY KEY,
    theme VARCHAR(255) NOT NULL,
    review_content TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);

-- Novelty Reports Table
CREATE TABLE IF NOT EXISTS novelty_reports (
    id SERIAL PRIMARY KEY,
    paper_id VARCHAR(100) NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
    novelty_score DOUBLE PRECISION NOT NULL,
    report_content TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc')
);
