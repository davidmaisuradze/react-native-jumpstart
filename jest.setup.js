/* global jest, require, console */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Jest Setup File
 *
 * This file runs before each test file and sets up mocks for native modules
 * that cannot run in the Jest environment.
 */

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  usePathname: () => "/",
}));

// Mock Firebase
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  sendSignInLinkToEmail: jest.fn(),
  isSignInWithEmailLink: jest.fn(),
  signInWithEmailLink: jest.fn(),
  signInWithCredential: jest.fn(),
  OAuthProvider: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
}));

// Mock Sentry
jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
  setUser: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
}));

// Mock PostHog
jest.mock("posthog-react-native", () => ({
  PostHogProvider: ({ children }) => children,
  usePostHog: () => ({
    capture: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
  }),
}));

// Mock RevenueCat
jest.mock("react-native-purchases", () => ({
  configure: jest.fn(),
  getCustomerInfo: jest.fn(() =>
    Promise.resolve({ entitlements: { active: {} } })
  ),
  logIn: jest.fn(),
  logOut: jest.fn(),
  getOfferings: jest.fn(),
  purchasePackage: jest.fn(),
  restorePurchases: jest.fn(),
}));

// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock expo-localization
jest.mock("expo-localization", () => ({
  getLocales: () => [{ languageCode: "en" }],
}));

// Silence console warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("Animated: `useNativeDriver`")
  ) {
    return;
  }
  originalWarn.apply(console, args);
};
