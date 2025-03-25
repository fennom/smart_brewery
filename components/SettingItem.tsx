import { View, StyleSheet, useColorScheme } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import React, { PropsWithChildren, useState } from "react";
import { ThemedText } from "./ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type SettingProps = PropsWithChildren & {
  icon: string;
  name: string;
  description?: string;
  disabled?: boolean;
  onPress: () => void;
};

export default function SettingItem({
  icon,
  name,
  description,
  onPress,
  disabled = false,
}: SettingProps) {
  return (
    <Pressable
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
        <MaterialCommunityIcons name={icon} size={24} color={"#FCFCFC"} />
      </View>
      <View style={{ flex: 2 }}>
        <ThemedText style={{ fontFamily: "Manrope_400Regular" }}>
          {name}
        </ThemedText>
        {description && (
          <ThemedText
            style={{
              opacity: 0.6,
              fontSize: 12,
              fontFamily: "Manrope_300Light",
            }}
          >
            {description}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
