import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { styles } from "./HomeScreen.styles";
import { useHomeScreen } from "./useHomeScreen";

export function HomeScreen() {
  const { t } = useTranslation();
  const { user, isPremium, navigateToPaywall } = useHomeScreen();

  return (
    <ScrollView className={styles.container}>
      <View className={styles.content}>
        <View className={styles.welcomeSection}>
          <Text className={styles.welcomeTitle}>Welcome back!</Text>
          <Text className={styles.welcomeSubtitle}>
            {user?.email || "Guest"}
          </Text>
        </View>

        {!isPremium && (
          <Card variant="elevated" className={styles.premiumBanner}>
            <CardContent>
              <View className={styles.premiumBannerContent}>
                <View className={styles.premiumBannerTextContainer}>
                  <Text className={styles.premiumBannerTitle}>
                    {t("subscription.title")}
                  </Text>
                  <Text className={styles.premiumBannerSubtitle}>
                    {t("subscription.subtitle")}
                  </Text>
                </View>
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={navigateToPaywall}
                >
                  Upgrade
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        <Text className={styles.sectionTitle}>Quick Actions</Text>

        <View className={styles.actionCards}>
          <Card variant="outlined">
            <CardContent>
              <View className={styles.actionCardContent}>
                <View
                  className={`${styles.actionIconContainer} ${styles.actionIconContainerPrimary}`}
                >
                  <Text className={styles.actionIcon}>🚀</Text>
                </View>
                <View className={styles.actionTextContainer}>
                  <Text className={styles.actionTitle}>Getting Started</Text>
                  <Text className={styles.actionSubtitle}>
                    Learn how to customize your app
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <View className={styles.actionCardContent}>
                <View
                  className={`${styles.actionIconContainer} ${styles.actionIconContainerGreen}`}
                >
                  <Text className={styles.actionIcon}>📚</Text>
                </View>
                <View className={styles.actionTextContainer}>
                  <Text className={styles.actionTitle}>Documentation</Text>
                  <Text className={styles.actionSubtitle}>
                    Read the full documentation
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <View className={styles.actionCardContent}>
                <View
                  className={`${styles.actionIconContainer} ${styles.actionIconContainerPurple}`}
                >
                  <Text className={styles.actionIcon}>💬</Text>
                </View>
                <View className={styles.actionTextContainer}>
                  <Text className={styles.actionTitle}>Community</Text>
                  <Text className={styles.actionSubtitle}>
                    Join the community
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
