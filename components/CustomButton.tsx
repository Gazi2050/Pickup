import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import type { ButtonProps } from "@/types/type";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-neutral-100 border border-neutral-300";
    default:
      return "bg-[#0286FF]";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return "text-black";
    case "secondary":
      return "text-gray-100";
    case "danger":
      return "text-red-100";
    case "success":
      return "text-green-100";
    default:
      return "text-white";
  }
};

const getActivityIndicatorColor = (
  bgVariant: ButtonProps["bgVariant"],
  textVariant: ButtonProps["textVariant"],
): string => {
  if (bgVariant === "outline" || textVariant === "primary") {
    return "#0286FF";
  }
  return "#ffffff";
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  className,
  loading = false,
  loadingTitle,
  disabled,
  ...props
}: ButtonProps) => {
  const showSpinner = loading;
  const label = showSpinner ? (loadingTitle ?? title) : title;
  const spinnerColor = getActivityIndicatorColor(bgVariant, textVariant);

  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      disabled={!!disabled || showSpinner}
      className={`w-full rounded-full p-3 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(bgVariant)} ${showSpinner ? "opacity-90" : ""} ${className ?? ""}`}
    >
      {showSpinner ? (
        <ActivityIndicator
          color={spinnerColor}
          size="small"
          style={{ marginRight: 10 }}
        />
      ) : IconLeft ? (
        <IconLeft />
      ) : null}
      <Text className={`text-lg font-bold ${getTextVariantStyle(textVariant)}`}>
        {label}
      </Text>
      {!showSpinner && IconRight ? <IconRight /> : null}
    </TouchableOpacity>
  );
};

export default CustomButton;
