import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { styles, closeIconColor, featureIconColor } from "./PaywallScreen.styles";
import { usePaywallScreen } from "./usePaywallScreen";

export function PaywallScreen() {
  const { t } = useTranslation();
  const {
    offerings,
    isPurchasing,
    handleClose,
    handlePurchase,
    handleRestore,
  } = usePaywallScreen();

  const features = [
    { icon: "infinite-outline", text: t("subscription.features.feature1") },
    { icon: "ban-outline", text: t("subscription.features.feature2") },
    { icon: "headset-outline", text: t("subscription.features.feature3") },
    { icon: "star-outline", text: t("subscription.features.feature4") },
  ];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <View className={styles.headerSpacer} />
        <Text className={styles.headerTitle}>{t("subscription.title")}</Text>
        <TouchableOpacity onPress={handleClose} className={styles.closeButton}>
          <Ionicons name="close" size={24} color={closeIconColor} />
        </TouchableOpacity>
      </View>

      <ScrollView className={styles.scrollView}>
        <View className={styles.hero}>
          <View className={styles.heroIconContainer}>
            <Ionicons name="diamond" size={40} color={featureIconColor} />
          </View>
          <Text className={styles.heroTitle}>{t("subscription.title")}</Text>
          <Text className={styles.heroSubtitle}>{t("subscription.subtitle")}</Text>
        </View>

        <View className={styles.featuresSection}>
          {features.map((feature, index) => (
            <View key={index} className={styles.featureRow}>
              <View className={styles.featureIconContainer}>
                <Ionicons
                  name={feature.icon as any}
                  size={20}
                  color={featureIconColor}
                />
              </View>
              <Text className={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        <View className={styles.packagesSection}>
          {offerings.map((pkg) => {
            const isPopular = pkg.packageType === "ANNUAL";
            return (
              <TouchableOpacity
                key={pkg.identifier}
                onPress={() => handlePurchase(pkg)}
                disabled={isPurchasing}
              >
                <Card
                  variant="outlined"
                  className={
                    isPopular ? styles.packageCardPopular : styles.packageCard
                  }
                >
                  {isPopular && (
                    <View className={styles.popularBadge}>
                      <Text className={styles.popularBadgeText}>
                        {t("subscription.mostPopular")}
                      </Text>
                    </View>
                  )}
                  <View className={styles.packageContent}>
                    <View>
                      <Text className={styles.packageTitle}>
                        {pkg.product.title}
                      </Text>
                      <Text className={styles.packageDescription}>
                        {pkg.product.description}
                      </Text>
                    </View>
                    <Text className={styles.packagePrice}>
                      {pkg.product.priceString}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          variant="ghost"
          onPress={handleRestore}
          className={styles.restoreButton}
          isLoading={isPurchasing}
        >
          {t("subscription.restore")}
        </Button>

        <Text className={styles.termsText}>
          Subscriptions automatically renew unless canceled at least 24 hours
          before the end of the current period. Manage subscriptions in your
          account settings.
        </Text>
      </ScrollView>
    </View>
  );
}
