import { View, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { styles, iconColor, avatarIconColor } from "./ProfileScreen.styles";
import { useProfileScreen } from "./useProfileScreen";

export function ProfileScreen() {
  const { t } = useTranslation();
  const {
    user,
    isPremium,
    displayName,
    memberSince,
    navigateToPaywall,
    signOut,
  } = useProfileScreen();

  return (
    <ScrollView className={styles.container}>
      <View className={styles.content}>
        <View className={styles.profileHeader}>
          <View className={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={avatarIconColor} />
          </View>
          <Text className={styles.userName}>{displayName}</Text>
          <Text className={styles.userEmail}>{user?.email}</Text>

          <View
            className={`${styles.subscriptionBadge} ${
              isPremium
                ? styles.subscriptionBadgePremium
                : styles.subscriptionBadgeFree
            }`}
          >
            <Text
              className={
                isPremium
                  ? styles.subscriptionBadgeTextPremium
                  : styles.subscriptionBadgeTextFree
              }
            >
              {isPremium ? t("profile.premium") : t("profile.free")}
            </Text>
          </View>
        </View>

        {!isPremium && (
          <Card variant="elevated" className={styles.upgradeCard}>
            <CardContent>
              <View className={styles.upgradeCardContent}>
                <Ionicons name="diamond-outline" size={32} color={avatarIconColor} />
                <Text className={styles.upgradeCardTitle}>
                  {t("profile.upgradeToPremium")}
                </Text>
                <Text className={styles.upgradeCardSubtitle}>
                  {t("subscription.subtitle")}
                </Text>
                <Button
                  className={styles.upgradeButton}
                  onPress={navigateToPaywall}
                >
                  Upgrade Now
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        <Text className={styles.sectionTitle}>{t("settings.account")}</Text>

        <Card variant="outlined" className={styles.accountCard}>
          <CardContent>
            <View className={styles.accountRows}>
              <View className={styles.accountRow}>
                <View className={styles.accountRowLeft}>
                  <Ionicons name="mail-outline" size={20} color={iconColor} />
                  <Text className={styles.accountRowLabel}>
                    {t("auth.email")}
                  </Text>
                </View>
                <Text className={styles.accountRowValue}>{user?.email}</Text>
              </View>

              <View className={styles.divider} />

              <View className={styles.accountRow}>
                <View className={styles.accountRowLeft}>
                  <Ionicons name="calendar-outline" size={20} color={iconColor} />
                  <Text className={styles.accountRowLabel}>Member since</Text>
                </View>
                <Text className={styles.accountRowValue}>{memberSince}</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Button variant="destructive" onPress={signOut}>
          {t("auth.logout")}
        </Button>
      </View>
    </ScrollView>
  );
}
