import api from './api';

/**
 * authService.js - Centralized authentication API calls
 */
export const authService = {
  /**
   * Log in a user with email and password
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} API response
   */
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      // Dispatch event to update app state if needed
      window.dispatchEvent(new Event('auth:login'));
    }
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} userData - { email, password, name }
   * @returns {Promise<Object>} API response
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Log out the current user
   */
  logout: () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth:logout'));
  },

  /**
   * Check if user is currently authenticated locally
   * @returns {boolean} True if token exists
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get current auth token
   * @returns {string|null} JWT token
   */
  getToken: () => {
    return localStorage.getItem('token');
  }
};
