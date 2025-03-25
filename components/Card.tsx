import {
  View,
  StyleSheet,
  Text,
  useColorScheme,
  TextInput as ReactInput,
  KeyboardTypeOptions,
  Pressable,
} from "react-native";
import React, { PropsWithChildren, useState } from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

type CardProps = PropsWithChildren & {
  icon: string;
  label: string;
  value: string;
  valueSymbol?: string;
  subValue?: string;
  subValueSymbol?: string;
  note?: string;
  type?: "black" | "blue" | "orange";
  isToggle?: boolean;
  isEnable?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onTogglePress?: (value: boolean) => void;
};

export default function Card({
  icon,
  label,
  value,
  valueSymbol,
  subValue,
  subValueSymbol,
  note,
  type = "black",
  children,
  isToggle = false,
  isEnable = false,
  disabled = false,
  onPress,
  onTogglePress,
}: CardProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <ThemedView
        style={[
          styles.card,
          type === "blue"
            ? { backgroundColor: "#C6F5FA" }
            : type === "orange"
            ? { backgroundColor: "#F8E5A5" }
            : {},
        ]}
      >
        <View style={styles.labelContainer}>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <View
              style={[
                styles.icon,
                type === "blue"
                  ? { backgroundColor: "#BBE7EF", borderColor: "#B6E5EA" }
                  : type === "orange"
                  ? { backgroundColor: "#E9D89C", borderColor: "#E9D89C" }
                  : {},
              ]}
            >
              <MaterialCommunityIcons
                name={icon}
                size={24}
                color={
                  type === "blue" || type === "orange" ? "#131313" : "#FCFCFC"
                }
              />
            </View>
            <ThemedText
              style={[
                styles.label,
                type === "blue" || type === "orange"
                  ? { color: "#131313" }
                  : {},
              ]}
            >
              {label}
            </ThemedText>
          </View>
          {isToggle && (
            <Pressable
              onPress={() => (onTogglePress ? onTogglePress(!isEnable) : null)}
              disabled={disabled}
              style={[styles.icon, { borderWidth: 0 }]}
            >
              <MaterialCommunityIcons
                name="power"
                size={24}
                color={isEnable ? "#EEDCA0" : "#FCFCFC"}
              />
            </Pressable>
          )}
        </View>

        <View>
          <ThemedText
            style={[
              styles.value,
              type === "blue" || type === "orange" ? { color: "#131313" } : {},
            ]}
          >
            {value}
            {valueSymbol && (
              <ThemedText
                style={[
                  styles.valueSymbol,
                  type === "blue" || type === "orange"
                    ? { color: "#131313" }
                    : {},
                ]}
              >
                {valueSymbol}
              </ThemedText>
            )}
            {subValue && (
              <ThemedText
                style={[
                  styles.subValue,
                  type === "blue" || type === "orange"
                    ? { color: "#131313" }
                    : {},
                ]}
              >
                {subValue}
              </ThemedText>
            )}
          </ThemedText>
        </View>

        {note && (
          <ThemedText
            style={[
              styles.note,
              type === "blue" || type === "orange" ? { color: "#131313" } : {},
            ]}
          >
            {note}
          </ThemedText>
        )}

        {children}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    gap: 8,
    padding: 16,
  },
  icon: {
    width: 35,
    height: 35,
    backgroundColor: "#242424",
    borderWidth: 1,
    borderColor: "#2D2F2F",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { fontSize: 12, fontFamily: "Manrope_400Regular" },
  value: {
    height: 34,
    lineHeight: 34,
    fontSize: 32,
    fontFamily: "Manrope_500Medium",
  },
  subValue: {
    lineHeight: 34,
    fontSize: 20,
    fontFamily: "Manrope_400Regular",
  },
  valueSymbol: {
    lineHeight: 34,
    fontSize: 16,
    fontFamily: "Manrope_400Regular",
  },
  note: { fontSize: 12, fontFamily: "Manrope_300Light" },
});
