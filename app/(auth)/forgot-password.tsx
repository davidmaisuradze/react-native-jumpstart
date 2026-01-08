import { View, Text, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/forms/FormInput";
import { useAuth } from "@/hooks/useAuth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { forgotPassword, isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const { error } = await forgotPassword(data.email);

    if (error) {
      setError("root", { message: error.message });
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        t("auth.checkYourEmail"),
        t("auth.resetLinkSent"),
        [{ text: "OK", onPress: () => router.back() }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white dark:bg-secondary-950"
    >
      <View className="flex-1 justify-center px-6 py-12">
        {/* Header */}
        <View className="mb-10">
          <Text className="text-3xl font-bold text-secondary-900 dark:text-white">
            {t("auth.resetPassword")}
          </Text>
          <Text className="mt-2 text-base text-secondary-500">
            Enter your email and we'll send you a reset link
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

          <Button
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
            className="mt-4"
          >
            {t("auth.sendResetLink")}
          </Button>
        </View>

        {/* Back to Login */}
        <View className="mt-8 flex-row justify-center">
          <Link href="/(auth)/login" asChild>
            <Text className="font-semibold text-primary-600">
              {t("common.back")} to {t("auth.login")}
            </Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
