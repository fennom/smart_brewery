import { View, StyleSheet, useColorScheme, Pressable } from "react-native";
import React, { PropsWithChildren, useState } from "react";
import { ThemedText } from "./ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

type ThemedButtonProps = PropsWithChildren & {
  icon?: string;
  disabled?: boolean;
  highlighted?: boolean;
  onPress: () => void;
  onDeleted?: () => void;
};

export default function ThemedButton({
  icon,
  onPress,
  disabled = false,
  highlighted = false,
  children,
}: ThemedButtonProps) {
  const colorScheme = useColorScheme();
  const [isFocus, setFocus] = useState(false);

  const highlightedBackgroundColor = useThemeColor({}, "highlighted");
  const highlightedBorderColor = useThemeColor(
    { dark: "#2D2D2D" },
    "highlighted"
  );

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        alignSelf: "flex-start",
        paddingLeft: icon ? 8 : 16,
        paddingRight: 16,
        paddingTop: 4,
        paddingBottom: 5,
        backgroundColor: highlighted ? highlightedBackgroundColor : "#242424",
        borderRadius: 20,
        borderWidth: 2,
        borderColor: highlighted ? highlightedBorderColor : "#2D2D2D",
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
          color: highlighted ? "#000" : "#C1C1C1",
        }}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
