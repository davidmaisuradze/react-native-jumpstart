import { forwardRef, useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/utils/cn";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      containerClassName,
      className,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = secureTextEntry !== undefined;

    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="mb-2 text-sm font-medium text-secondary-700 dark:text-secondary-300">
            {label}
          </Text>
        )}
        <View
          className={cn(
            "flex-row items-center rounded-xl border-2 bg-white px-4 dark:bg-secondary-900",
            error
              ? "border-red-500"
              : "border-secondary-200 focus:border-primary-500 dark:border-secondary-700"
          )}
        >
          {leftIcon && <View className="mr-3">{leftIcon}</View>}
          <TextInput
            ref={ref}
            className={cn(
              "h-12 flex-1 text-base text-secondary-900 dark:text-white",
              className
            )}
            placeholderTextColor="#94a3b8"
            secureTextEntry={isPassword && !isPasswordVisible}
            {...props}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="ml-3"
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#94a3b8"
              />
            </TouchableOpacity>
          )}
          {rightIcon && !isPassword && <View className="ml-3">{rightIcon}</View>}
        </View>
        {error && (
          <Text className="mt-1.5 text-sm text-red-500">{error}</Text>
        )}
        {hint && !error && (
          <Text className="mt-1.5 text-sm text-secondary-500">{hint}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input };
