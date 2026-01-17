import { useAuthStore } from "@/stores/auth.store";
import { User } from "firebase/auth";

/**
 * Auth Store Unit Tests
 *
 * These tests verify the Zustand auth store behaves correctly.
 * The store manages authentication state including user data,
 * loading states, and authentication status.
 */

// Reset store between tests
beforeEach(() => {
  useAuthStore.setState({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
});

describe("useAuthStore", () => {
  describe("initial state", () => {
    it("should have null user initially", () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });

    it("should have isLoading true initially", () => {
      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(true);
    });

    it("should have isAuthenticated false initially", () => {
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe("setUser", () => {
    it("should set user and isAuthenticated to true when user is provided", () => {
      const mockUser = {
        uid: "test-uid-123",
        email: "test@example.com",
      } as User;

      useAuthStore.getState().setUser(mockUser);

      const { user, isAuthenticated } = useAuthStore.getState();
      expect(user).toEqual(mockUser);
      expect(isAuthenticated).toBe(true);
    });

    it("should set user to null and isAuthenticated to false when null is provided", () => {
      // First set a user
      const mockUser = { uid: "test-uid-123", email: "test@example.com" } as User;
      useAuthStore.getState().setUser(mockUser);

      // Then clear the user
      useAuthStore.getState().setUser(null);

      const { user, isAuthenticated } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe("setLoading", () => {
    it("should set isLoading to true", () => {
      useAuthStore.getState().setLoading(true);

      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(true);
    });

    it("should set isLoading to false", () => {
      useAuthStore.getState().setLoading(false);

      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe("logout", () => {
    it("should clear user and set isAuthenticated to false", () => {
      // First set a user
      const mockUser = { uid: "test-uid-123", email: "test@example.com" } as User;
      useAuthStore.getState().setUser(mockUser);
      useAuthStore.getState().setLoading(false);

      // Then logout
      useAuthStore.getState().logout();

      const { user, isAuthenticated } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(isAuthenticated).toBe(false);
    });

    it("should not affect isLoading state", () => {
      useAuthStore.getState().setLoading(false);
      useAuthStore.getState().logout();

      const { isLoading } = useAuthStore.getState();
      // isLoading should remain unchanged by logout
      expect(isLoading).toBe(false);
    });
  });
});
