import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/useAuth";
import { capture } from "@/lib/posthog";
import { registerSchema, RegisterFormData } from "./register.schema";

export const useRegisterScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { signUp, signInWithApple, isLoading } = useAuth();
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const form = useForm<RegisterFormData>({
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
      form.setError("root", { message: error.message });
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

  return {
    form,
    isLoading,
    isAppleLoading,
    isSubmitting: isLoading || isAppleLoading,
    onSubmit: form.handleSubmit(onSubmit),
    handleAppleSignIn,
  };
};
