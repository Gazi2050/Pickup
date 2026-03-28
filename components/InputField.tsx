import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

import type { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  showPasswordToggle = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  const [revealPassword, setRevealPassword] = useState(false);
  const isPasswordToggle = secureTextEntry && showPasswordToggle;
  const effectiveSecure = isPasswordToggle ? !revealPassword : secureTextEntry;

  return (
    <View className={`my-2 w-full ${className ?? ""}`}>
      <Text className={`text-lg font-JakartaSemiBold mb-3 ${labelStyle ?? ""}`}>
        {label}
      </Text>
      <View
        className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500 ${containerStyle ?? ""}`}
      >
        {icon ? (
          <Image source={icon} className={`w-6 h-6 ml-4 ${iconStyle ?? ""}`} />
        ) : null}
        <TextInput
          className={`rounded-full p-4 font-JakartaSemiBold text-[15px] flex-1 ${inputStyle ?? ""} text-left`}
          secureTextEntry={effectiveSecure}
          {...props}
        />
        {isPasswordToggle ? (
          <Pressable
            onPress={() => setRevealPassword((v) => !v)}
            className="pr-4 pl-1 py-3 active:opacity-70"
            accessibilityLabel={
              revealPassword ? "Hide password" : "Show password"
            }
            accessibilityRole="button"
          >
            <Ionicons
              name={revealPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#737373"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

export default InputField;
