import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { Pressable } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = PropsWithChildren<{
  isVisible: boolean;
  heightSheet?: number;
  onCancel: () => void;
  onSave: () => void;
  lightColor?: string;
  darkColor?: string;
}>;

export default function Sheet({
  isVisible,
  heightSheet = 300,
  onCancel,
  onSave,
  children,
  lightColor,
  darkColor,
}: Props) {
  const duration = 500;
  const height = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(isVisible ? 0 : 1, { duration })
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isVisible
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "card"
  );

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onCancel} />
      </Animated.View>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[
          { backgroundColor },
          styles.container,
          sheetStyle,
          { height: heightSheet },
        ]}
      >
        {children}
        <View style={styles.controls}>
          <Pressable style={styles.button} onPress={onCancel}>
            <ThemedText>Отменить</ThemedText>
          </Pressable>
          <Pressable style={styles.button} onPress={onSave}>
            <ThemedText>Сохранить</ThemedText>
          </Pressable>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

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
