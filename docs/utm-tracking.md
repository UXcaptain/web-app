# UTM Parameter Tracking Documentation

## Overview

This document explains the UTM (Urchin Tracking Module) parameter tracking system implemented in the web application. The system captures marketing campaign parameters from URLs, stores them in localStorage, and includes them in user registration data for analytics and attribution purposes.

## Purpose

UTM parameters help track the effectiveness of marketing campaigns by identifying:
- Where traffic is coming from (source)
- What marketing medium was used (medium)
- Which specific campaign drove the traffic (campaign)
- Additional context about the click (content, term)
- Platform-specific tracking IDs (Google Click ID, Facebook Click ID)

## Tracked Parameters

The system captures the following parameters from URL query strings:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `utm_source` | The referrer (e.g., google, newsletter) | `utm_source=google` |
| `utm_medium` | Marketing medium (e.g., cpc, banner, email) | `utm_medium=cpc` |
| `utm_campaign` | Product, promo code, or slogan | `utm_campaign=spring_sale` |
| `utm_content` | Used to differentiate ads | `utm_content=logolink` |
| `utm_term` | Search terms | `utm_term=running+shoes` |
| `gclid` | Google Click Identifier | `gclid=EAIaIQobChMI...` |
| `fbclid` | Facebook Click Identifier | `fbclid=IwAR2...` |

## Architecture

### Files Involved

1. **[`src/utils/utmTracker.js`](../src/utils/utmTracker.js)** - Core utility module
2. **[`src/main.jsx`](../src/main.jsx)** - App initialization
3. **[`src/components/auth/CustomerRegistrationForm.jsx`](../src/components/auth/CustomerRegistrationForm.jsx)** - Customer registration
4. **[`src/components/auth/ParticipantRegistrationForm.jsx`](../src/components/auth/ParticipantRegistrationForm.jsx)** - Participant registration

### Data Flow

```
User visits site with UTM parameters
         ↓
initUTMTracking() extracts parameters from URL
         ↓
Check localStorage for existing UTM data
         ↓
If no existing data → Store new parameters
If existing data → Preserve originals (don't overwrite)
         ↓
User registers (customer or participant)
         ↓
getUTMParameters() retrieves stored data
         ↓
UTM parameters included in registration API request
         ↓
Backend receives registration data with UTM fields
```

## Implementation Details

### 1. UTM Tracking Utility

The [`utmTracker.js`](../src/utils/utmTracker.js) module provides the following functions:

#### `initUTMTracking()`
- Called once on app initialization in [`main.jsx`](../src/main.jsx:33)
- Extracts UTM parameters from the current URL
- Checks localStorage for existing values
- Stores new parameters only if none exist (preserves originals)
- Logs actions to console for debugging

#### `getUTMParameters()`
- Retrieves stored UTM parameters from localStorage
- Returns an object with all stored UTM fields
- Returns empty object `{}` if no parameters exist
- Used in registration forms to include UTM data in API requests

#### `clearUTMParameters()`
- Removes UTM parameters from localStorage
- Useful for testing or user logout scenarios
- Not currently used in the application flow

### 2. App Initialization

In [`main.jsx`](../src/main.jsx:33), UTM tracking is initialized immediately after PostHog setup:

```javascript
import { initUTMTracking } from './utils/utmTracker.js'

// Initialize UTM tracking on app load
initUTMTracking();
```

This ensures UTM parameters are captured as soon as the application loads, regardless of which page the user lands on.

### 3. Registration Integration

Both registration forms include UTM parameters in their API requests:

#### Customer Registration
[`CustomerRegistrationForm.jsx`](../src/components/auth/CustomerRegistrationForm.jsx:33):
```javascript
const data = {
    username: e.target.username.value,
    password: e.target.password.value,
    role: 'customer',
    ...getUTMParameters(),  // Spreads UTM parameters into the data object
}
```

#### Participant Registration
[`ParticipantRegistrationForm.jsx`](../src/components/auth/ParticipantRegistrationForm.jsx:28):
```javascript
const data = {
    username: e.target.username.value,
    password: e.target.password.value,
    role: 'participant',
    ...getUTMParameters(),  // Spreads UTM parameters into the data object
}
```

The spread operator (`...`) adds any available UTM parameters as additional fields to the registration data object. If no UTM parameters exist, it adds nothing.

## Usage Examples

### Example 1: First Visit with UTM Parameters

**URL:** `https://example.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale`

**Flow:**
1. User visits the site
2. `initUTMTracking()` extracts parameters from URL
3. No existing data in localStorage
4. Parameters stored in localStorage:
   ```json
   {
     "utm_source": "google",
     "utm_medium": "cpc",
     "utm_campaign": "spring_sale"
   }
   ```
5. User registers
6. Registration API request includes:
   ```json
   {
     "username": "user@example.com",
     "password": "securepassword",
     "role": "customer",
     "utm_source": "google",
     "utm_medium": "cpc",
     "utm_campaign": "spring_sale"
   }
   ```

### Example 2: Subsequent Visit with Different UTM Parameters

**First visit URL:** `https://example.com/?utm_source=google&utm_medium=cpc`
**Second visit URL:** `https://example.com/?utm_source=facebook&utm_medium=social`

**Flow:**
1. First visit: Parameters stored in localStorage
2. Second visit: `initUTMTracking()` detects new parameters
3. Existing parameters found in localStorage
4. Original parameters preserved (not overwritten)
5. User registers with original Google UTM data

This ensures the first touchpoint attribution is maintained.

### Example 3: Visit Without UTM Parameters

**URL:** `https://example.com/` (no UTM parameters)

**Flow:**
1. User visits the site
2. `initUTMTracking()` finds no UTM parameters in URL
3. No action taken
4. User registers
5. Registration API request includes only user data (no UTM fields)

## localStorage Structure

UTM parameters are stored in localStorage under the key `utm_parameters`:

```javascript
localStorage.getItem('utm_parameters')
// Returns: '{"utm_source":"google","utm_medium":"cpc","utm_campaign":"spring_sale"}'
```

## Backend Integration

The backend registration endpoints should be prepared to receive additional UTM parameters:

### Customer Registration Endpoint
**POST** `/api/v1/auth/register/local/customer`

Expected request body:
```json
{
  "username": "user@example.com",
  "password": "securepassword",
  "role": "customer",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "spring_sale",
  "utm_content": "logolink",
  "utm_term": "running+shoes",
  "gclid": "EAIaIQobChMI...",
  "fbclid": "IwAR2..."
}
```

### Participant Registration Endpoint
**POST** `/api/v1/auth/register/local/participant`

Expected request body:
```json
{
  "username": "participant@example.com",
  "password": "securepassword",
  "role": "participant",
  "utm_source": "newsletter",
  "utm_medium": "email",
  "utm_campaign": "weekly_digest"
}
```

**Note:** UTM parameters are optional. The backend should handle requests with or without them.

## Testing

### Manual Testing

1. **Test UTM Capture:**
   - Visit: `https://your-site.com/?utm_source=test&utm_medium=test&utm_campaign=test`
   - Open browser DevTools → Application → Local Storage
   - Verify `utm_parameters` key contains the captured values

2. **Test Parameter Preservation:**
   - Visit with UTM parameters and register
   - Clear localStorage
   - Visit with different UTM parameters
   - Verify original parameters are preserved (not overwritten)

3. **Test Registration:**
   - Visit with UTM parameters
   - Register a new user
   - Check network tab in DevTools
   - Verify registration request includes UTM parameters

### Console Logging

The system logs actions to the browser console for debugging:

- `UTM parameters stored: {...}` - When new parameters are saved
- `UTM parameters already exist in localStorage, preserving originals: {...}` - When existing parameters are preserved

## Future Enhancements

Potential improvements to consider:

1. **Session-based tracking:** Store UTM parameters in session storage for temporary tracking
2. **Referrer tracking:** Capture HTTP referrer for additional attribution data
3. **Timestamp tracking:** Add timestamp when UTM parameters were first captured
4. **Conversion events:** Send UTM data to analytics platforms (PostHog, Google Analytics)
5. **Admin dashboard:** Display UTM attribution data in user profiles
6. **UTM expiration:** Implement time-based expiration for stored parameters

## Troubleshooting

### UTM Parameters Not Being Captured

**Problem:** Parameters not appearing in localStorage

**Solutions:**
- Check browser console for errors
- Verify URL parameters are correctly formatted
- Ensure `initUTMTracking()` is called in [`main.jsx`](../src/main.jsx:33)
- Check that localStorage is enabled in the browser

### UTM Parameters Not Sent to Backend

**Problem:** Registration request doesn't include UTM data

**Solutions:**
- Verify `getUTMParameters()` is called in registration forms
- Check that spread operator `...getUTMParameters()` is used correctly
- Inspect network request in DevTools to see actual payload
- Ensure backend accepts additional fields in registration requests

### Parameters Being Overwritten

**Problem:** Original UTM data is being replaced on subsequent visits

**Solutions:**
- Verify the logic in [`initUTMTracking()`](../src/utils/utmTracker.js:68) checks for existing data
- Check that `getStoredUTMParameters()` returns data correctly
- Ensure localStorage key `utm_parameters` is not being cleared elsewhere

## Security Considerations

- UTM parameters are stored in localStorage, which is accessible by JavaScript
- Parameters are sent to the backend during registration
- No sensitive data should be stored in UTM parameters
- Consider sanitizing UTM values before storing or sending to backend

## Related Resources

- [Google Analytics UTM Parameters](https://support.google.com/analytics/answer/1033863)
- [UTM Builder Tool](https://ga-dev-tools.google/campaign-url-builder/)
- [PostHog Documentation](https://posthog.com/docs)

## Support

For questions or issues related to UTM tracking, please refer to:
- Implementation code in [`src/utils/utmTracker.js`](../src/utils/utmTracker.js)
- Integration points in registration forms
- This documentation file
