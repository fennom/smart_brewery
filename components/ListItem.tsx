import { View, StyleSheet, Pressable } from "react-native";
import React, { PropsWithChildren } from "react";
import { ThemedText } from "./ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "../i18n";
import { useThemeColor } from "@/hooks/useThemeColor";

type ListItemProps = PropsWithChildren & {
  icon?: string;
  name: string;
  temp?: string;
  power?: string;
  time: string;
  disabled?: boolean;
  deletable?: boolean;
  onPress: () => void;
  onDeleted?: () => void;
};

export default function ListItem({
  name,
  temp,
  power,
  time,
  onPress,
  disabled = false,
  deletable = false,
  children,
  onDeleted,
}: ListItemProps) {
  const color = useThemeColor({}, "icon");

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
        {children}
      </View>
      <View style={{ flex: 2 }}>
        <ThemedText style={{ fontFamily: "Manrope_400Regular" }}>
          {name}
        </ThemedText>
        {temp && power && (
          <ThemedText
            style={{
              fontSize: 12,
              fontFamily: "Manrope_300Light",
            }}
          >
            {i18n.t("recipe.temp") + " "}
            <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
              {temp}
            </ThemedText>
            {"° , "}
            {i18n.t("recipe.power") + " "}
            <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
              {power}
            </ThemedText>
            {"%"}
          </ThemedText>
        )}
      </View>
      <View>
        <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
          {time}
          <ThemedText
            style={{
              fontSize: 12,
              fontFamily: "Manrope_300Light",
            }}
          >
            {" мин"}
          </ThemedText>
        </ThemedText>
      </View>
      {deletable && (
        <Pressable onPress={onDeleted}>
          <MaterialCommunityIcons name="close" size={24} color={color} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({});
