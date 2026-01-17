import { View, ViewProps } from "react-native";
import { cn } from "@/utils/cn";
import { cardVariants, styles, type CardVariants } from "./Card.styles";

export interface CardProps extends ViewProps, CardVariants {}

const Card = ({ className, variant = "default", children, ...props }: CardProps) => {
  return (
    <View className={cn(cardVariants({ variant }), className)} {...props}>
      {children}
    </View>
  );
};

const CardHeader = ({ className, children, ...props }: ViewProps) => {
  return (
    <View className={cn(styles.header, className)} {...props}>
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
          <View className={styles.title}>{children}</View>
        </View>
      ) : (
        children
      )}
    </View>
  );
};

const CardContent = ({ className, children, ...props }: ViewProps) => {
  return (
    <View className={cn(styles.content, className)} {...props}>
      {children}
    </View>
  );
};

const CardFooter = ({ className, children, ...props }: ViewProps) => {
  return (
    <View className={cn(styles.footer, className)} {...props}>
      {children}
    </View>
  );
};

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
