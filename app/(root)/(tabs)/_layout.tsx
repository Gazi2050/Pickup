import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0286FF",
        tabBarInactiveTintColor: "#858585",
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>⌂</Text>,
        }}
      />
    </Tabs>
  );
}
