import { cva, type VariantProps } from "class-variance-authority";

export const cardVariants = cva("rounded-2xl bg-white p-4 dark:bg-secondary-800", {
  variants: {
    variant: {
      default: "",
      elevated: "shadow-lg shadow-black/10",
      outlined: "border border-secondary-200 dark:border-secondary-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const styles = {
  header: "mb-3",
  title: "text-lg font-semibold text-secondary-900 dark:text-white",
  content: "",
  footer: "mt-3 flex-row items-center",
} as const;

export type CardVariants = VariantProps<typeof cardVariants>;
