import { forwardRef } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
} from "react-native";
import { cn } from "@/utils/cn";
import {
  buttonVariants,
  buttonTextVariants,
  type ButtonVariants,
} from "./Button.styles";

export interface ButtonProps
  extends TouchableOpacityProps,
    ButtonVariants {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  accessibilityLabel?: string;
}

const Button = forwardRef<View, ButtonProps>(
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
      accessibilityLabel,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const derivedAccessibilityLabel =
      accessibilityLabel ?? (typeof children === "string" ? children : undefined);

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
        accessibilityRole="button"
        accessibilityLabel={derivedAccessibilityLabel}
        accessibilityState={{
          disabled: isDisabled,
          busy: isLoading,
        }}
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
