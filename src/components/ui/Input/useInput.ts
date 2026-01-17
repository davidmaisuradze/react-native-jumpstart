import { useState, useCallback } from "react";

export interface UsePasswordVisibilityResult {
  isPasswordVisible: boolean;
  togglePasswordVisibility: () => void;
  secureTextEntry: boolean;
  accessibilityLabel: string;
  iconName: "eye-off-outline" | "eye-outline";
}

export const usePasswordVisibility = (
  isPassword: boolean
): UsePasswordVisibilityResult => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  return {
    isPasswordVisible,
    togglePasswordVisibility,
    secureTextEntry: isPassword && !isPasswordVisible,
    accessibilityLabel: isPasswordVisible ? "Hide password" : "Show password",
    iconName: isPasswordVisible ? "eye-off-outline" : "eye-outline",
  };
};
