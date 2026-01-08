import { View, Text, ScrollView, TouchableOpacity, Switch, Linking } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

import { Card, CardContent } from "@/components/ui/Card";
import { useTheme } from "@/hooks/useColorScheme";
import { useAppStore } from "@/stores/app.store";

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  rightElement,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between py-3"
    >
      <View className="flex-row items-center flex-1">
        <Ionicons name={icon} size={22} color="#64748b" />
        <Text className="ml-3 text-base text-secondary-700 dark:text-secondary-300">
          {label}
        </Text>
      </View>
      <View className="flex-row items-center">
        {value && (
          <Text className="mr-2 text-secondary-500">{value}</Text>
        )}
        {rightElement}
        {showChevron && onPress && (
          <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, isDark, toggleTheme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();
  const { language, setLanguage } = useAppStore();

  const themeLabels = {
    light: t("settings.light"),
    dark: t("settings.dark"),
    system: t("settings.system"),
  };

  const handleThemePress = () => {
    toggleTheme();
  };

  return (
    <ScrollView className="flex-1 bg-secondary-50 dark:bg-secondary-950">
      <View className="p-6">
        {/* Appearance Section */}
        <Text className="mb-3 text-lg font-semibold text-secondary-900 dark:text-white">
          {t("settings.appearance")}
        </Text>

        <Card variant="outlined" className="mb-6">
          <CardContent>
            <SettingsRow
              icon="moon-outline"
              label={t("settings.theme")}
              value={themeLabels[theme]}
              onPress={handleThemePress}
            />

            <View className="h-px bg-secondary-200 dark:bg-secondary-700" />

            <SettingsRow
              icon="language-outline"
              label={t("settings.language")}
              value={language === "en" ? "English" : "Español"}
              onPress={() => setLanguage(language === "en" ? "es" : "en")}
            />
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Text className="mb-3 text-lg font-semibold text-secondary-900 dark:text-white">
          {t("settings.notifications")}
        </Text>

        <Card variant="outlined" className="mb-6">
          <CardContent>
            <SettingsRow
              icon="notifications-outline"
              label={t("settings.pushNotifications")}
              showChevron={false}
              rightElement={
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
                  thumbColor={true ? "#3b82f6" : "#f4f4f5"}
                />
              }
            />

            <View className="h-px bg-secondary-200 dark:bg-secondary-700" />

            <SettingsRow
              icon="mail-outline"
              label={t("settings.emailNotifications")}
              showChevron={false}
              rightElement={
                <Switch
                  value={false}
                  onValueChange={() => {}}
                  trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
                  thumbColor={false ? "#f4f4f5" : "#3b82f6"}
                />
              }
            />
          </CardContent>
        </Card>

        {/* Privacy Section */}
        <Text className="mb-3 text-lg font-semibold text-secondary-900 dark:text-white">
          {t("settings.privacy")}
        </Text>

        <Card variant="outlined" className="mb-6">
          <CardContent>
            <SettingsRow
              icon="document-text-outline"
              label={t("settings.termsOfService")}
              onPress={() => Linking.openURL("https://example.com/terms")}
            />

            <View className="h-px bg-secondary-200 dark:bg-secondary-700" />

            <SettingsRow
              icon="shield-checkmark-outline"
              label={t("settings.privacyPolicy")}
              onPress={() => Linking.openURL("https://example.com/privacy")}
            />
          </CardContent>
        </Card>

        {/* Support Section */}
        <Text className="mb-3 text-lg font-semibold text-secondary-900 dark:text-white">
          {t("settings.support")}
        </Text>

        <Card variant="outlined" className="mb-6">
          <CardContent>
            <SettingsRow
              icon="chatbubble-outline"
              label={t("settings.contactUs")}
              onPress={() => Linking.openURL("mailto:support@example.com")}
            />

            <View className="h-px bg-secondary-200 dark:bg-secondary-700" />

            <SettingsRow
              icon="help-circle-outline"
              label={t("settings.faq")}
              onPress={() => Linking.openURL("https://example.com/faq")}
            />
          </CardContent>
        </Card>

        {/* About Section */}
        <Text className="mb-3 text-lg font-semibold text-secondary-900 dark:text-white">
          {t("settings.about")}
        </Text>

        <Card variant="outlined" className="mb-6">
          <CardContent>
            <SettingsRow
              icon="information-circle-outline"
              label={t("settings.version")}
              value={Constants.expoConfig?.version || "1.0.0"}
              showChevron={false}
            />
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
