import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";

type OAuthProps = {
  flow?: "sign-in" | "sign-up";
  disabled?: boolean;
};

const OAuth = ({ flow = "sign-in", disabled = false }: OAuthProps) => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleTitle =
    flow === "sign-up" ? "Sign up with Google" : "Log In with Google";
  const googleLoadingTitle =
    flow === "sign-up" ? "Signing up with Google…" : "Signing in with Google…";

  const handleGoogleSignIn = async () => {
    if (disabled || googleLoading) return;
    setGoogleLoading(true);
    try {
      const result = await googleOAuth(startOAuthFlow);

      if (result.code === "session_exists") {
        Alert.alert("Success", "Session exists. Redirecting to home screen.");
        router.replace("/(root)/(tabs)/home");
        return;
      }

      if (result.success) {
        router.replace("/(root)/(tabs)/home");
        return;
      }

      Alert.alert("Error", result.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title={googleTitle}
        loadingTitle={googleLoadingTitle}
        loading={googleLoading}
        disabled={disabled}
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
