import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { Button } from "@/components/ui/Button";
import { signInWithGoogle } from "@/lib/firebase";
import { capture } from "@/lib/posthog";

// Web client ID - required for @react-native-google-signin to exchange ID tokens
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

// Check if running in Expo Go (native modules not available)
// Native Google Sign-In requires a Development Build, not Expo Go
const isExpoGo = Constants.executionEnvironment === "storeClient";

interface GoogleSignInButtonProps {
  disabled?: boolean;
  analyticsEvent?: "login" | "signup";
}

export function GoogleSignInButton({
  disabled,
  analyticsEvent = "login",
}: GoogleSignInButtonProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [GoogleSigninModule, setGoogleSigninModule] = useState<typeof import("@react-native-google-signin/google-signin") | null>(null);

  useEffect(() => {
    // Don't try to load native module in Expo Go - it will crash
    if (isExpoGo) {
      console.log("Google Sign-In: Skipping in Expo Go (requires Development Build)");
      return;
    }

    // Don't try to load if web client ID is not configured
    if (!GOOGLE_WEB_CLIENT_ID) {
      console.warn("Google Sign-In: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID not set");
      return;
    }

    // Dynamically import the native module
    const loadGoogleSignin = async () => {
      try {
        const module = await import("@react-native-google-signin/google-signin");
        setGoogleSigninModule(module);

        module.GoogleSignin.configure({
          webClientId: GOOGLE_WEB_CLIENT_ID,
        });
        setIsConfigured(true);
      } catch (error) {
        // This can happen if native module is not linked (e.g., running in Expo Go)
        console.warn("Google Sign-In: Native module not available:", error);
      }
    };

    loadGoogleSignin();
  }, []);

  const handleSignIn = async () => {
    if (!GoogleSigninModule || !isConfigured) {
      Alert.alert("Error", "Google Sign-In is not configured");
      return;
    }

    const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } =
      GoogleSigninModule;

    setIsLoading(true);
    capture(`${analyticsEvent}_attempt`, { method: "google" });

    try {
      // Check if Play Services are available (Android only)
      await GoogleSignin.hasPlayServices();

      // Perform native Google Sign-In
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken } = response.data;

        if (!idToken) {
          throw new Error("No ID token received from Google");
        }

        // Sign in to Firebase with the Google ID token
        const { error } = await signInWithGoogle(idToken);
        if (error) throw error;

        capture(`${analyticsEvent}_success`, { method: "google" });
      }
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // Sign-in already in progress
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
  };

  // Don't render in Expo Go (native module not available) or if not configured
  if (isExpoGo || !GOOGLE_WEB_CLIENT_ID || !isConfigured) {
    return null;
  }

  return (
    <Button
      variant="outline"
      leftIcon={<Ionicons name="logo-google" size={20} color="#4285F4" />}
      onPress={handleSignIn}
      isLoading={isLoading}
      disabled={disabled || isLoading}
    >
      {t("auth.signInWithGoogle")}
    </Button>
  );
}
