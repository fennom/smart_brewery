import React, { useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { PropsWithChildren } from "react";
import { Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";
import i18n from "../i18n";

type Props = PropsWithChildren<{
  isVisible: boolean;
  heightSheet?: number;
  onCancel: () => void;
  onSave?: () => void;
  lightColor?: string;
  darkColor?: string;
  showSaveButton?: boolean;
}>;

export default function Sheet({
  isVisible,
  heightSheet = 300,
  onCancel,
  onSave,
  children,
  lightColor,
  darkColor,
  showSaveButton = true,
}: Props) {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "card"
  );

  return (
    <>
      {isVisible && (
        <>
          <AnimatedPressable
            style={styles.backdrop}
            entering={FadeIn}
            exiting={FadeOut}
            onPress={onCancel}
          />
          <Animated.View
            entering={SlideInDown.springify().damping(15)}
            exiting={SlideOutDown}
            style={[
              styles.container,
              { backgroundColor: backgroundColor, height: heightSheet },
            ]}
          >
            {children}
            <View
              style={[styles.controls, { backgroundColor: backgroundColor }]}
            >
              <Pressable style={styles.button} onPress={onCancel}>
                <ThemedText>{i18n.t("main.cancel")}</ThemedText>
              </Pressable>
              {showSaveButton && (
                <Pressable style={styles.button} onPress={onSave}>
                  <ThemedText>{i18n.t("main.save")}</ThemedText>
                </Pressable>
              )}
            </View>
          </Animated.View>
        </>
      )}
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
    width: "100%",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    padding: 16,
    zIndex: 2,
    bottom: 0,
    left: 0,
    right: 0,
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
