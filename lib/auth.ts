import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

import { fetchAPI } from "@/lib/fetch";

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

export const googleOAuth = async (
  startOAuthFlow: (args: { redirectUrl: string }) => Promise<{
    createdSessionId: string | null;
    setActive?: (args: { session: string }) => Promise<void>;
    signUp?: {
      createdUserId: string | null;
      firstName?: string | null;
      lastName?: string | null;
      emailAddress?: string | null;
    };
  }>,
) => {
  try {
    const { createdSessionId, setActive, signUp } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
    });

    if (createdSessionId) {
      if (setActive) {
        await setActive({ session: createdSessionId });

        if (signUp?.createdUserId) {
          await fetchAPI("/(api)/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: `${signUp.firstName ?? ""} ${signUp.lastName ?? ""}`.trim(),
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }

        return {
          success: true,
          code: "success" as const,
          message: "You have successfully signed in with Google",
        };
      }
    }

    return {
      success: false,
      code: undefined,
      message: "An error occurred while signing in with Google",
    };
  } catch (err: unknown) {
    console.error(err);
    const e = err as { code?: string; errors?: { longMessage?: string }[] };
    return {
      success: false,
      code: e.code,
      message: e?.errors?.[0]?.longMessage ?? "OAuth failed",
    };
  }
};
