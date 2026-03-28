import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import { ReactNativeModal } from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";

const HERO_EXPANDED = 250;
const HERO_COLLAPSED = 88;

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default" as "default" | "pending" | "failed",
    error: "",
    code: "",
  });
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const passwordOffsetInForm = useRef(0);
  const passwordFieldFocused = useRef(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const heroHeight = keyboardOpen ? HERO_COLLAPSED : HERO_EXPANDED;
  const contentPaddingBottom = Math.max(40, keyboardHeight + 48);

  const scrollPasswordIntoView = (delayMs?: number) => {
    const delay =
      delayMs ?? (Platform.OS === "ios" ? 160 : 260);
    setTimeout(() => {
      const collapseNudge = keyboardOpen ? 88 : 0;
      const targetY = Math.max(
        0,
        heroHeight +
          passwordOffsetInForm.current -
          12 +
          collapseNudge,
      );
      scrollRef.current?.scrollTo({
        y: targetY,
        animated: true,
      });
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

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setSignUpLoading(true);
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification((v) => ({
        ...v,
        state: "pending",
      }));
    } catch (err: unknown) {
      console.log(JSON.stringify(err, null, 2));
      const e = err as { errors?: { longMessage: string }[] };
      Alert.alert("Error", e.errors?.[0]?.longMessage ?? "Sign up failed");
    } finally {
      setSignUpLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    setVerifyLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        try {
          await fetchAPI("/(api)/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              clerkId: completeSignUp.createdUserId,
            }),
          });
        } catch (apiErr) {
          console.error("User sync failed:", apiErr);
        }
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification((v) => ({
          ...v,
          state: "default",
          code: "",
          error: "",
        }));
        setShowSuccessModal(true);
      } else {
        setVerification((v) => ({
          ...v,
          error: "Verification failed. Please try again.",
          state: "failed",
        }));
      }
    } catch (err: unknown) {
      const e = err as { errors?: { longMessage: string }[] };
      setVerification((v) => ({
        ...v,
        error: e.errors?.[0]?.longMessage ?? "Verification failed",
        state: "failed",
      }));
    } finally {
      setVerifyLoading(false);
    }
  };

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
            Create Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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
            title="Sign Up"
            loadingTitle="Creating account…"
            loading={signUpLoading}
            onPress={onSignUpPress}
            className="mt-6"
          />
          <OAuth
            flow="sign-up"
            disabled={signUpLoading || verifyLoading}
          />

          <Link
            href="/(auth)/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            Already have an account?{" "}
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>

        <ReactNativeModal isVisible={verification.state === "pending"}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We&apos;ve sent a verification code to {form.email}.
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification((prev) => ({ ...prev, code }))
              }
            />
            {verification.error ? (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            ) : null}
            <CustomButton
              title="Verify Email"
              loadingTitle="Verifying…"
              loading={verifyLoading}
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>

        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => router.push("/(root)/(tabs)/home")}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
