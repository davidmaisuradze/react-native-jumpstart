import { View, ViewProps } from "react-native";
import { cn } from "@/utils/cn";

export interface CardProps extends ViewProps {
  variant?: "default" | "elevated" | "outlined";
}

const Card = ({ className, variant = "default", children, ...props }: CardProps) => {
  return (
    <View
      className={cn(
        "rounded-2xl bg-white p-4 dark:bg-secondary-800",
        variant === "elevated" && "shadow-lg shadow-black/10",
        variant === "outlined" && "border border-secondary-200 dark:border-secondary-700",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
};

const CardHeader = ({ className, children, ...props }: ViewProps) => {
  return (
    <View className={cn("mb-3", className)} {...props}>
      {children}
    </View>
  );
};

const CardTitle = ({
  className,
  children,
  ...props
}: ViewProps & { children: React.ReactNode }) => {
  return (
    <View className={cn("", className)} {...props}>
      {typeof children === "string" ? (
        <View>
          <View className="text-lg font-semibold text-secondary-900 dark:text-white">
            {children}
          </View>
        </View>
      ) : (
        children
      )}
    </View>
  );
};

const CardContent = ({ className, children, ...props }: ViewProps) => {
  return (
    <View className={cn("", className)} {...props}>
      {children}
    </View>
  );
};

const CardFooter = ({ className, children, ...props }: ViewProps) => {
  return (
    <View className={cn("mt-3 flex-row items-center", className)} {...props}>
      {children}
    </View>
  );
};

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
