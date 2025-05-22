import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from 'next/server';

// Ensure Sentry is initialized in a central configuration file
// like sentry.server.config.ts or instrumentation.ts, not here.
// Example: Sentry.init({ dsn: 'YOUR_SENTRY_DSN', _experiments: { enableLogs: true } });

const { logger } = Sentry;

export async function GET(req: NextRequest) {
  try {
    // Attempt to get IP address, prioritizing req.ip
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    const userAgent = req.headers.get('user-agent');
    const timestamp = new Date().toISOString();

    const logData = {
      ip: ip || 'Unknown',
      userAgent: userAgent || 'Unknown',
      timestamp: timestamp,
      message: "API /api/log visited"
    };

    // Log to Sentry using the new logger
    logger.info("API Route /api/log accessed", logData);

    console.log(`Logged to Sentry: ${JSON.stringify(logData)}`);
    return NextResponse.json({ message: 'Log saved successfully', details: logData });
  } catch (error) {
    const errorData = {
      message: "Error in logging API route",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    };
    logger.error("Error in /api/log", errorData);
    // Sentry.captureException(error) is still good for capturing the full error object with stack trace
    Sentry.captureException(error);
    console.error('Error in logging route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
