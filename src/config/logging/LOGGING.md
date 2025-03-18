
# Table of Contents

- [Log collection](#log-collection)
  - [Logger Setup](#logger-setup)
  - [Log a message](#log-a-message)
  - [Best Practices](#best-practices)
- [Log Visualization](#log-visualization)
  - [Visualization Setup](#visualization-setup)
  - [Additional Resources](#additional-resources)

# Log collection

Logs are collected using [Pino Browser API](https://getpino.io/#/docs/browser)

Side read: [Example implementation guide](https://dev.to/parseable/logging-for-your-frontend-apps-28pj) with [Parseable](https://www.parseable.com)

## Logger Setup

> ⚠️ **Important Note:**
>
> Logs should be generated as close to the source as possible:
>
> - If a user logs in, the event should be logged in the login function
> - If a user is created, the event should be logged in the create user function
> - If an error occurs, the event should be logged in the error handling function

1- Create the function to send the logs to the partner tool

```javascript
// Create the sendLogs function
const sendLogs = async function (level, logEvent, a, b) {
  const url = "<betterstack URL>";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: 'Bearer <token>',
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      level: level,
      message: logEvent.messages[0].message,
      context: logEvent.messages[0].context,
    }),
  });
};
```

2- Create and export the logger for app-wide usage

```javascript

export const logger = pino({
  browser: {
    serialize: true,
    asObject: true,
    transmit: {
        send,
    },
  },
});
```

### Log a message

```javascript

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
```

The following logging levels are available:

```javascript
logger.info('Normal operation message')
logger.error('Error condition')
logger.debug('Debug information')
logger.warn('Warning message')
```

### Best Practices

For proper & useful logging - Try to follow these best practices:

- Include relevant context in logs
- Use appropriate log levels
- Avoid logging sensitive information
  - Favor the use of UUIDs vs user PII
  - Consider implementing data masking for sensitive information
- Add timestamps for better tracking
- Log events at the point of occurrence for better accuracy

# Log Visualization

To visualize logs, the chosen tool is [BetterStack](https://betterstack.com) due to its simplicity and ease of deployment

## Visualization Setup

1. Create an account on [BetterStack](https://betterstack.com)
2. Create a new project
3. Create a [source](https://betterstack.com/docs/sources) for your logs
4. Follow the instructions to set up the source in your application
5. View logs in the BetterStack [dashboard](https://telemetry.betterstack.com/team/111402/tail) per source

## Additional Resources

- [Pino Logging Documentation](https://getpino.io/#/docs/browser)
- [BetterStack Documentation](https://betterstack.com/docs)
