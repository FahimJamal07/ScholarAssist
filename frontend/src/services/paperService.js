import api from './api';

/**
 * paperService.js - Centralized API calls for research papers and AI analysis
 * 
 * Follows Rule 14: Centralized API service, no direct fetch calls in components.
 */
export const paperService = {
  /**
   * Uploads a PDF file to the backend for processing.
   *
   * @param {File} file - The PDF file to upload
   * @param {object} options - Optional upload configuration
   * @param {Function} options.onUploadProgress - Axios progress callback
   * @param {AbortSignal} options.signal - AbortController signal for cancellation
   * @returns {Promise<object>} API response { success, data, message }
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

  /**
   * Compare multiple papers against specific aspects.
   * 
   * @param {Array<string>} paperIds - List of paper IDs to compare
   * @param {Array<string>} [aspects=[]] - Specific aspects to compare (optional)
   * @returns {Promise<object>} API response { success, data: { comparison } }
   */
  comparePapers: async (paperIds, aspects = []) => {
    const response = await api.post('/compare', { 
      paper_ids: paperIds,
      aspects: aspects
    });
    return response.data;
  },

  /**
   * Generate a long-form literature review across papers.
   * 
   * @param {string} prompt - The thematic prompt for synthesis
   * @param {Array<string>} [paperIds=[]] - Specific papers to review (empty = all)
   * @returns {Promise<object>} API response { success, data: { review } }
   */
  generateLiteratureReview: async (prompt, paperIds = []) => {
    const response = await api.post('/literature-review', { 
      prompt, 
      paper_ids: paperIds 
    });
    return response.data;
  },

  /**
   * Detect novelty and research gaps for a specific paper/abstract.
   * 
   * @param {string} paperId - Target paper identifier or abstract content
   * @returns {Promise<object>} API response { success, data: { novelty_score, summary... } }
   */
  detectNovelty: async (paperId) => {
    const response = await api.post('/novelty', { paper_id: paperId });
    return response.data;
  },

  /**
   * Send a chat message for RAG-based QA against uploaded papers.
   * 
   * @param {string} message - User query
   * @param {Array<string>} [paperIds=[]] - Optional list of paper IDs to filter context
   * @param {AbortSignal} [signal] - AbortController signal for cancellation
   * @returns {Promise<object>} API response { success, data: { response, citations } }
   */
  chat: async (message, paperIds = [], signal) => {
    const response = await api.post('/chat', {
      message,
      paper_ids: paperIds
    }, { signal });
    return response.data;
  },

  /**
   * Fetch citation analytics and dashboard metrics.
   * 
   * @returns {Promise<object>} API response { success, data: { metrics } }
   */
  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
  
  /**
   * Fetch user's uploaded documents (dashboard list).
   * Note: Assumes a hypothetical /documents or /papers endpoint.
   * 
   * @returns {Promise<object>} API response
   */
  getDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  }
};
