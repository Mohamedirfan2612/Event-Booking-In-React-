// Environment configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001/api',
    APP_NAME: 'EventBooker Dev',
    ENABLE_MOCK_DATA: true,
    DEBUG_MODE: true,
    PAYMENT_GATEWAY: 'sandbox',
    MAX_SEATS_PER_BOOKING: 8,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    FEATURES: {
      REAL_TIME_UPDATES: true,
      ADVANCED_SEARCH: true,
      ADMIN_PANEL: true,
      ANALYTICS: false
    }
  },
  
  production: {
    API_BASE_URL: 'https://api.eventbooker.com',
    APP_NAME: 'EventBooker',
    ENABLE_MOCK_DATA: false,
    DEBUG_MODE: false,
    PAYMENT_GATEWAY: 'live',
    MAX_SEATS_PER_BOOKING: 6,
    SESSION_TIMEOUT: 20 * 60 * 1000, // 20 minutes
    CACHE_DURATION: 10 * 60 * 1000, // 10 minutes
    FEATURES: {
      REAL_TIME_UPDATES: true,
      ADVANCED_SEARCH: true,
      ADMIN_PANEL: false,
      ANALYTICS: true
    }
  },
  
  test: {
    API_BASE_URL: 'http://localhost:3002/api',
    APP_NAME: 'EventBooker Test',
    ENABLE_MOCK_DATA: true,
    DEBUG_MODE: true,
    PAYMENT_GATEWAY: 'test',
    MAX_SEATS_PER_BOOKING: 10,
    SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour
    CACHE_DURATION: 1 * 60 * 1000, // 1 minute
    FEATURES: {
      REAL_TIME_UPDATES: false,
      ADVANCED_SEARCH: true,
      ADMIN_PANEL: true,
      ANALYTICS: false
    }
  }
};

// Get current environment
const getEnvironment = () => {
  return import.meta.env.MODE || 'development';
};

// Get configuration for current environment
const getConfig = () => {
  const env = getEnvironment();
  return {
    ...config[env],
    ENVIRONMENT: env,
    VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
    BUILD_TIME: import.meta.env.VITE_BUILD_TIME || new Date().toISOString()
  };
};

// Export configuration
export const ENV_CONFIG = getConfig();

// Helper functions
export const isProduction = () => getEnvironment() === 'production';
export const isDevelopment = () => getEnvironment() === 'development';
export const isTest = () => getEnvironment() === 'test';

// Feature flags
export const isFeatureEnabled = (featureName) => {
  return ENV_CONFIG.FEATURES[featureName] || false;
};

// API helpers
export const getApiUrl = (endpoint) => {
  return `${ENV_CONFIG.API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};

// Debug logging
export const debugLog = (...args) => {
  if (ENV_CONFIG.DEBUG_MODE) {
    console.log('[EventBooker Debug]:', ...args);
  }
};

export default ENV_CONFIG;