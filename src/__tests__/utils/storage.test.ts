import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { secureStorage, storage, STORAGE_KEYS } from "@/utils/storage";

/**
 * Storage Utility Tests
 *
 * Tests for secure storage (expo-secure-store) and regular storage (AsyncStorage).
 * Includes platform-specific behavior testing for web fallback.
 */

// Mock Platform
jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
  },
}));

// Helper to set platform OS for testing
const setPlatformOS = (os: string) => {
  Object.defineProperty(Platform, "OS", { value: os, writable: true });
};

describe("secureStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setPlatformOS("ios");
  });

  describe("getItem", () => {
    it("should get item from SecureStore on native", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("test-value");

      const result = await secureStorage.getItem("test-key");

      expect(SecureStore.getItemAsync).toHaveBeenCalledWith("test-key");
      expect(result).toBe("test-value");
    });

    it("should return null when SecureStore returns null", async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await secureStorage.getItem("nonexistent-key");

      expect(result).toBeNull();
    });

    it("should fall back to AsyncStorage on web", async () => {
      setPlatformOS("web");
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("web-value");

      const result = await secureStorage.getItem("test-key");

      expect(AsyncStorage.getItem).toHaveBeenCalledWith("test-key");
      expect(result).toBe("web-value");
    });

    it("should return null and log error on SecureStore error", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(
        new Error("SecureStore error")
      );

      const result = await secureStorage.getItem("test-key");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("setItem", () => {
    it("should set item in SecureStore on native", async () => {
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.setItem("test-key", "test-value");

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        "test-key",
        "test-value"
      );
    });

    it("should fall back to AsyncStorage on web", async () => {
      setPlatformOS("web");
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.setItem("test-key", "test-value");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith("test-key", "test-value");
    });

    it("should log error on SecureStore error", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(
        new Error("SecureStore error")
      );

      await secureStorage.setItem("test-key", "test-value");

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("removeItem", () => {
    it("should remove item from SecureStore on native", async () => {
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.removeItem("test-key");

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("test-key");
    });

    it("should fall back to AsyncStorage on web", async () => {
      setPlatformOS("web");
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await secureStorage.removeItem("test-key");

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("test-key");
    });
  });
});

describe("storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getItem", () => {
    it("should get item from AsyncStorage", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue("stored-value");

      const result = await storage.getItem("test-key");

      expect(AsyncStorage.getItem).toHaveBeenCalledWith("test-key");
      expect(result).toBe("stored-value");
    });

    it("should return null on error", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error("Storage error")
      );

      const result = await storage.getItem("test-key");

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("setItem", () => {
    it("should set item in AsyncStorage", async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storage.setItem("test-key", "test-value");

      expect(AsyncStorage.setItem).toHaveBeenCalledWith("test-key", "test-value");
    });

    it("should log error on failure", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error("Storage error")
      );

      await storage.setItem("test-key", "test-value");

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("removeItem", () => {
    it("should remove item from AsyncStorage", async () => {
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      await storage.removeItem("test-key");

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("test-key");
    });
  });

  describe("clear", () => {
    it("should clear all AsyncStorage", async () => {
      (AsyncStorage.clear as jest.Mock).mockResolvedValue(undefined);

      await storage.clear();

      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  });

  describe("getAllKeys", () => {
    it("should return all keys from AsyncStorage", async () => {
      const mockKeys = ["key1", "key2", "key3"];
      (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(mockKeys);

      const result = await storage.getAllKeys();

      expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
      expect(result).toEqual(mockKeys);
    });

    it("should return empty array on error", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (AsyncStorage.getAllKeys as jest.Mock).mockRejectedValue(
        new Error("Storage error")
      );

      const result = await storage.getAllKeys();

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

describe("STORAGE_KEYS", () => {
  it("should have all expected keys defined", () => {
    expect(STORAGE_KEYS.AUTH_TOKEN).toBe("auth_token");
    expect(STORAGE_KEYS.REFRESH_TOKEN).toBe("refresh_token");
    expect(STORAGE_KEYS.USER_PREFERENCES).toBe("user_preferences");
    expect(STORAGE_KEYS.ONBOARDING_COMPLETE).toBe("onboarding_complete");
    expect(STORAGE_KEYS.THEME).toBe("theme");
    expect(STORAGE_KEYS.LANGUAGE).toBe("language");
  });
});
