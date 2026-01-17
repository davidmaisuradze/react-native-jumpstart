import { useEffect, useState, useCallback } from "react";
import Constants from "expo-constants";
import { Alert } from "react-native";

import { signInWithGoogle } from "@/lib/firebase";
import { capture } from "@/lib/posthog";

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const isExpoGo = Constants.executionEnvironment === "storeClient";

type GoogleSigninModuleType =
  typeof import("@react-native-google-signin/google-signin");

export interface UseGoogleSignInOptions {
  analyticsEvent?: "login" | "signup";
}

export interface UseGoogleSignInResult {
  isLoading: boolean;
  isAvailable: boolean;
  handleSignIn: () => Promise<void>;
}

export const useGoogleSignIn = ({
  analyticsEvent = "login",
}: UseGoogleSignInOptions = {}): UseGoogleSignInResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [googleSigninModule, setGoogleSigninModule] =
    useState<GoogleSigninModuleType | null>(null);

  const isAvailable = !isExpoGo && !!GOOGLE_WEB_CLIENT_ID && isConfigured;

  useEffect(() => {
    if (isExpoGo) {
      console.log(
        "Google Sign-In: Skipping in Expo Go (requires Development Build)"
      );
      return;
    }

    if (!GOOGLE_WEB_CLIENT_ID) {
      console.warn("Google Sign-In: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID not set");
      return;
    }

    const loadGoogleSignin = async () => {
      try {
        const module = await import(
          "@react-native-google-signin/google-signin"
        );
        setGoogleSigninModule(module);

        module.GoogleSignin.configure({
          webClientId: GOOGLE_WEB_CLIENT_ID,
        });
        setIsConfigured(true);
      } catch (error) {
        console.warn("Google Sign-In: Native module not available:", error);
      }
    };

    loadGoogleSignin();
  }, []);

  const handleSignIn = useCallback(async () => {
    if (!googleSigninModule || !isConfigured) {
      Alert.alert("Error", "Google Sign-In is not configured");
      return;
    }

    const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } =
      googleSigninModule;

    setIsLoading(true);
    capture(`${analyticsEvent}_attempt`, { method: "google" });

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;

        if (!idToken) {
          throw new Error("No ID token received from Google");
        }

        const { error } = await signInWithGoogle(idToken);
        if (error) throw error;

        capture(`${analyticsEvent}_success`, { method: "google" });
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            capture(`${analyticsEvent}_error`, {
              error: "User cancelled",
              method: "google",
            });
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            capture(`${analyticsEvent}_error`, {
              error: "Play Services not available",
              method: "google",
            });
            Alert.alert("Error", "Google Play Services is not available");
            break;
          default:
            capture(`${analyticsEvent}_error`, {
              error: error.message,
              method: "google",
            });
            Alert.alert("Error", error.message || "Google Sign-In failed");
        }
      } else {
        capture(`${analyticsEvent}_error`, {
          error: error.message,
          method: "google",
        });
        Alert.alert("Error", error.message || "Google Sign-In failed");
      }
    } finally {
      setIsLoading(false);
    }
  }, [googleSigninModule, isConfigured, analyticsEvent]);

  return {
    isLoading,
    isAvailable,
    handleSignIn,
  };
};
