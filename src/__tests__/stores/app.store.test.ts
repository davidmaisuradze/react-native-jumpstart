import { useAppStore } from "@/stores/app.store";

/**
 * App Store Unit Tests
 *
 * These tests verify the Zustand app store behaves correctly.
 * The store manages app-wide state including theme, language,
 * onboarding status, paywall tracking, and premium status.
 */

// Reset store between tests
beforeEach(() => {
  useAppStore.setState({
    theme: "system",
    language: "en",
    isOnboarded: false,
    hasSeenPaywall: false,
    isPremium: false,
  });
});

describe("useAppStore", () => {
  describe("initial state", () => {
    it("should have system theme initially", () => {
      const { theme } = useAppStore.getState();
      expect(theme).toBe("system");
    });

    it("should have English language initially", () => {
      const { language } = useAppStore.getState();
      expect(language).toBe("en");
    });

    it("should have isOnboarded false initially", () => {
      const { isOnboarded } = useAppStore.getState();
      expect(isOnboarded).toBe(false);
    });

    it("should have hasSeenPaywall false initially", () => {
      const { hasSeenPaywall } = useAppStore.getState();
      expect(hasSeenPaywall).toBe(false);
    });

    it("should have isPremium false initially", () => {
      const { isPremium } = useAppStore.getState();
      expect(isPremium).toBe(false);
    });
  });

  describe("setTheme", () => {
    it("should set theme to light", () => {
      useAppStore.getState().setTheme("light");
      expect(useAppStore.getState().theme).toBe("light");
    });

    it("should set theme to dark", () => {
      useAppStore.getState().setTheme("dark");
      expect(useAppStore.getState().theme).toBe("dark");
    });

    it("should set theme to system", () => {
      useAppStore.getState().setTheme("light");
      useAppStore.getState().setTheme("system");
      expect(useAppStore.getState().theme).toBe("system");
    });
  });

  describe("setLanguage", () => {
    it("should set language to Spanish", () => {
      useAppStore.getState().setLanguage("es");
      expect(useAppStore.getState().language).toBe("es");
    });

    it("should set language to English", () => {
      useAppStore.getState().setLanguage("es");
      useAppStore.getState().setLanguage("en");
      expect(useAppStore.getState().language).toBe("en");
    });
  });

  describe("setOnboarded", () => {
    it("should set isOnboarded to true", () => {
      useAppStore.getState().setOnboarded(true);
      expect(useAppStore.getState().isOnboarded).toBe(true);
    });

    it("should set isOnboarded to false", () => {
      useAppStore.getState().setOnboarded(true);
      useAppStore.getState().setOnboarded(false);
      expect(useAppStore.getState().isOnboarded).toBe(false);
    });
  });

  describe("setHasSeenPaywall", () => {
    it("should set hasSeenPaywall to true", () => {
      useAppStore.getState().setHasSeenPaywall(true);
      expect(useAppStore.getState().hasSeenPaywall).toBe(true);
    });

    it("should set hasSeenPaywall to false", () => {
      useAppStore.getState().setHasSeenPaywall(true);
      useAppStore.getState().setHasSeenPaywall(false);
      expect(useAppStore.getState().hasSeenPaywall).toBe(false);
    });
  });

  describe("setPremium", () => {
    it("should set isPremium to true", () => {
      useAppStore.getState().setPremium(true);
      expect(useAppStore.getState().isPremium).toBe(true);
    });

    it("should set isPremium to false", () => {
      useAppStore.getState().setPremium(true);
      useAppStore.getState().setPremium(false);
      expect(useAppStore.getState().isPremium).toBe(false);
    });
  });

  describe("reset", () => {
    it("should reset all state to initial values", () => {
      // Set various state values
      useAppStore.getState().setTheme("dark");
      useAppStore.getState().setLanguage("es");
      useAppStore.getState().setOnboarded(true);
      useAppStore.getState().setHasSeenPaywall(true);
      useAppStore.getState().setPremium(true);

      // Reset
      useAppStore.getState().reset();

      // Verify all values are reset
      const state = useAppStore.getState();
      expect(state.theme).toBe("system");
      expect(state.language).toBe("en");
      expect(state.isOnboarded).toBe(false);
      expect(state.hasSeenPaywall).toBe(false);
      expect(state.isPremium).toBe(false);
    });
  });
});
