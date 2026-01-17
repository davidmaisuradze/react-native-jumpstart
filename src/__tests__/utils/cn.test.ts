import { cn } from "@/utils/cn";

/**
 * CN Utility Tests
 *
 * Tests for the className utility function that combines clsx and tailwind-merge.
 * This utility merges class names and handles Tailwind CSS class conflicts.
 */

describe("cn", () => {
  describe("basic functionality", () => {
    it("should merge multiple class strings", () => {
      const result = cn("px-4", "py-2");
      expect(result).toBe("px-4 py-2");
    });

    it("should handle single class string", () => {
      const result = cn("text-red-500");
      expect(result).toBe("text-red-500");
    });

    it("should handle empty inputs", () => {
      const result = cn();
      expect(result).toBe("");
    });
  });

  describe("conditional classes (clsx behavior)", () => {
    it("should handle conditional objects", () => {
      const result = cn("base", { active: true, disabled: false });
      expect(result).toBe("base active");
    });

    it("should handle arrays of classes", () => {
      const result = cn(["px-4", "py-2"]);
      expect(result).toBe("px-4 py-2");
    });

    it("should filter out falsy values", () => {
      const result = cn("base", null, undefined, false, "extra");
      expect(result).toBe("base extra");
    });
  });

  describe("Tailwind merge behavior", () => {
    it("should merge conflicting padding classes", () => {
      const result = cn("px-4", "px-6");
      expect(result).toBe("px-6");
    });

    it("should merge conflicting margin classes", () => {
      const result = cn("m-2", "m-4");
      expect(result).toBe("m-4");
    });

    it("should merge conflicting text color classes", () => {
      const result = cn("text-red-500", "text-blue-500");
      expect(result).toBe("text-blue-500");
    });

    it("should merge conflicting background color classes", () => {
      const result = cn("bg-white", "bg-gray-100");
      expect(result).toBe("bg-gray-100");
    });

    it("should keep non-conflicting classes", () => {
      const result = cn("px-4", "py-2", "text-red-500");
      expect(result).toBe("px-4 py-2 text-red-500");
    });
  });

  describe("complex usage", () => {
    it("should handle mixed inputs with conflicts", () => {
      const result = cn(
        "px-4 py-2 bg-blue-500",
        { "text-white": true, hidden: false },
        "px-6"
      );
      expect(result).toBe("py-2 bg-blue-500 text-white px-6");
    });

    it("should handle variant-like patterns", () => {
      const baseClass = "rounded-md font-medium";
      const sizeClass = "px-4 py-2";
      const variantClass = "bg-primary text-white";

      const result = cn(baseClass, sizeClass, variantClass);
      expect(result).toBe("rounded-md font-medium px-4 py-2 bg-primary text-white");
    });
  });
});
