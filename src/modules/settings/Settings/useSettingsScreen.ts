import { Linking } from "react-native";

import { useTheme } from "@/hooks/useColorScheme";
import { useAppStore } from "@/stores/app.store";

export const useSettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useAppStore();

  const themeValue = theme;

  const handleThemePress = () => {
    toggleTheme();
  };

  const handleLanguagePress = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  const handleTermsPress = () => {
    Linking.openURL("https://example.com/terms");
  };

  const handlePrivacyPress = () => {
    Linking.openURL("https://example.com/privacy");
  };

  const handleContactPress = () => {
    Linking.openURL("mailto:support@example.com");
  };

  const handleFaqPress = () => {
    Linking.openURL("https://example.com/faq");
  };

  return {
    theme: themeValue,
    language,
    handleThemePress,
    handleLanguagePress,
    handleTermsPress,
    handlePrivacyPress,
    handleContactPress,
    handleFaqPress,
  };
};
