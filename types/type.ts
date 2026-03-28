import type { ComponentType } from "react";
import type { TouchableOpacityProps } from "react-native";

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: ComponentType<unknown>;
  IconRight?: ComponentType<unknown>;
  className?: string;
}
