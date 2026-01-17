import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === "dark";
  const activeTintColor = "#3b82f6";
  const inactiveTintColor = isDark ? "#94a3b8" : "#64748b";
  const backgroundColor = isDark ? "#0f172a" : "#ffffff";
  const headerBackground = isDark ? "#1e293b" : "#ffffff";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: isDark ? "#334155" : "#e2e8f0",
        },
        headerStyle: {
          backgroundColor: headerBackground,
        },
        headerTintColor: isDark ? "#ffffff" : "#0f172a",
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
