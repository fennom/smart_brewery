import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface FloatingButtonProps {
  onPress: () => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export default function FloatingButton({ onPress, icon }: FloatingButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <Animated.View
      style={[styles.container, { bottom: StatusBar.currentHeight ?? 0 + 32 }]}
    >
      <TouchableOpacity onPress={onPress}>
        <ThemedView style={[styles.button, { backgroundColor: "#000" }]}>
          <MaterialCommunityIcons name={icon} size={38} color="white" />
        </ThemedView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 32,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontFamily: "Manrope_500Medium",
    fontSize: 16,
  },
});
