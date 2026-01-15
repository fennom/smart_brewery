import { View, Text } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import React from "react";
import { ThemedText } from "./ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

type RecipeItem = {
  no: number;
  name: string;
  disabled?: boolean;
  deletable?: boolean;
  onPress: () => void;
  onDeleted?: () => void;
};

export default function RecipeItem({
  no,
  name,
  onPress,
  disabled = false,
  deletable = false,
  onDeleted,
}: RecipeItem) {
  const color = useThemeColor({}, "icon");

  return (
    <Pressable
      testID="recipe-item"
      disabled={disabled}
      onPress={onPress}
      style={{
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
        opacity: !disabled ? 1 : 0.5,
      }}
    >
      <View
        style={{
          width: 35,
          height: 35,
          backgroundColor: "#242424",
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText style={{ fontFamily: "Manrope_400Regular" }}>
          {no}
        </ThemedText>
      </View>
      <View style={{ flex: 2 }}>
        <ThemedText style={{ fontFamily: "Manrope_400Regular" }}>
          {name}
        </ThemedText>
      </View>
      {deletable && (
        <Pressable onPress={onDeleted} testID="delete-button">
          <MaterialCommunityIcons name="close" size={24} color={color} />
        </Pressable>
      )}
    </Pressable>
  );
}
