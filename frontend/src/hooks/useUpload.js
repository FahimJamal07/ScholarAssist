import { useState, useCallback, useRef } from 'react';
import { paperService } from '../services/paperService.js';
import { MAX_FILE_SIZE } from '../utils/constants.js';

/**
 * Upload status enum — tracks individual file lifecycle.
 */
export const UPLOAD_STATUS = {
  PENDING: 'pending',
  VALIDATING: 'validating',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

/**
 * Validates a file for PDF-only, max 50MB, and MIME type.
 * Returns null if valid, error string if invalid.
 *
 * @param {File} file - File to validate
 * @returns {string|null} Error message or null
 */
function validateFile(file) {
  if (!file) return 'No file selected.';

  // Extension check
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension !== 'pdf') {
    return `Invalid file type ".${extension}". Only PDF files are allowed.`;
  }

  // MIME type check
  if (file.type && file.type !== 'application/pdf') {
    return `Invalid MIME type "${file.type}". Only application/pdf is accepted.`;
  }

  // Size check
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `File size (${sizeMB} MB) exceeds the 50 MB limit.`;
  }

  // Filename sanitization check
  if (file.name.length > 255) {
    return 'Filename is too long (max 255 characters).';
  }

  return null;
}

/**
 * Creates a file entry object for the upload queue.
 *
 * @param {File} file - Raw File object
 * @param {string|null} error - Validation error if any
 * @returns {object} Upload queue entry
 */
function createFileEntry(file, error = null) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file,
    name: file.name,
    size: file.size,
    status: error ? UPLOAD_STATUS.FAILED : UPLOAD_STATUS.PENDING,
    progress: 0,
    error,
    result: null,
    addedAt: Date.now(),
  };
}

/**
 * useUpload — Comprehensive upload hook with multi-file queue, per-file
 * progress tracking, validation, retry, and batch operations.
 *
 * Features:
 * - Multi-file drag-and-drop queuing
 * - Per-file validation (PDF only, 50MB max, MIME type)
 * - Real-time upload progress via Axios onUploadProgress
 * - Retry failed uploads
 * - Remove individual files from queue
 * - Clear completed uploads
 * - Duplicate file detection
 */
export function useUpload() {
  const [queue, setQueue] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const abortControllerRef = useRef(null);

  /**
   * Updates a single entry in the queue by ID.
   */
  const updateEntry = useCallback((id, updates) => {
    setQueue((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  }, []);

  /**
   * Adds files to the upload queue after validation.
   * Skips duplicate filenames already in the queue.
   *
   * @param {FileList|File[]} files - Files to add
   */
  const addFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const entries = [];

    setQueue((prev) => {
      const existingNames = new Set(
        prev
          .filter((e) => e.status !== UPLOAD_STATUS.FAILED)
          .map((e) => e.name)
      );

      for (const file of fileArray) {
        if (existingNames.has(file.name)) {
          continue; // Skip duplicate
        }
        const error = validateFile(file);
        entries.push(createFileEntry(file, error));
        existingNames.add(file.name);
      }

      return [...prev, ...entries];
    });
  }, []);

  /**
   * Uploads a single file entry with progress tracking.
   *
   * @param {object} entry - Queue entry to upload
   */
  const uploadSingleFile = useCallback(async (entry) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    updateEntry(entry.id, {
      status: UPLOAD_STATUS.VALIDATING,
      progress: 0,
      error: null,
    });

    // Re-validate before upload
    const validationError = validateFile(entry.file);
    if (validationError) {
      updateEntry(entry.id, {
        status: UPLOAD_STATUS.FAILED,
        error: validationError,
      });
      return false;
    }

    updateEntry(entry.id, { status: UPLOAD_STATUS.UPLOADING });

    try {
      const result = await paperService.uploadPaper(entry.file, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;

          // Cap at 90% — final 10% is server-side processing
          const displayProgress = Math.min(percentCompleted, 90);
          updateEntry(entry.id, { progress: displayProgress });
        },
        signal: controller.signal,
      });

      if (result.success) {
        updateEntry(entry.id, {
          status: UPLOAD_STATUS.COMPLETED,
          progress: 100,
          result: result.data,
        });
        return true;
      } else {
        updateEntry(entry.id, {
          status: UPLOAD_STATUS.FAILED,
          error: result.error || 'Upload failed. Please try again.',
        });
        return false;
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        updateEntry(entry.id, {
          status: UPLOAD_STATUS.FAILED,
          progress: 0,
          error: 'Upload cancelled.',
        });
        return false;
      }

      const message =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        'An unexpected error occurred during upload.';

      updateEntry(entry.id, {
        status: UPLOAD_STATUS.FAILED,
        error: message,
      });
      return false;
    }
  }, [updateEntry]);

  /**
   * Processes all pending files in the queue sequentially.
   */
  const uploadAll = useCallback(async () => {
    setIsUploading(true);

    const pending = queue.filter((e) => e.status === UPLOAD_STATUS.PENDING);
    for (const entry of pending) {
      await uploadSingleFile(entry);
    }

    setIsUploading(false);
  }, [queue, uploadSingleFile]);

  /**
   * Retries a failed upload by resetting its status and re-uploading.
   *
   * @param {string} id - Queue entry ID
   */
  const retryUpload = useCallback(async (id) => {
    const entry = queue.find((e) => e.id === id);
    if (!entry) return;

    setIsUploading(true);
    updateEntry(id, {
      status: UPLOAD_STATUS.PENDING,
      progress: 0,
      error: null,
    });

    // Need to get the updated entry for upload
    await uploadSingleFile(entry);
    setIsUploading(false);
  }, [queue, uploadSingleFile, updateEntry]);

  /**
   * Removes a single file from the queue.
   */
  const removeFile = useCallback((id) => {
    setQueue((prev) => prev.filter((e) => e.id !== id));
  }, []);

  /**
   * Clears all completed uploads from the queue.
   */
  const clearCompleted = useCallback(() => {
    setQueue((prev) => prev.filter((e) => e.status !== UPLOAD_STATUS.COMPLETED));
  }, []);

  /**
   * Clears the entire queue.
   */
  const clearAll = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setQueue([]);
    setIsUploading(false);
  }, []);

  /**
   * Cancels the currently uploading file.
   */
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Computed stats
  const stats = {
    total: queue.length,
    pending: queue.filter((e) => e.status === UPLOAD_STATUS.PENDING).length,
    uploading: queue.filter(
      (e) => e.status === UPLOAD_STATUS.UPLOADING || e.status === UPLOAD_STATUS.VALIDATING
    ).length,
    completed: queue.filter((e) => e.status === UPLOAD_STATUS.COMPLETED).length,
    failed: queue.filter((e) => e.status === UPLOAD_STATUS.FAILED).length,
    totalSize: queue.reduce((sum, e) => sum + e.size, 0),
  };

  return {
    queue,
    stats,
    isUploading,
    addFiles,
    uploadAll,
    retryUpload,
    removeFile,
    clearCompleted,
    clearAll,
    cancelUpload,
  };
}
