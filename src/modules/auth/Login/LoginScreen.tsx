import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/forms/FormInput";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { styles } from "./LoginScreen.styles";
import { useLoginScreen } from "./useLoginScreen";
import type { LoginFormData } from "./login.schema";

export function LoginScreen() {
  const { t } = useTranslation();
  const {
    form,
    isLoading,
    isAppleLoading,
    isSubmitting,
    onSubmit,
    handleAppleSignIn,
  } = useLoginScreen();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={styles.keyboardAvoidingView}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View className={styles.content}>
          <View className={styles.header}>
            <Text className={styles.title}>{t("auth.login")}</Text>
            <Text className={styles.subtitle}>
              Welcome back! Please sign in to continue.
            </Text>
          </View>

          <View className={styles.form}>
            <FormInput<LoginFormData>
              control={form.control}
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

            <FormInput<LoginFormData>
              control={form.control}
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
              <Text className={styles.forgotPasswordLink}>
                {t("auth.forgotPassword")}
              </Text>
            </Link>

            <Button
              onPress={onSubmit}
              isLoading={isLoading}
              className={styles.submitButton}
            >
              {t("auth.login")}
            </Button>
          </View>

          <View className={styles.divider}>
            <View className={styles.dividerLine} />
            <Text className={styles.dividerText}>{t("auth.orContinueWith")}</Text>
            <View className={styles.dividerLine} />
          </View>

          <View className={styles.socialButtons}>
            <GoogleSignInButton
              disabled={isSubmitting}
              analyticsEvent="login"
            />

            {Platform.OS === "ios" && (
              <Button
                variant="outline"
                leftIcon={<Ionicons name="logo-apple" size={20} color="#000" />}
                onPress={handleAppleSignIn}
                isLoading={isAppleLoading}
                disabled={isSubmitting}
              >
                {t("auth.signInWithApple")}
              </Button>
            )}
          </View>

          <View className={styles.footer}>
            <Text className={styles.footerText}>
              {t("auth.dontHaveAccount")}{" "}
            </Text>
            <Link href="/(auth)/register" asChild>
              <Text className={styles.footerLink}>{t("auth.signup")}</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
