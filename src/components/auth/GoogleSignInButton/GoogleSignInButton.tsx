import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { useGoogleSignIn, UseGoogleSignInOptions } from "./useGoogleSignIn";

export interface GoogleSignInButtonProps extends UseGoogleSignInOptions {
  disabled?: boolean;
}

export function GoogleSignInButton({
  disabled,
  analyticsEvent = "login",
}: GoogleSignInButtonProps) {
  const { t } = useTranslation();
  const { isLoading, isAvailable, handleSignIn } = useGoogleSignIn({
    analyticsEvent,
  });

  if (!isAvailable) {
    return null;
  }

  return (
    <Button
      variant="outline"
      leftIcon={<Ionicons name="logo-google" size={20} color="#4285F4" />}
      onPress={handleSignIn}
      isLoading={isLoading}
      disabled={disabled || isLoading}
    >
      {t("auth.signInWithGoogle")}
    </Button>
  );
}
