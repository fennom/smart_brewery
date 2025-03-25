import { View, StyleSheet, useColorScheme, Pressable } from "react-native";
import React, { PropsWithChildren, useState } from "react";
import { ThemedText } from "./ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const colorScheme = useColorScheme();
  const [isFocus, setFocus] = useState(false);

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
              color: "#FCFCFC",
              fontSize: 12,
              fontFamily: "Manrope_300Light",
            }}
          >
            {"Темература "}
            <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
              {temp}
            </ThemedText>
            {"° , мощность "}
            <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
              {power}
            </ThemedText>
            %
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
          <MaterialCommunityIcons name="close" size={24} color={"#FCFCFC"} />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({});
