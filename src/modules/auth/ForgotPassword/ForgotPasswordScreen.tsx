import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/forms/FormInput";
import { styles } from "./ForgotPasswordScreen.styles";
import { useForgotPasswordScreen } from "./useForgotPasswordScreen";
import type { ForgotPasswordFormData } from "./forgotPassword.schema";

export function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { form, isLoading, onSubmit } = useForgotPasswordScreen();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={styles.keyboardAvoidingView}
    >
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{t("auth.resetPassword")}</Text>
          <Text className={styles.subtitle}>
            Enter your email and we'll send you a reset link
          </Text>
        </View>

        <View className={styles.form}>
          <FormInput<ForgotPasswordFormData>
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

          <Button
            onPress={onSubmit}
            isLoading={isLoading}
            className={styles.submitButton}
          >
            {t("auth.sendResetLink")}
          </Button>
        </View>

        <View className={styles.footer}>
          <Link href="/(auth)/login" asChild>
            <Text className={styles.footerLink}>
              {t("common.back")} to {t("auth.login")}
            </Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
