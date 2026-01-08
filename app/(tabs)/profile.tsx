import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { isPremium } = useSubscription();

  return (
    <ScrollView className="flex-1 bg-secondary-50 dark:bg-secondary-950">
      <View className="p-6">
        {/* Profile Header */}
        <View className="items-center mb-6">
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-primary-100">
            <Ionicons name="person" size={48} color="#3b82f6" />
          </View>
          <Text className="text-xl font-bold text-secondary-900 dark:text-white">
            {user?.email?.split("@")[0] || "User"}
          </Text>
          <Text className="text-secondary-500">{user?.email}</Text>

          {/* Subscription Badge */}
          <View
            className={`mt-3 rounded-full px-4 py-1 ${
              isPremium ? "bg-primary-100" : "bg-secondary-200 dark:bg-secondary-700"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                isPremium ? "text-primary-600" : "text-secondary-600 dark:text-secondary-300"
              }`}
            >
              {isPremium ? t("profile.premium") : t("profile.free")}
            </Text>
          </View>
        </View>

        {/* Upgrade Card */}
        {!isPremium && (
          <Card variant="elevated" className="mb-6">
            <CardContent>
              <View className="items-center">
                <Ionicons name="diamond-outline" size={32} color="#3b82f6" />
                <Text className="mt-2 text-lg font-semibold text-secondary-900 dark:text-white">
                  {t("profile.upgradeToPremium")}
                </Text>
                <Text className="mt-1 text-center text-sm text-secondary-500">
                  {t("subscription.subtitle")}
                </Text>
                <Button
                  className="mt-4"
                  onPress={() => router.push("/(modals)/paywall")}
                >
                  Upgrade Now
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Account Section */}
        <Text className="mb-3 text-lg font-semibold text-secondary-900 dark:text-white">
          {t("settings.account")}
        </Text>

        <Card variant="outlined" className="mb-6">
          <CardContent>
            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="mail-outline" size={20} color="#64748b" />
                  <Text className="ml-3 text-secondary-700 dark:text-secondary-300">
                    {t("auth.email")}
                  </Text>
                </View>
                <Text className="text-secondary-500">{user?.email}</Text>
              </View>

              <View className="h-px bg-secondary-200 dark:bg-secondary-700" />

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color="#64748b" />
                  <Text className="ml-3 text-secondary-700 dark:text-secondary-300">
                    Member since
                  </Text>
                </View>
                <Text className="text-secondary-500">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : "N/A"}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button variant="destructive" onPress={signOut}>
          {t("auth.logout")}
        </Button>
      </View>
    </ScrollView>
  );
}
