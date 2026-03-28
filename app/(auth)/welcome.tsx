import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";

export default function WelcomeScreen() {
  const pagerRef = useRef<PagerView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === onboarding.length - 1;

  const goNext = () => {
    if (isLastSlide) {
      router.replace("/(auth)/sign-up");
      return;
    }
    pagerRef.current?.setPage(activeIndex + 1);
  };

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        onPress={() => router.replace("/(auth)/sign-up")}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaBold">Skip</Text>
      </TouchableOpacity>

      <View className="flex-1 w-full">
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          scrollEnabled
          onPageSelected={(e) =>
            setActiveIndex(e.nativeEvent.position)
          }
        >
          {onboarding.map((item) => (
            <View
              key={item.id}
              className="flex items-center justify-center p-5"
            >
              <Image
                source={item.image}
                className="w-full h-[300px]"
                resizeMode="contain"
              />
              <View className="flex flex-row items-center justify-center w-full mt-10">
                <Text className="text-black text-3xl font-bold mx-10 text-center">
                  {item.title}
                </Text>
              </View>
              <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
                {item.description}
              </Text>
            </View>
          ))}
        </PagerView>

        <View className="flex flex-row justify-center items-center py-2">
          {onboarding.map((item, index) => (
            <View
              key={item.id}
              className={`h-[4px] mx-1 rounded-full ${index === activeIndex ? "w-[32px] bg-[#0286FF]" : "w-[32px] bg-[#E2E8F0]"}`}
            />
          ))}
        </View>
      </View>

      <View className="w-full px-5 mt-10 mb-5">
        <CustomButton
          title={isLastSlide ? "Get Started" : "Next"}
          onPress={goNext}
        />
      </View>
    </SafeAreaView>
  );
}
