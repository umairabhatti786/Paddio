import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="signup" />
        <Stack.Screen name="verifyPhone" />
        <Stack.Screen name="login" />

      </Stack>
    </ThemeProvider>
</SafeAreaProvider>
   
  );
}
