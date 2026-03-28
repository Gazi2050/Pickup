import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons, images } from "@/constants";

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="bg-general-500 flex-1">
      <ScrollView
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex flex-row items-center justify-between my-5">
          <Text className="text-2xl font-JakartaExtraBold flex-1 pr-2">
            Welcome {user?.firstName ?? "there"} 👋
          </Text>
          <TouchableOpacity
            onPress={handleSignOut}
            className="justify-center items-center w-10 h-10 rounded-full bg-white"
            accessibilityLabel="Sign out"
          >
            <Image source={icons.out} className="w-4 h-4" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-2xl p-4 shadow-md shadow-neutral-300 mb-5">
          <View className="flex flex-row items-center mb-2">
            <Image source={icons.search} className="w-6 h-6 mr-2" />
            <Text className="text-lg font-JakartaSemiBold">Where to?</Text>
          </View>
          <Text className="text-general-200 font-Jakarta text-sm">
            Search and ride booking will be available here in a future update.
          </Text>
        </View>

        <View className="bg-white rounded-2xl overflow-hidden mb-5 shadow-md shadow-neutral-300">
          <View className="h-[200px] bg-general-700 items-center justify-center px-6">
            <Text className="text-xl font-JakartaBold text-center mb-1">
              Your ride area
            </Text>
            <Text className="text-general-200 font-Jakarta text-sm text-center">
              Live map and current location will appear here when connected.
            </Text>
          </View>
        </View>

        <Text className="text-xl font-JakartaBold mt-2 mb-3">Recent rides</Text>
        <View className="flex flex-col items-center justify-center py-6">
          <Image
            source={images.noResult}
            className="w-40 h-40"
            accessibilityLabel="No recent rides"
            resizeMode="contain"
          />
          <Text className="text-sm text-general-200">No recent rides found</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
