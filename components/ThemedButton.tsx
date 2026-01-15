import { StyleSheet, useColorScheme, Pressable } from "react-native";
import React, { PropsWithChildren, useState } from "react";
import { ThemedText } from "./ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

type ThemedButtonProps = PropsWithChildren & {
  icon?: string;
  disabled?: boolean;
  onPress: () => void;
  onDeleted?: () => void;
};

export default function ThemedButton({
  icon,
  onPress,
  disabled = false,
  children,
}: ThemedButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        paddingLeft: icon ? 8 : 16,
        paddingRight: 16,
        paddingTop: 4,
        paddingBottom: 5,
        backgroundColor: "#242424",
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#2D2D2D",
        flexDirection: "row",
        alignItems: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon && (
        <MaterialCommunityIcons
          style={{ marginRight: 4 }}
          name={icon}
          size={18}
          color={"#FCFCFC"}
        />
      )}
      <ThemedText
        style={{
          fontFamily: "Manrope_400Regular",
          color: "#C1C1C1",
        }}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
