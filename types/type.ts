import type { ComponentType } from "react";
import type {
  ImageSourcePropType,
  TextInputProps,
  TouchableOpacityProps,
} from "react-native";

export interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: ImageSourcePropType;
  secureTextEntry?: boolean;
  /** Shows eye toggle when `secureTextEntry` is true */
  showPasswordToggle?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
}

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  bgVariant?: "primary" | "secondary" | "danger" | "outline" | "success";
  textVariant?: "primary" | "default" | "secondary" | "danger" | "success";
  IconLeft?: ComponentType<unknown>;
  IconRight?: ComponentType<unknown>;
  className?: string;
  /** Shows a spinner and disables the button */
  loading?: boolean;
  /** Label while loading; defaults to `title` */
  loadingTitle?: string;
}
