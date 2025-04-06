import { StyleSheet, useColorScheme, Pressable } from "react-native";
import React, { PropsWithChildren, useState } from "react";
import { ThemedText } from "./ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

type ModeMenuItemProps = PropsWithChildren & {
  icon?: string;
  disabled?: boolean;
  highlighted?: boolean;
  onPress: () => void;
  onDeleted?: () => void;
};

export default function ModeMenuItem({
  icon,
  onPress,
  disabled = false,
  highlighted = false,
  children,
}: ModeMenuItemProps) {
  const colorScheme = useColorScheme();
  const [isFocus, setFocus] = useState(false);

  const highlightedBackgroundColor = useThemeColor({}, "menuHighlighted");
  const highlightedBorderColor = useThemeColor({}, "menuBorderHighlighted");
  const highlightedTextColor = useThemeColor({}, "menuTextHighlighted");
  const borderColor = useThemeColor({}, "menuBorder");
  const backgroundColor = useThemeColor({}, "menu");
  const textColor = useThemeColor({}, "menuText");

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
        backgroundColor: highlighted
          ? highlightedBackgroundColor
          : backgroundColor,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: highlighted ? highlightedBorderColor : borderColor,
        flexDirection: "row",
        alignItems: "center",
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
          color: highlighted ? highlightedTextColor : textColor,
        }}
      >
        {children}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
