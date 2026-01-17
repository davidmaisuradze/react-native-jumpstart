import PostHog from "posthog-react-native";

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

let posthogClient: PostHog | null = null;

export const initPostHog = async (): Promise<PostHog | null> => {
  if (!POSTHOG_API_KEY) {
    console.log("PostHog: Skipping - API key not configured");
    return null;
  }

  if (posthogClient) {
    return posthogClient;
  }

  posthogClient = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
    // Disable in development by default
    disabled: __DEV__,
  });

  return posthogClient;
};

export const getPostHog = (): PostHog | null => {
  return posthogClient;
};

export const identify = (userId: string, properties?: Record<string, any>) => {
  posthogClient?.identify(userId, properties);
};

export const reset = () => {
  posthogClient?.reset();
};

export const capture = (event: string, properties?: Record<string, any>) => {
  posthogClient?.capture(event, properties);
};

export const screen = (screenName: string, properties?: Record<string, any>) => {
  posthogClient?.screen(screenName, properties);
};

// Feature flags
export const isFeatureEnabled = async (flagKey: string): Promise<boolean> => {
  if (!posthogClient) return false;
  return posthogClient.isFeatureEnabled(flagKey) ?? false;
};

export const getFeatureFlag = async (flagKey: string): Promise<string | boolean | undefined> => {
  if (!posthogClient) return undefined;
  return posthogClient.getFeatureFlag(flagKey);
};

// Group analytics
export const group = (groupType: string, groupKey: string, properties?: Record<string, any>) => {
  posthogClient?.group(groupType, groupKey, properties);
};

// Opt out of tracking
export const optOut = () => {
  posthogClient?.optOut();
};

export const optIn = () => {
  posthogClient?.optIn();
};

// Flush events immediately
export const flush = async () => {
  await posthogClient?.flush();
};

// Shutdown PostHog
export const shutdown = async () => {
  await posthogClient?.shutdown();
  posthogClient = null;
};
