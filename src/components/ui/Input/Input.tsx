import { forwardRef } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/utils/cn";
import { styles, placeholderColor, iconColor } from "./Input.styles";
import { usePasswordVisibility } from "./useInput";

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
    const isPassword = secureTextEntry !== undefined;
    const {
      togglePasswordVisibility,
      secureTextEntry: computedSecureTextEntry,
      accessibilityLabel: toggleAccessibilityLabel,
      iconName,
    } = usePasswordVisibility(isPassword);

    return (
      <View className={cn(styles.container, containerClassName)}>
        {label && <Text className={styles.label}>{label}</Text>}
        <View
          className={cn(
            styles.inputWrapper,
            error ? styles.inputWrapperError : styles.inputWrapperDefault
          )}
        >
          {leftIcon && <View className={styles.leftIconWrapper}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            className={cn(styles.input, className)}
            placeholderTextColor={placeholderColor}
            secureTextEntry={computedSecureTextEntry}
            accessibilityLabel={label}
            accessibilityState={{
              disabled: props.editable === false,
            }}
            accessibilityHint={error ? `Error: ${error}` : hint}
            {...props}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              className={styles.passwordToggle}
              accessibilityRole="button"
              accessibilityLabel={toggleAccessibilityLabel}
              accessibilityHint="Double tap to toggle password visibility"
            >
              <Ionicons name={iconName} size={20} color={iconColor} />
            </TouchableOpacity>
          )}
          {rightIcon && !isPassword && (
            <View className={styles.rightIconWrapper}>{rightIcon}</View>
          )}
        </View>
        {error && <Text className={styles.error}>{error}</Text>}
        {hint && !error && <Text className={styles.hint}>{hint}</Text>}
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input };
