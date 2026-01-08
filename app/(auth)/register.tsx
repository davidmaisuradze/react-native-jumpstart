import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
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

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signUp, signInWithApple, isLoading } = useAuth();
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const { control, handleSubmit, setError } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    capture("signup_attempt", { method: "email" });

    const { error } = await signUp(data.email, data.password);

    if (error) {
      capture("signup_error", { error: error.message });
      setError("root", { message: error.message });
      Alert.alert("Error", error.message);
    } else {
      capture("signup_success", { method: "email" });
      Alert.alert(
        t("auth.checkYourEmail"),
        "Your account has been created successfully!",
        [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
      );
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    capture("signup_attempt", { method: "apple" });

    const { error } = await signInWithApple();

    if (error) {
      capture("signup_error", { error: error.message, method: "apple" });
      Alert.alert("Error", error.message);
    } else {
      capture("signup_success", { method: "apple" });
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
              {t("auth.createAccount")}
            </Text>
            <Text className="mt-2 text-base text-secondary-500">
              Create an account to get started
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
              placeholder="Create a password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
              }
            />

            <FormInput
              control={control}
              name="confirmPassword"
              label={t("auth.confirmPassword")}
              placeholder="Confirm your password"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              leftIcon={
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
              }
            />

            <Button
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              className="mt-4"
            >
              {t("auth.signup")}
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
              analyticsEvent="signup"
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

          {/* Login Link */}
          <View className="mt-8 flex-row justify-center">
            <Text className="text-secondary-600 dark:text-secondary-400">
              {t("auth.alreadyHaveAccount")}{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Text className="font-semibold text-primary-600">
                {t("auth.login")}
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
