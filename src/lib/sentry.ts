import * as Sentry from "@sentry/react-native";

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export const initSentry = () => {
  if (!SENTRY_DSN) {
    console.warn("Sentry DSN not configured");
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
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
};

export const clearUser = () => {
  Sentry.setUser(null);
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Sentry.setContext("additional_info", context);
  }
  Sentry.captureException(error);
};

export const captureMessage = (message: string, level?: Sentry.SeverityLevel) => {
  Sentry.captureMessage(message, level);
};

export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  Sentry.addBreadcrumb(breadcrumb);
};

export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

// Wrap root component with Sentry
export const SentryErrorBoundary = Sentry.ErrorBoundary;
export const withSentry = Sentry.wrap;
