import { useState } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/hooks/useAuth";
import { capture } from "@/lib/posthog";
import { loginSchema, LoginFormData } from "./login.schema";

export const useLoginScreen = () => {
  const { signIn, signInWithApple, isLoading } = useAuth();
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const form = useForm<LoginFormData>({
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
      form.setError("root", { message: error.message });
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

  return {
    form,
    isLoading,
    isAppleLoading,
    isSubmitting: isLoading || isAppleLoading,
    onSubmit: form.handleSubmit(onSubmit),
    handleAppleSignIn,
  };
};
