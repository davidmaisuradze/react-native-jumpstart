import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/forms/FormInput";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { useAuth } from "@/hooks/useAuth";
import { capture } from "@/lib/posthog";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signIn, signInWithApple, isLoading } = useAuth();
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const { control, handleSubmit, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    capture("login_attempt", { method: "email" });

    const { error } = await signIn(data.email, data.password);

    if (error) {
      capture("login_error", { error: error.message });
      setError("root", { message: error.message });
    } else {
      capture("login_success", { method: "email" });
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    capture("login_attempt", { method: "apple" });

    const { error } = await signInWithApple();

    if (error) {
      capture("login_error", { error: error.message, method: "apple" });
      Alert.alert("Error", error.message);
    } else {
      capture("login_success", { method: "apple" });
    }
    setIsAppleLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white dark:bg-secondary-950"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-10">
            <Text className="text-3xl font-bold text-secondary-900 dark:text-white">
              {t("auth.login")}
            </Text>
            <Text className="mt-2 text-base text-secondary-500">
              Welcome back! Please sign in to continue.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <FormInput
              control={control}
              name="email"
              label={t("auth.email")}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              leftIcon={
                <Ionicons name="mail-outline" size={20} color="#94a3b8" />
              }
            />

            <FormInput
              control={control}
              name="password"
              label={t("auth.password")}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
              }
            />

            <Link href="/(auth)/forgot-password" asChild>
              <Text className="self-end text-sm font-medium text-primary-600">
                {t("auth.forgotPassword")}
              </Text>
            </Link>

            <Button
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              className="mt-4"
            >
              {t("auth.login")}
            </Button>
          </View>

          {/* Divider */}
          <View className="my-8 flex-row items-center">
            <View className="flex-1 h-px bg-secondary-200 dark:bg-secondary-700" />
            <Text className="mx-4 text-sm text-secondary-500">
              {t("auth.orContinueWith")}
            </Text>
            <View className="flex-1 h-px bg-secondary-200 dark:bg-secondary-700" />
          </View>

          {/* Social Login */}
          <View className="gap-3">
            {/* Google Sign-In - Only shows if configured for this platform */}
            <GoogleSignInButton
              disabled={isLoading || isAppleLoading}
              analyticsEvent="login"
            />

            {/* Apple Sign-In - iOS only */}
            {Platform.OS === "ios" && (
              <Button
                variant="outline"
                leftIcon={<Ionicons name="logo-apple" size={20} color="#000" />}
                onPress={handleAppleSignIn}
                isLoading={isAppleLoading}
                disabled={isLoading || isAppleLoading}
              >
                {t("auth.signInWithApple")}
              </Button>
            )}
          </View>

          {/* Sign Up Link */}
          <View className="mt-8 flex-row justify-center">
            <Text className="text-secondary-600 dark:text-secondary-400">
              {t("auth.dontHaveAccount")}{" "}
            </Text>
            <Link href="/(auth)/register" asChild>
              <Text className="font-semibold text-primary-600">
                {t("auth.signup")}
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
