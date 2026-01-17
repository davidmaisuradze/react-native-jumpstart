import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles, iconColor, chevronColor } from "./SettingsRow.styles";

export interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

export function SettingsRow({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  rightElement,
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className={styles.container}
    >
      <View className={styles.leftContent}>
        <Ionicons name={icon} size={22} color={iconColor} />
        <Text className={styles.label}>{label}</Text>
      </View>
      <View className={styles.rightContent}>
        {value && <Text className={styles.value}>{value}</Text>}
        {rightElement}
        {showChevron && onPress && (
          <Ionicons name="chevron-forward" size={20} color={chevronColor} />
        )}
      </View>
    </TouchableOpacity>
  );
}
