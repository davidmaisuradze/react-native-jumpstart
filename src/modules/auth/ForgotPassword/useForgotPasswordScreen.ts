import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/useAuth";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "./forgotPassword.schema";

export const useForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { forgotPassword, isLoading } = useAuth();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const { error } = await forgotPassword(data.email);

    if (error) {
      form.setError("root", { message: error.message });
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(t("auth.checkYourEmail"), t("auth.resetLinkSent"), [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
