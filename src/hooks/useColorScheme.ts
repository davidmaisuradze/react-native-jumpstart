import { useColorScheme as useNativeColorScheme } from "react-native";
import { useAppStore } from "@/stores/app.store";

export type ColorScheme = "light" | "dark";

export const useColorScheme = (): ColorScheme => {
  const systemColorScheme = useNativeColorScheme();
  const { theme } = useAppStore();

  if (theme === "system") {
    return systemColorScheme ?? "light";
  }

  return theme;
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const { theme, setTheme } = useAppStore();

  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const setLightTheme = () => setTheme("light");
  const setDarkTheme = () => setTheme("dark");
  const setSystemTheme = () => setTheme("system");

  return {
    colorScheme,
    isDark,
    theme,
    toggleTheme,
    setTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
  };
};
