import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";

const HERO_EXPANDED = 250;
const HERO_COLLAPSED = 88;

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const passwordOffsetInForm = useRef(0);
  const passwordFieldFocused = useRef(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [signInLoading, setSignInLoading] = useState(false);

  const heroHeight = keyboardOpen ? HERO_COLLAPSED : HERO_EXPANDED;
  const contentPaddingBottom = Math.max(40, keyboardHeight + 48);

  const scrollPasswordIntoView = () => {
    const delay = Platform.OS === "ios" ? 160 : 260;
    setTimeout(() => {
      const collapseNudge = keyboardOpen ? 88 : 0;
      const targetY = Math.max(
        0,
        heroHeight + passwordOffsetInForm.current - 12 + collapseNudge,
      );
      scrollRef.current?.scrollTo({ y: targetY, animated: true });
    }, delay);
  };

  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvt, (e) => {
      setKeyboardOpen(true);
      setKeyboardHeight(e.endCoordinates.height);
      if (passwordFieldFocused.current) {
        const delay = Platform.OS === "ios" ? 140 : 220;
        setTimeout(() => {
          const targetY = Math.max(
            0,
            HERO_COLLAPSED + passwordOffsetInForm.current - 12 + 88,
          );
          scrollRef.current?.scrollTo({ y: targetY, animated: true });
        }, delay);
      }
    });
    const hideSub = Keyboard.addListener(hideEvt, () => {
      setKeyboardOpen(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    setSignInLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(root)/(tabs)/home");
      } else {
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: unknown) {
      console.log(JSON.stringify(err, null, 2));
      const e = err as { errors?: { longMessage: string }[] };
      Alert.alert("Error", e.errors?.[0]?.longMessage ?? "Sign in failed");
    } finally {
      setSignInLoading(false);
    }
  }, [isLoaded, form, signIn, setActive]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 8 : 0}
    >
      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: contentPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
      <View className="flex-1 bg-white">
        <View
          className="relative w-full overflow-hidden"
          style={{ height: heroHeight }}
        >
          <Image
            source={images.signUpCar}
            className="w-full"
            resizeMode="cover"
            style={{ width: "100%", height: heroHeight }}
          />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter email"
            icon={icons.email}
            textContentType="emailAddress"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />

          <View
            onLayout={(e) => {
              passwordOffsetInForm.current = e.nativeEvent.layout.y;
            }}
          >
            <InputField
              label="Password"
              placeholder="Enter password"
              icon={icons.lock}
              secureTextEntry
              showPasswordToggle
              textContentType="password"
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
              onFocus={() => {
                passwordFieldFocused.current = true;
                scrollPasswordIntoView();
              }}
              onBlur={() => {
                passwordFieldFocused.current = false;
              }}
            />
          </View>

          <CustomButton
            title="Sign In"
            loadingTitle="Signing in…"
            loading={signInLoading}
            onPress={onSignInPress}
            className="mt-6"
          />

          <OAuth disabled={signInLoading} />

          <Link
            href="/(auth)/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            Don&apos;t have an account?{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
