import { logger } from './pinojs.mjs';


export const logError = (message, error, additionalInfo = 'N/A') => {
  logger.error({
    message: message,
    context: {
      name: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      additionalInfo: additionalInfo,
    },
  });
};