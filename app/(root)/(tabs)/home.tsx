import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-general-500 px-5">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-JakartaBold text-center mb-2">
          Home
        </Text>
        <Text className="text-general-200 font-Jakarta text-center mb-8">
          Main app experience will live here.
        </Text>
        <TouchableOpacity
          onPress={async () => {
            await signOut();
            router.replace("/(auth)/sign-in");
          }}
          className="bg-primary-500 rounded-full px-8 py-3"
        >
          <Text className="text-white font-JakartaSemiBold">Sign out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
