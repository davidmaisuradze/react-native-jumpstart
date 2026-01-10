import { useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/auth.store";
import {
  onAuthStateChanged,
  signInWithEmail as firebaseSignInWithEmail,
  signUpWithEmail as firebaseSignUpWithEmail,
  signInWithMagicLink as firebaseSignInWithMagicLink,
  signInWithApple as firebaseSignInWithApple,
  signOut as firebaseSignOut,
  resetPassword as firebaseResetPassword,
  MAGIC_LINK_EMAIL_KEY,
} from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setUser as setSentryUser,
  clearUser as clearSentryUser,
} from "@/lib/sentry";
import {
  identify as posthogIdentify,
  reset as posthogReset,
} from "@/lib/posthog";
import {
  identifyUser as rcIdentifyUser,
  logoutUser as rcLogoutUser,
} from "@/lib/revenuecat";

export const useAuth = () => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, setUser, setLoading, logout } =
    useAuthStore();

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Identify user in analytics
        setSentryUser({
          id: firebaseUser.uid,
          email: firebaseUser.email ?? undefined,
        });
        posthogIdentify(firebaseUser.uid, { email: firebaseUser.email });
        rcIdentifyUser(firebaseUser.uid).catch(console.error);
      } else {
        clearSentryUser();
        posthogReset();
        // RevenueCat handles user switching on next login - no logout needed
        rcLogoutUser();
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data, error } = await firebaseSignInWithEmail(email, password);
        if (error) throw error;
        return { data, error: null };
      } catch (error: any) {
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data, error } = await firebaseSignUpWithEmail(email, password);
        if (error) throw error;
        return { data, error: null };
      } catch (error: any) {
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const signInWithMagic = useCallback(
    async (email: string) => {
      setLoading(true);
      try {
        // Store email for magic link verification
        await AsyncStorage.setItem(MAGIC_LINK_EMAIL_KEY, email);
        const { data, error } = await firebaseSignInWithMagicLink(email);
        if (error) throw error;
        return { data, error: null };
      } catch (error: any) {
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  const signInWithApple = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await firebaseSignInWithApple();
      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await firebaseSignOut();
      if (error) throw error;
      logout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  }, [setLoading, logout, router]);

  const forgotPassword = useCallback(
    async (email: string) => {
      setLoading(true);
      try {
        const { data, error } = await firebaseResetPassword(email);
        if (error) throw error;
        return { data, error: null };
      } catch (error: any) {
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signInWithMagic,
    signInWithApple,
    signOut,
    forgotPassword,
  };
};
