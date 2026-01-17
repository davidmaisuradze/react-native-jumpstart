import { View, Text, ScrollView, Switch } from "react-native";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";

import { Card, CardContent } from "@/components/ui/Card";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { styles, switchColors } from "./SettingsScreen.styles";
import { useSettingsScreen } from "./useSettingsScreen";

export function SettingsScreen() {
  const { t } = useTranslation();
  const {
    theme,
    language,
    handleThemePress,
    handleLanguagePress,
    handleTermsPress,
    handlePrivacyPress,
    handleContactPress,
    handleFaqPress,
  } = useSettingsScreen();

  const themeLabels: Record<string, string> = {
    light: t("settings.light"),
    dark: t("settings.dark"),
    system: t("settings.system"),
  };

  return (
    <ScrollView className={styles.container}>
      <View className={styles.content}>
        <Text className={styles.sectionTitle}>{t("settings.appearance")}</Text>

        <Card variant="outlined" className={styles.sectionCard}>
          <CardContent>
            <SettingsRow
              icon="moon-outline"
              label={t("settings.theme")}
              value={themeLabels[theme]}
              onPress={handleThemePress}
            />

            <View className={styles.divider} />

            <SettingsRow
              icon="language-outline"
              label={t("settings.language")}
              value={language === "en" ? "English" : "Español"}
              onPress={handleLanguagePress}
            />
          </CardContent>
        </Card>

        <Text className={styles.sectionTitle}>{t("settings.notifications")}</Text>

        <Card variant="outlined" className={styles.sectionCard}>
          <CardContent>
            <SettingsRow
              icon="notifications-outline"
              label={t("settings.pushNotifications")}
              showChevron={false}
              rightElement={
                <Switch
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{
                    false: switchColors.trackFalse,
                    true: switchColors.trackTrue,
                  }}
                  thumbColor={switchColors.thumbOn}
                />
              }
            />

            <View className={styles.divider} />

            <SettingsRow
              icon="mail-outline"
              label={t("settings.emailNotifications")}
              showChevron={false}
              rightElement={
                <Switch
                  value={false}
                  onValueChange={() => {}}
                  trackColor={{
                    false: switchColors.trackFalse,
                    true: switchColors.trackTrue,
                  }}
                  thumbColor={switchColors.thumbOff}
                />
              }
            />
          </CardContent>
        </Card>

        <Text className={styles.sectionTitle}>{t("settings.privacy")}</Text>

        <Card variant="outlined" className={styles.sectionCard}>
          <CardContent>
            <SettingsRow
              icon="document-text-outline"
              label={t("settings.termsOfService")}
              onPress={handleTermsPress}
            />

            <View className={styles.divider} />

            <SettingsRow
              icon="shield-checkmark-outline"
              label={t("settings.privacyPolicy")}
              onPress={handlePrivacyPress}
            />
          </CardContent>
        </Card>

        <Text className={styles.sectionTitle}>{t("settings.support")}</Text>

        <Card variant="outlined" className={styles.sectionCard}>
          <CardContent>
            <SettingsRow
              icon="chatbubble-outline"
              label={t("settings.contactUs")}
              onPress={handleContactPress}
            />

            <View className={styles.divider} />

            <SettingsRow
              icon="help-circle-outline"
              label={t("settings.faq")}
              onPress={handleFaqPress}
            />
          </CardContent>
        </Card>

        <Text className={styles.sectionTitle}>{t("settings.about")}</Text>

        <Card variant="outlined" className={styles.sectionCard}>
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
