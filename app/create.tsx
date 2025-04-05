import React, { useState, useContext } from "react";
import TextInput from "@/components/TextInput";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  useColorScheme,
  StatusBar,
  Pressable,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import RecipeFrom from "@/components/RecipeForm";
import { useNavigation } from "expo-router";
import useAppStore from "@/lib/useAppStore";

export default function CreateScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const setRecipe = useAppStore((state) => state.fetchRecipe);

  const onSave = async (temperaturePauses: any[]) => {
    alert("Asdsds");
    const data = temperaturePauses.filter((i) => i.edited);
    await setRecipe(data);
    navigation.navigate("index");
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
