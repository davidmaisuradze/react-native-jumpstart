import * as Sentry from "@sentry/react-native";
import { ComponentType } from "react";

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
const isConfigured = !!SENTRY_DSN;

export const isSentryConfigured = () => isConfigured;

export const initSentry = () => {
  if (!isConfigured) {
    console.log("Sentry DSN not configured, skipping initialization");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    // Sample 100% in dev, 10% in production to reduce costs and overhead
    tracesSampleRate: __DEV__ ? 1.0 : 0.1,
    // Enable native crash handling
    enableNative: true,
    // Enable auto session tracking
    enableAutoSessionTracking: true,
    // Sessions close after app is in background for 30 seconds
    sessionTrackingIntervalMillis: 30000,
    // Capture screenshots on error (dev only for privacy)
    attachScreenshot: __DEV__,
    // Capture view hierarchy on error (dev only for privacy)
    attachViewHierarchy: __DEV__,
    _experiments: {
      profilesSampleRate: __DEV__ ? 1.0 : 0.1,
    },
    // Environment configuration
    environment: __DEV__ ? "development" : "production",
  });
};

export const setUser = (user: { id: string; email?: string; name?: string }) => {
  if (!isConfigured) return;
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
};

export const clearUser = () => {
  if (!isConfigured) return;
  Sentry.setUser(null);
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (!isConfigured) return;
  if (context) {
    Sentry.setContext("additional_info", context);
  }
  Sentry.captureException(error);
};

export const captureMessage = (message: string, level?: Sentry.SeverityLevel) => {
  if (!isConfigured) return;
  Sentry.captureMessage(message, level);
};

export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  if (!isConfigured) return;
  Sentry.addBreadcrumb(breadcrumb);
};

export const setTag = (key: string, value: string) => {
  if (!isConfigured) return;
  Sentry.setTag(key, value);
};

// Wrap root component with Sentry (no-op if not configured)
export const SentryErrorBoundary = isConfigured ? Sentry.ErrorBoundary : null;

export const withSentry = <P extends object>(
  component: ComponentType<P>
): ComponentType<P> => {
  if (!isConfigured) {
    return component;
  }
  return Sentry.wrap(component);
};
