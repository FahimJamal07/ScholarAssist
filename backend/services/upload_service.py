import os
import uuid
import logging
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from typing import Dict, Any

from backend.adapters.vector_adapter import vector_adapter
from backend.adapters.embedding_adapter import embedding_adapter

logger = logging.getLogger("scholar_assist")

class UploadService:
    def __init__(self):
        self.MAX_FILE_SIZE_MB = 50
        self.MAX_FILE_SIZE_BYTES = self.MAX_FILE_SIZE_MB * 1024 * 1024
        self.ALLOWED_MIME_TYPES = ["application/pdf"]
        self.ALLOWED_EXTENSIONS = [".pdf"]
        
        self.UPLOAD_DIR = Path("uploads/pdfs")
        self.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    async def validate_pdf(self, file: UploadFile) -> None:
        """Validates the uploaded file for format, MIME type, and size."""
        # 1. Validate Extension
        file_ext = Path(file.filename).suffix.lower() if file.filename else ""
        if file_ext not in self.ALLOWED_EXTENSIONS:
            logger.error(f"Invalid file extension: {file_ext}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file type. Only PDF files are allowed."
            )

        # 2. Validate MIME Type
        if file.content_type not in self.ALLOWED_MIME_TYPES:
            logger.error(f"Invalid MIME type: {file.content_type}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file format. Only PDF files are allowed."
            )

        # 3. Validate File Size
        file.file.seek(0, os.SEEK_END)
        file_size = file.file.tell()
        file.file.seek(0)  # Reset cursor for reading

        if file_size > self.MAX_FILE_SIZE_BYTES:
            logger.error(f"File size exceeds limit: {file_size} bytes")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File is too large. Maximum size allowed is {self.MAX_FILE_SIZE_MB}MB."
            )

    def generate_secure_filename(self, original_filename: str) -> str:
        """Generates a secure, unique filename to prevent collisions and path traversal."""
        file_ext = Path(original_filename).suffix.lower() if original_filename else ".pdf"
        secure_name = f"{uuid.uuid4().hex}{file_ext}"
        return secure_name

    async def extract_metadata_hook(self, filepath: Path) -> Dict[str, Any]:
        """Hook for extracting metadata from the uploaded PDF."""
        try:
            logger.info(f"Extracting metadata for {filepath.name}...")
            # Placeholder for metadata extraction logic
            metadata = {
                "title": "Unknown Title",
                "author": "Unknown Author",
                "pages": 1,
                "file_size": filepath.stat().st_size
            }
            return metadata
        except Exception as e:
            logger.error(f"Failed to extract metadata: {str(e)}")
            return {}

    async def process_pdf(self, file: UploadFile) -> Dict[str, Any]:
        """Main service method to handle the secure PDF upload process."""
        try:
            logger.info(f"Starting upload process for file: {file.filename}")
            
            # 1. Validation
            await self.validate_pdf(file)

            # 2. Secure Naming
            secure_filename = self.generate_secure_filename(file.filename)
            file_path = self.UPLOAD_DIR / secure_filename

            # 3. Async File Saving
            try:
                content = await file.read()
                with open(file_path, "wb") as f:
                    f.write(content)
                logger.info(f"File securely saved at {file_path}")
            except Exception as io_err:
                logger.error(f"Failed to save file {secure_filename}: {str(io_err)}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="An error occurred while saving the file."
                )
                
            file_size = len(content)

            # 4. Metadata Extraction
            metadata = await self.extract_metadata_hook(file_path)

            # 5. Ingest into vector store via adapter
            chunks = ["Mock chunk 1 extract", "Mock chunk 2 extract"]
            for index, chunk in enumerate(chunks):
                embedding = await embedding_adapter.generate_embedding(chunk)
                await vector_adapter.insert_chunk(
                    chunk_id=f"{secure_filename}_chunk_{index}",
                    text=chunk,
                    embedding=embedding,
                    metadata={"filename": file.filename, "secure_filename": secure_filename, "index": index}
                )
                
            logger.info(f"Ingested {len(chunks)} chunks into vector store.")

            return {
                "success": True,
                "message": "File uploaded successfully.",
                "data": {
                    "original_filename": file.filename,
                    "saved_filename": secure_filename,
                    "path": str(file_path),
                    "size_bytes": file_size,
                    "chunks_count": len(chunks),
                    "metadata": metadata
                }
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Unexpected error during file upload: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred during file processing."
            )

upload_service = UploadService()
