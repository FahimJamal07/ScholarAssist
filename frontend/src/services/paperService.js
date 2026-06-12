import api from './api';

export const paperService = {
  /**
   * Uploads a PDF file to the backend for processing.
   *
   * @param {File} file - The PDF file to upload
   * @param {object} options - Optional upload configuration
   * @param {Function} options.onUploadProgress - Axios progress callback
   * @param {AbortSignal} options.signal - AbortController signal for cancellation
   * @returns {Promise<object>} API response
   */
  uploadPaper: async (file, { onUploadProgress, signal } = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
      signal,
    });
    return response.data;
  },
  comparePapers: async (paperIds) => {
    const response = await api.post('/compare', { paper_ids: paperIds });
    return response.data;
  },
  generateLiteratureReview: async (prompt, paperIds) => {
    const response = await api.post('/literature-review', { prompt, paper_ids: paperIds });
    return response.data;
  },
  detectNovelty: async (paperId) => {
    const response = await api.post('/novelty', { paper_id: paperId });
    return response.data;
  },
  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
};
