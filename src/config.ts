// Configuration file for RealPix application
// Contains environment-specific settings

// API URL - uses environment variable in production, fallback for development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Export configuration object
export default {
  API_URL,
  APP_NAME: 'RealPix',
  MAX_PROMPT_LENGTH: 1000,
  DEFAULT_IMAGE_SIZE: '1024x1024'
};