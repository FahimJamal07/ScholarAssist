import axios from 'axios';

/**
 * api.js - Centralized Axios instance for ScholarAssist
 *
 * Implements:
 * - Base URL and timeout configuration
 * - Request interceptor for JWT injection
 * - Response interceptor for unified error formatting
 * - Automatic retry logic for idempotent network failures
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Long timeout for AI generation tasks
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// --- Constants for Retry Logic ---
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

/**
 * Request Interceptor
 * Injects the JWT token into the Authorization header.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Initialize retry count
    if (config.retryCount === undefined) {
      config.retryCount = 0;
    }

    // Log outgoing request (useful for debugging, can be disabled in prod)
    if (import.meta.env.DEV) {
      console.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles automatic retries and standardizes error responses.
 */
api.interceptors.response.use(
  (response) => {
    // Return standard success response directly if it follows our API contract
    // The backend wraps responses in { success: true, data: ... }
    return response;
  },
  async (error) => {
    const config = error.config;

    // --- Retry Logic ---
    // Only retry if it's a network error or a retryable HTTP status, 
    // and we haven't exceeded the max retries.
    // Do NOT retry file uploads (multipart/form-data).
    const isMultipart = config?.headers?.['Content-Type'] === 'multipart/form-data';
    const isRetryableError = 
      !error.response || // Network error
      RETRYABLE_STATUS_CODES.includes(error.response.status);

    if (config && !isMultipart && isRetryableError && config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;
      console.warn(`[API Retry] Retrying request ${config.url} (Attempt ${config.retryCount} of ${MAX_RETRIES})...`);
      
      // Wait before retrying (exponential backoff could be added here)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * config.retryCount));
      
      // Retry the request
      return api(config);
    }

    // --- Error Formatting ---
    // Standardize the error response for the frontend
    let formattedError = {
      success: false,
      status: error.response?.status || 500,
      message: 'An unexpected network error occurred.',
      details: null,
    };

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Handle Unauthorized (e.g., redirect to login or clear token)
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth:unauthorized'));
        formattedError.message = 'Session expired or unauthorized. Please log in again.';
      } else if (error.response.data) {
        // Extract backend-provided error message if available
        formattedError.message = error.response.data.error || error.response.data.detail || 'API request failed.';
        formattedError.details = error.response.data;
      }
    } else if (error.request) {
      // The request was made but no response was received
      if (error.code === 'ECONNABORTED') {
        formattedError.message = 'The request timed out. Please try again.';
      } else {
        formattedError.message = 'Unable to reach the server. Please check your internet connection.';
      }
    } else {
      // Something happened in setting up the request
      formattedError.message = error.message;
    }

    if (import.meta.env.DEV) {
      console.error(`[API Error] ${config?.method?.toUpperCase()} ${config?.url}`, formattedError);
    }

    // Reject the promise with the standardized error object
    return Promise.reject(formattedError);
  }
);

export default api;
