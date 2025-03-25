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
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "@/contexts/AppContext";
import RecipeFrom from "@/components/RecipeForm";

export default function CreateScreen() {
  const { dispatch } = useAppContext();

  return (
    <SafeAreaProvider>
      <SafeAreaView></SafeAreaView>
    </SafeAreaProvider>
  );
}
