import { forwardRef } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-xl",
  {
    variants: {
      variant: {
        default: "bg-primary-600 active:bg-primary-700",
        secondary: "bg-secondary-200 active:bg-secondary-300 dark:bg-secondary-800 dark:active:bg-secondary-700",
        outline: "border-2 border-primary-600 bg-transparent active:bg-primary-50 dark:active:bg-primary-950",
        ghost: "bg-transparent active:bg-secondary-100 dark:active:bg-secondary-900",
        destructive: "bg-red-600 active:bg-red-700",
        link: "bg-transparent",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4",
        lg: "h-14 px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("font-semibold text-center", {
  variants: {
    variant: {
      default: "text-white",
      secondary: "text-secondary-900 dark:text-secondary-100",
      outline: "text-primary-600",
      ghost: "text-secondary-900 dark:text-secondary-100",
      destructive: "text-white",
      link: "text-primary-600 underline",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
      icon: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <TouchableOpacity
        ref={ref as any}
        className={cn(
          buttonVariants({ variant, size }),
          isDisabled && "opacity-50",
          className
        )}
        disabled={isDisabled}
        activeOpacity={0.8}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={variant === "default" || variant === "destructive" ? "#fff" : "#3b82f6"}
          />
        ) : (
          <>
            {leftIcon && <>{leftIcon}</>}
            {typeof children === "string" ? (
              <Text
                className={cn(
                  buttonTextVariants({ variant, size }),
                  leftIcon && "ml-2",
                  rightIcon && "mr-2"
                )}
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {rightIcon && <>{rightIcon}</>}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
