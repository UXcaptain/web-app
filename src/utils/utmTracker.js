/**
 * UTM Parameter Tracking Utility
 * 
 * Captures and stores UTM parameters from URL query strings in localStorage.
 * Preserves original values on subsequent visits if they already exist.
 */

const UTM_STORAGE_KEY = 'utm_parameters';

/**
 * List of UTM and tracking parameters to capture
 */
const UTM_PARAMETERS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid'
];

/**
 * Extract UTM parameters from URL query string
 * @param {URLSearchParams} searchParams - URL search params object
 * @returns {Object} Object containing found UTM parameters
 */
function extractUTMParameters(searchParams) {
  const utmParams = {};
  
  UTM_PARAMETERS.forEach(param => {
    const value = searchParams.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });
  
  return utmParams;
}

/**
 * Get stored UTM parameters from localStorage
 * @returns {Object|null} Stored UTM parameters or null if none exist
 */
function getStoredUTMParameters() {
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading UTM parameters from localStorage:', error);
    return null;
  }
}

/**
 * Store UTM parameters in localStorage
 * @param {Object} utmParams - UTM parameters to store
 */
function storeUTMParameters(utmParams) {
  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
  } catch (error) {
    console.error('Error storing UTM parameters to localStorage:', error);
  }
}

/**
 * Initialize UTM tracking
 * - Extracts UTM parameters from current URL
 * - Checks localStorage for existing values
 * - Stores new values only if none exist
 * 
 * Call this function once on app initialization
 */
export function initUTMTracking() {
  // Get URL search parameters
  const searchParams = new URLSearchParams(window.location.search);
  
  // Extract UTM parameters from URL
  const currentUTMParams = extractUTMParameters(searchParams);
  
  // Only proceed if we have UTM parameters in the URL
  if (Object.keys(currentUTMParams).length === 0) {
    return;
  }
  
  // Check if we already have stored UTM parameters
  const storedUTMParams = getStoredUTMParameters();
  
  // Only store new parameters if none exist (preserve originals)
  if (!storedUTMParams || Object.keys(storedUTMParams).length === 0) {
    storeUTMParameters(currentUTMParams);
    console.log('UTM parameters stored:', currentUTMParams);
  } else {
    console.log('UTM parameters already exist in localStorage, preserving originals:', storedUTMParams);
  }
}

/**
 * Get stored UTM parameters for use in the application
 * @returns {Object} Stored UTM parameters (empty object if none exist)
 */
export function getUTMParameters() {
  return getStoredUTMParameters() || {};
}

/**
 * Clear stored UTM parameters from localStorage
 * Useful for testing or user logout scenarios
 */
export function clearUTMParameters() {
  try {
    localStorage.removeItem(UTM_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing UTM parameters from localStorage:', error);
  }
}
