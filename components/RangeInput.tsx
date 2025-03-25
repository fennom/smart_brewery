import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet, TextInput } from "react-native";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Pressable, Switch } from "react-native-gesture-handler";
import Rail from "./slider/Rail";
import RailSelected from "./slider/RailSelected";
import Label from "./slider/Label";
import Notch from "./slider/Notch";
import Thumb from "./slider/Thumb";
import Slider from "crn-range-slider";
import Sheet from "./Sheet";

type Props = PropsWithChildren<{
  value: number;
  symbol?: "gradus" | "percent";
  min: number;
  max: number;
  step?: number;
  onEdite: (value: number) => void;
}>;

export default function RangeInput({
  value,
  symbol,
  min,
  max,
  step = 1,
  onEdite,
}: Props) {
  const increment = () => {
    if (value < max) {
      onEdite(value + step);
    }
  };
  const decrement = () => {
    if (value > min) {
      onEdite(value - step);
    }
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 16 }}>
      <Pressable
        onPress={decrement}
        style={{
          width: 35,
          height: 35,
          backgroundColor: "#242424",
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText
          style={{
            color: "#FCFCFC",
            lineHeight: 35,
            fontFamily: "Manrope_500Medium",
          }}
        >
          -
        </ThemedText>
      </Pressable>
      <Pressable style={{ justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <ThemedText
            style={{
              fontSize: 24,
              lineHeight: 35,
              fontFamily: "Manrope_500Medium",
            }}
          >
            {value?.toFixed(3)}
          </ThemedText>
          {symbol === "gradus" && (
            <ThemedText
              style={{
                fontSize: 24,
                fontFamily: "Manrope_300Light",
              }}
            >
              °
            </ThemedText>
          )}
          {symbol === "percent" && (
            <ThemedText
              style={{
                fontSize: 16,
                lineHeight: 28,
                fontFamily: "Manrope_300Light",
              }}
            >
              %
            </ThemedText>
          )}
        </View>
      </Pressable>
      <Pressable
        onPress={increment}
        style={{
          width: 35,
          height: 35,
          backgroundColor: "#242424",
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText
          style={{
            color: "#FCFCFC",
            fontSize: 24,
            lineHeight: 35,
            fontFamily: "Manrope_500Medium",
          }}
        >
          +
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    height: 300,
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#121212",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    padding: 16,
    zIndex: 2,
  },
  controls: {
    height: 80,
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    fontFamily: "Manrope_400Regular",
    paddingHorizontal: 16,
  },
});
