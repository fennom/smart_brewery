import React from "react";
import { StyleSheet, useColorScheme, StatusBar } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import RecipeFrom from "@/components/RecipeForm";
import { useRouter } from "expo-router";
import useAppStore from "@/lib/useAppStore";

export default function CreateScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const setRecipe = useAppStore((state) => state.fetchRecipe);

  const onSave = async (temperaturePauses: any[]) => {
    alert("Asdsds");
    const data = temperaturePauses.filter((i) => i.edited);
    await setRecipe(data);
    router.navigate("/");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
        edges={["top"]}
      >
        <RecipeFrom onSave={onSave} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight,
  },
});
