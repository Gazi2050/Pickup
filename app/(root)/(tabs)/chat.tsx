import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";

export default function ChatScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white p-5">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <Text className="text-2xl font-JakartaBold">Chat</Text>
        <View className="flex-1 min-h-[280px] justify-center items-center">
          <Image
            source={images.message}
            accessibilityLabel="No messages"
            className="w-full h-40"
            resizeMode="contain"
          />
          <Text className="text-3xl font-JakartaBold mt-3">No Messages Yet</Text>
          <Text className="text-base mt-2 text-center px-7 text-general-200">
            Start a conversation with your friends and family
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
