import { useState } from 'react';
import { paperService } from '../services/paperService';

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const uploadFile = async (file) => {
    // Validate size (50MB) and type (PDF only)
    if (file.type !== 'application/pdf') {
      setError('Only PDF documents are allowed.');
      return false;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('Maximum file size is 50MB.');
      return false;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await paperService.uploadPaper(file);
      if (result.success) {
        setSuccess(true);
        return true;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error, success };
}
