import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const { isPremium } = useSubscription();

  return (
    <ScrollView className="flex-1 bg-secondary-50 dark:bg-secondary-950">
      <View className="p-6">
        {/* Welcome Section */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-secondary-900 dark:text-white">
            Welcome back!
          </Text>
          <Text className="mt-1 text-secondary-500">
            {user?.email || "Guest"}
          </Text>
        </View>

        {/* Premium Banner */}
        {!isPremium && (
          <Card variant="elevated" className="mb-6 bg-primary-500">
            <CardContent>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-white">
                    {t("subscription.title")}
                  </Text>
                  <Text className="mt-1 text-sm text-primary-100">
                    {t("subscription.subtitle")}
                  </Text>
                </View>
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={() => router.push("/(modals)/paywall")}
                >
                  Upgrade
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Text className="mb-3 text-lg font-semibold text-secondary-900 dark:text-white">
          Quick Actions
        </Text>

        <View className="gap-3">
          <Card variant="outlined">
            <CardContent>
              <View className="flex-row items-center">
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <Text className="text-2xl">🚀</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-secondary-900 dark:text-white">
                    Getting Started
                  </Text>
                  <Text className="text-sm text-secondary-500">
                    Learn how to customize your app
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <View className="flex-row items-center">
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Text className="text-2xl">📚</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-secondary-900 dark:text-white">
                    Documentation
                  </Text>
                  <Text className="text-sm text-secondary-500">
                    Read the full documentation
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <View className="flex-row items-center">
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Text className="text-2xl">💬</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-secondary-900 dark:text-white">
                    Community
                  </Text>
                  <Text className="text-sm text-secondary-500">
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
