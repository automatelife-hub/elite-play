/**
 * Centralized logger utility for the application.
 * This wrapper allows for consistent logging across the app and provides
 * a single point of integration for future error tracking services (e.g., Sentry).
 */

const logger = {
  /**
   * Log information messages (only in development)
   */
  info: (message, ...args) => {
    if (import.meta.env.DEV) {
      console.log(`%c[INFO] %c${message}`, 'color: #3b82f6; font-weight: bold;', 'color: inherit;', ...args);
    }
  },

  /**
   * Log warning messages
   */
  warn: (message, ...args) => {
    console.warn(`%c[WARN] %c${message}`, 'color: #f59e0b; font-weight: bold;', 'color: inherit;', ...args);
  },

  /**
   * Log error messages
   */
  error: (message, ...args) => {
    console.error(`%c[ERROR] %c${message}`, 'color: #ef4444; font-weight: bold;', 'color: inherit;', ...args);

    // Future: Integration with error tracking services like Sentry or LogRocket
    // if (import.meta.env.PROD) {
    //   Sentry.captureException(args[0] instanceof Error ? args[0] : new Error(message));
    // }
  }
};

export default logger;
