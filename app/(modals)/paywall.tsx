import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useSubscription } from "@/hooks/useSubscription";
import { capture } from "@/lib/posthog";
import { useAppStore } from "@/stores/app.store";

export default function PaywallScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { offerings, isPurchasing, purchase, restore } = useSubscription();
  const { setHasSeenPaywall } = useAppStore();

  const handleClose = () => {
    setHasSeenPaywall(true);
    capture("paywall_dismissed");
    router.back();
  };

  const handlePurchase = async (pkg: any) => {
    capture("purchase_initiated", { package: pkg.identifier });
    const result = await purchase(pkg);
    if (result.success) {
      capture("purchase_success", { package: pkg.identifier });
      router.back();
    }
  };

  const handleRestore = async () => {
    capture("restore_initiated");
    await restore();
  };

  const features = [
    { icon: "infinite-outline", text: t("subscription.features.feature1") },
    { icon: "ban-outline", text: t("subscription.features.feature2") },
    { icon: "headset-outline", text: t("subscription.features.feature3") },
    { icon: "star-outline", text: t("subscription.features.feature4") },
  ];

  return (
    <View className="flex-1 bg-white dark:bg-secondary-950">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 pt-14">
        <View className="w-10" />
        <Text className="text-lg font-semibold text-secondary-900 dark:text-white">
          {t("subscription.title")}
        </Text>
        <TouchableOpacity onPress={handleClose} className="p-2">
          <Ionicons name="close" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Hero */}
        <View className="items-center py-8">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary-100">
            <Ionicons name="diamond" size={40} color="#3b82f6" />
          </View>
          <Text className="text-2xl font-bold text-secondary-900 dark:text-white">
            {t("subscription.title")}
          </Text>
          <Text className="mt-2 text-center text-secondary-500">
            {t("subscription.subtitle")}
          </Text>
        </View>

        {/* Features */}
        <View className="mb-8">
          {features.map((feature, index) => (
            <View key={index} className="mb-4 flex-row items-center">
              <View className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                <Ionicons name={feature.icon as any} size={20} color="#3b82f6" />
              </View>
              <Text className="flex-1 text-base text-secondary-700 dark:text-secondary-300">
                {feature.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Packages */}
        <View className="gap-3">
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
                  className={`${isPopular ? "border-primary-500 border-2" : ""}`}
                >
                  {isPopular && (
                    <View className="absolute -top-3 left-4 rounded-full bg-primary-500 px-3 py-1">
                      <Text className="text-xs font-semibold text-white">
                        {t("subscription.mostPopular")}
                      </Text>
                    </View>
                  )}
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-lg font-semibold text-secondary-900 dark:text-white">
                        {pkg.product.title}
                      </Text>
                      <Text className="text-sm text-secondary-500">
                        {pkg.product.description}
                      </Text>
                    </View>
                    <Text className="text-xl font-bold text-primary-600">
                      {pkg.product.priceString}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Restore */}
        <Button
          variant="ghost"
          onPress={handleRestore}
          className="mt-6"
          isLoading={isPurchasing}
        >
          {t("subscription.restore")}
        </Button>

        {/* Terms */}
        <Text className="mt-6 mb-8 text-center text-xs text-secondary-400">
          Subscriptions automatically renew unless canceled at least 24 hours
          before the end of the current period. Manage subscriptions in your
          account settings.
        </Text>
      </ScrollView>
    </View>
  );
}
