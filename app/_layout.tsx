import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  useFonts,
} from "@expo-google-fonts/manrope";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import React, { useContext } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import {
  GestureHandlerRootView,
  Pressable,
  TouchableOpacity,
} from "react-native-gesture-handler";
import i18n from "@/i18n";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { initializeWebSocket } from "@/lib/websocketManager";
import GlobalEffects from "@/components/GlobalEffects";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

initializeWebSocket();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GlobalEffects />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="manual" options={{ headerShown: false }} />
          <Stack.Screen
            name="create"
            options={{
              title: i18n.t("main.create"),
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors[colorScheme ?? "light"].background,
              },
              headerTintColor: Colors[colorScheme ?? "light"].text,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: i18n.t("main.settings"),
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors[colorScheme ?? "light"].background,
              },
              headerTintColor: Colors[colorScheme ?? "light"].text,
            }}
          />
          <Stack.Screen
            name="recipes"
            options={{
              title: i18n.t("main.recipes"),
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors[colorScheme ?? "light"].background,
              },
              headerTintColor: Colors[colorScheme ?? "light"].text,
              headerRight: () => (
                <TouchableOpacity
                  disabled={false}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => null}
                >
                  <MaterialCommunityIcons name="plus" size={28} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="recipe/[id]"
            options={{
              title: i18n.t("main.recipes"),
              headerShown: true,
              headerStyle: {
                backgroundColor: Colors[colorScheme ?? "light"].background,
              },
              headerTintColor: Colors[colorScheme ?? "light"].text,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
