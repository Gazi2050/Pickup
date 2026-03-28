import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";

export default function RidesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={[]}
        renderItem={() => <View />}
        keyExtractor={(_, index) => index.toString()}
        className="px-5"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: 1,
        }}
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center py-8">
            <Image
              source={images.noResult}
              className="w-40 h-40"
              accessibilityLabel="No rides"
              resizeMode="contain"
            />
            <Text className="text-sm">No recent rides found</Text>
          </View>
        )}
        ListHeaderComponent={
          <Text className="text-2xl font-JakartaBold my-5">All Rides</Text>
        }
      />
    </SafeAreaView>
  );
}
