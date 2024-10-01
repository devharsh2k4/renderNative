import { Link, Stack } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Pressable } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Counter",
          headerRight: () => (
            <Link href="counter/history" asChild>
            <Pressable hitSlop={20}>
            <FontAwesome5 name="history" size={24} color="black" />
            </Pressable>
            </Link>
          ),
        }}
      />
    </Stack>
  );
}
