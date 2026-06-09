import logging
from fastapi import UploadFile
from backend.adapters.vector_adapter import vector_adapter
from backend.adapters.embedding_adapter import embedding_adapter

logger = logging.getLogger("scholar_assist")

class UploadService:
    async def process_pdf(self, file: UploadFile):
        logger.info(f"Processing PDF file upload: {file.filename}")
        
        # Read file contents
        content = await file.read()
        file_size = len(content)
        
        # Check size (50MB)
        if file_size > 50 * 1024 * 1024:
            raise ValueError("File size exceeds the 50MB limit.")
            
        # Placeholder extraction logic: extract text chunks
        # In a real environment, we would use a PDF extraction library (e.g. PyPDF2, pdfplumber)
        logger.info(f"Extracted file payload size: {file_size} bytes")
        
        # Simulate chunking
        chunks = ["Mock chunk 1 extract", "Mock chunk 2 extract"]
        
        # Ingest into vector store via adapter
        for index, chunk in enumerate(chunks):
            embedding = await embedding_adapter.generate_embedding(chunk)
            await vector_adapter.insert_chunk(
                chunk_id=f"{file.filename}_chunk_{index}",
                text=chunk,
                embedding=embedding,
                metadata={"filename": file.filename, "index": index}
            )
            
        logger.info(f"Ingested {len(chunks)} chunks into vector store.")
        
        return {
            "filename": file.filename,
            "size_bytes": file_size,
            "chunks_count": len(chunks),
        }

upload_service = UploadService()
