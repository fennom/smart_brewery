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
import { useAppContext } from "@/contexts/AppContext";
import RecipeFrom from "@/components/RecipeForm";
import { useNavigation } from "expo-router";

export default function CreateScreen() {
  const { dispatch } = useAppContext();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const onSave = (temperaturePauses: any[]) => {
    const data = temperaturePauses.filter((i) => i.edited);
    dispatch({ type: "setRecipe", newState: data });
    fetch("http://192.168.1.105/v1/recipe", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({ type: "setRecipe", newState: data });
        navigation.navigate("index");
      })
      .catch((error) => {
        console.error(error);
      });
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
