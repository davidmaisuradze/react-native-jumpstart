import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink as firebaseIsSignInWithEmailLink,
  signInWithEmailLink as firebaseSignInWithEmailLink,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  OAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  User,
  Auth,
  // @ts-expect-error - getReactNativePersistence is available at runtime but not in types
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Firebase configuration from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA5QvXm-rixsOnIqrT50wfSj2gxhvEusgU",
  authDomain: "react-native-jumpstart-529b8.firebaseapp.com",
  projectId: "react-native-jumpstart-529b8",
  storageBucket: "react-native-jumpstart-529b8.firebasestorage.app",
  messagingSenderId: "273995665286",
  appId: "1:273995665286:android:58cbd4fc5cf50ef21b6607",
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with React Native persistence for session persistence
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // Auth may already be initialized (e.g., from hot reload), get existing instance
  auth = getAuth(app);
}

export const db = getFirestore(app);

// Storage key for magic link email
export const MAGIC_LINK_EMAIL_KEY = "magicLinkEmail";

// Auth helper functions
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { data: userCredential, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { data: userCredential, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const signInWithMagicLink = async (email: string) => {
  // Configure action code settings for magic link
  // Note: You need to set up Firebase Dynamic Links for this to work
  const actionCodeSettings = {
    url: `https://reactnativejumpstart.page.link/magiclink?email=${encodeURIComponent(email)}`,
    handleCodeInApp: true,
    iOS: {
      bundleId: "com.reactnativejumpstart",
    },
    android: {
      packageName: "com.reactnativejumpstart",
      installApp: true,
      minimumVersion: "12",
    },
    dynamicLinkDomain: "reactnativejumpstart.page.link",
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Store email for later verification
    await AsyncStorage.setItem(MAGIC_LINK_EMAIL_KEY, email);
    return { data: { email }, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const verifyMagicLink = async (email: string, link: string) => {
  try {
    if (firebaseIsSignInWithEmailLink(auth, link)) {
      const userCredential = await firebaseSignInWithEmailLink(auth, email, link);
      // Clear stored email
      await AsyncStorage.removeItem(MAGIC_LINK_EMAIL_KEY);
      return { data: userCredential, error: null };
    }
    return { data: null, error: new Error("Invalid magic link") };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const signInWithApple = async () => {
  if (Platform.OS !== "ios") {
    return {
      data: null,
      error: new Error("Apple Sign-In is only available on iOS"),
    };
  }

  try {
    // Check if Apple Sign-In is available
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return {
        data: null,
        error: new Error("Apple Sign-In is not available on this device"),
      };
    }

    // Generate a secure nonce
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );

    // Request Apple authentication
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    // Create Firebase credential from Apple credential
    const { identityToken } = appleCredential;
    if (!identityToken) {
      return { data: null, error: new Error("No identity token received") };
    }

    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: identityToken,
      rawNonce: nonce,
    });
    const userCredential = await signInWithCredential(auth, credential);

    // Update display name if available from Apple
    if (appleCredential.fullName) {
      const { givenName, familyName } = appleCredential.fullName;
      if (givenName || familyName) {
        const displayName = [givenName, familyName].filter(Boolean).join(" ");
        await updateProfile(userCredential.user, { displayName });
      }
    }

    return { data: userCredential, error: null };
  } catch (error: any) {
    if (error.code === "ERR_REQUEST_CANCELED") {
      return { data: null, error: new Error("User cancelled Apple Sign-In") };
    }
    return { data: null, error };
  }
};

export const signInWithGoogle = async (idToken: string) => {
  try {
    // Create Firebase credential from Google ID token
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);

    return { data: userCredential, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { data: { email }, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChanged = (
  callback: (user: User | null) => void
) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

// Check if a link is a sign-in email link
export const isSignInWithEmailLink = (link: string): boolean => {
  return firebaseIsSignInWithEmailLink(auth, link);
};

// Export auth instance
export { auth };

// Export types for convenience
export type FirebaseAuthTypes = { User: User };
