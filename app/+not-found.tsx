import { View, Text } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-secondary-950">
        <Text className="text-xl font-bold text-secondary-900 dark:text-white">
          This screen doesn't exist.
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-sm text-primary-600">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
