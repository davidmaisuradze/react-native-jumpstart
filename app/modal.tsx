import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-secondary-950">
      <Text className="text-xl font-bold text-secondary-900 dark:text-white">
        Modal
      </Text>
      <View className="my-8 h-px w-4/5 bg-secondary-200 dark:bg-secondary-700" />
      <Text className="text-center text-secondary-500 px-6">
        This is a modal screen. Customize it for your app.
      </Text>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
