import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark" | "system";
type Language = "en" | "es";

interface AppState {
  theme: Theme;
  language: Language;
  isOnboarded: boolean;
  hasSeenPaywall: boolean;
  isPremium: boolean;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setOnboarded: (isOnboarded: boolean) => void;
  setHasSeenPaywall: (hasSeenPaywall: boolean) => void;
  setPremium: (isPremium: boolean) => void;
  reset: () => void;
}

const initialState = {
  theme: "system" as Theme,
  language: "en" as Language,
  isOnboarded: false,
  hasSeenPaywall: false,
  isPremium: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setTheme: (theme) => set({ theme }),

      setLanguage: (language) => set({ language }),

      setOnboarded: (isOnboarded) => set({ isOnboarded }),

      setHasSeenPaywall: (hasSeenPaywall) => set({ hasSeenPaywall }),

      setPremium: (isPremium) => set({ isPremium }),

      reset: () => set(initialState),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
