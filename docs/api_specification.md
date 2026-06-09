# ScholarAssist API Specifications

All API routes prefix with `/api`. Response objects conform to structured formats.

## 1. Response Formats

### Success Response (HTTP 200 OK)
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### Error Response (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "error": "Error details and description"
}
```

---

## 2. API Endpoints

### 2.1. Upload Paper
- **Route**: `POST /api/upload`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file`: PDF file content (under 50MB)
- **Response**:
  ```json
  {
    "success": true,
    "message": "Paper uploaded and ingested successfully.",
    "data": {
      "filename": "transformer_attention.pdf",
      "size_bytes": 2048576,
      "chunks_count": 42
    }
  }
  ```

### 2.2. RAG Chat
- **Route**: `POST /api/chat`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "message": "How does sparse attention optimize linear memory scale?",
    "paper_ids": ["transformer_attention"]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Chat response generated successfully.",
    "data": {
      "response": "Sparse attention optimizes linear memory scale by..."
    }
  }
  ```

### 2.3. Compare Papers
- **Route**: `POST /api/compare`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "paper_ids": ["attention_2017", "reformer_2020"],
    "aspects": ["methodology", "complexity"]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Comparison completed successfully.",
    "data": {
      "paper_ids": ["attention_2017", "reformer_2020"],
      "comparison_report": "..."
    }
  }
  ```

### 2.4. Literature Review Generator
- **Route**: `POST /api/literature-review`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "prompt": "Sparse attention mechanisms in NLP transformers",
    "paper_ids": ["paper_a", "paper_b"]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Literature review generated successfully.",
    "data": {
      "review": "..."
    }
  }
  ```

### 2.5. Novelty Gap Detection
- **Route**: `POST /api/novelty`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "paper_id": "transformer_attention"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Novelty detection report compiled successfully.",
    "data": {
      "paper_id": "transformer_attention",
      "novelty_score": 8.5,
      "report": "..."
    }
  }
  ```

### 2.6. Analytics
- **Route**: `GET /api/analytics`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Analytics details retrieved.",
    "data": {
      "total_papers": 124,
      "total_chunks": 45201,
      "reviews_generated": 42
    }
  }
  ```
