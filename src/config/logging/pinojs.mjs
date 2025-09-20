import pino from 'pino';

const redactOptions = {
  paths: ['context.userData.email', 'context.userData.password'],
  censor: '[REDACTED]',
};

const send = async function (level, logEvent, a , b) {
  const url = "https://s1231538.eu-nbg-2.betterstackdata.com";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${import.meta.env.VITE_PINO_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      level: level,
      message: logEvent.messages[0].message,
      context: logEvent.messages[0].context,
    }),

  });
};

export const logger = pino({
  browser: {
    serialize: true,
    asObject: true,
    transmit: {
        send
    },
  },
});



