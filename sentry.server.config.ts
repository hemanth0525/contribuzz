// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://d300c13da1215fa662ce32f8dcc693c8@o4509367367106560.ingest.us.sentry.io/4509367372808192",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: true,

  // Enable Sentry logger
  _experiments: {
    enableLogs: true,
  },

  // Add consoleLoggingIntegration to capture console.log, .error, and .warn
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "error", "warn"] }),
  ],
});
