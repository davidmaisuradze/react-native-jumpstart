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
import { styles } from "./RegisterScreen.styles";
import { useRegisterScreen } from "./useRegisterScreen";
import type { RegisterFormData } from "./register.schema";

export function RegisterScreen() {
  const { t } = useTranslation();
  const {
    form,
    isLoading,
    isAppleLoading,
    isSubmitting,
    onSubmit,
    handleAppleSignIn,
  } = useRegisterScreen();

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
            <Text className={styles.title}>{t("auth.createAccount")}</Text>
            <Text className={styles.subtitle}>
              Create an account to get started
            </Text>
          </View>

          <View className={styles.form}>
            <FormInput<RegisterFormData>
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

            <FormInput<RegisterFormData>
              control={form.control}
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

            <FormInput<RegisterFormData>
              control={form.control}
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
              onPress={onSubmit}
              isLoading={isLoading}
              className={styles.submitButton}
            >
              {t("auth.signup")}
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
              analyticsEvent="signup"
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
              {t("auth.alreadyHaveAccount")}{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Text className={styles.footerLink}>{t("auth.login")}</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
