import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "../global.css";
import { queryClient } from "@/lib/queryClient";
import { initSentry, withSentry } from "@/lib/sentry";
import { initPostHog } from "@/lib/posthog";
import { configureRevenueCat } from "@/lib/revenuecat";
import { initI18n } from "@/i18n";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuthStore } from "@/stores/auth.store";
import {
  isSignInWithEmailLink,
  verifyMagicLink,
  MAGIC_LINK_EMAIL_KEY,
} from "@/lib/firebase";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Initialize services
initSentry();

function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Initialize app services
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await Promise.all([
          initI18n(),
          initPostHog(),
          configureRevenueCat(),
        ]);
      } catch (e) {
        console.error("Failed to initialize app services:", e);
      } finally {
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  // Handle deep links for magic link sign-in
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      if (isSignInWithEmailLink(url)) {
        try {
          const email = await AsyncStorage.getItem(MAGIC_LINK_EMAIL_KEY);
          if (email) {
            const { error } = await verifyMagicLink(email, url);
            if (error) {
              console.error("Magic link sign-in error:", error);
            }
          }
        } catch (error) {
          console.error("Magic link sign-in error:", error);
        }
      }
    };

    // Handle deep links when app is already open
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Handle deep link that opened the app
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isReady]);

  if (!loaded || !isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Handle protected routes
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and on auth screen
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/paywall"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

export default withSentry(RootLayout);
