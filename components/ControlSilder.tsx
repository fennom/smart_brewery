import { View, StyleSheet, Text, useColorScheme } from "react-native";
import React, { useState, useEffect } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";

type Props = {
  currentValue: number | undefined;
  targetValue: number | undefined;
  position: "right" | "left" | undefined;
  symbol: string;
  onValueChange: (value: number) => void;
};

export default function ControlSilder({
  onValueChange,
  position = "right",
  currentValue,
  targetValue,
  symbol,
}: Props) {
  const colorScheme = useColorScheme();
  const [chagneTarget, setChagneTarget] = useState(targetValue ?? 0);
  const dragY = useSharedValue(0);
  const maxHeihgt = useSharedValue(0);

  const handlerOnLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    console.log(height);
    maxHeihgt.value = height - 5;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      console.log(maxHeihgt.value);

      let changeY = dragY.value + event.changeY;
      if (changeY > 0) changeY = 0;
      else if (changeY < maxHeihgt.value * -1) changeY = maxHeihgt.value * -1;
      dragY.value = changeY;
      setChagneTarget(Math.round((Math.abs(changeY) / maxHeihgt.value) * 100));
    })
    .onEnd((event) => {
      dragY.value = ((chagneTarget ?? 0) / 100) * maxHeihgt.value * -1;
      onValueChange(chagneTarget);
    });

  useEffect(() => {
    dragY.value = ((targetValue ?? 0) / 100) * maxHeihgt.value * -1;
    setChagneTarget(targetValue ?? 0);
  }, [targetValue]);

  return (
    <View
      style={[
        styles.sliderContainer,
        { flexDirection: position === "right" ? "row" : "row-reverse" },
      ]}
    >
      <View style={styles.sliderBg} onLayout={handlerOnLayout}>
        <GestureDetector gesture={pan}>
          <Animated.View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "rgba(250, 174, 23, 0.3)",
              position: "absolute",
              left: -12,
              bottom: -15,
              padding: 10,
              zIndex: 2,
              transform: [
                {
                  translateY: dragY,
                },
              ],
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                boxShadow: "rgba(0, 0, 0, 0.5) 0px 1px 3px",
                backgroundColor: "rgb(250, 174, 23)",
              }}
            ></View>
            <View
              style={[
                {
                  position: "absolute",
                  borderRadius: 5,
                  backgroundColor: "#302F3C",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  top: -3,
                  zIndex: 10,
                },
                position === "right"
                  ? {
                      right: 35,
                    }
                  : {
                      left: 35,
                    },
              ]}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: "#fff",
                }}
              >
                {chagneTarget}
                {symbol}
              </Text>
              <View
                style={[
                  {
                    width: 10,
                    height: 10,
                    position: "absolute",
                    backgroundColor: "#302F3C",
                    top: 13,
                    transform: [
                      {
                        rotate: "45deg",
                      },
                    ],
                  },
                  position === "right"
                    ? {
                        right: -5,
                      }
                    : {
                        left: -5,
                      },
                ]}
              ></View>
            </View>
          </Animated.View>
        </GestureDetector>
        {currentValue !== undefined && (
          <Animated.View
            style={[
              styles.sliderValue,
              {
                backgroundColor: Colors[colorScheme ?? "light"].primary,
                height: maxHeihgt,
                zIndex: 2,
              },
            ]}
          >
            <View
              style={[
                {
                  position: "absolute",
                  borderRadius: 5,
                  backgroundColor: Colors[colorScheme ?? "light"].icon,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  top: -18,
                },
                position === "left"
                  ? {
                      right: 35,
                    }
                  : {
                      left: 21,
                    },
              ]}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: "#fff",
                }}
              >
                {currentValue}
                {symbol}
              </Text>
              <View
                style={[
                  {
                    width: 10,
                    height: 10,
                    position: "absolute",
                    backgroundColor: "#302F3C",

                    top: 13,
                    transform: [
                      {
                        rotate: "45deg",
                      },
                    ],
                  },
                  position === "left"
                    ? {
                        right: -5,
                      }
                    : {
                        left: -5,
                      },
                ]}
              ></View>
            </View>
          </Animated.View>
        )}
        <Animated.View
          style={[
            styles.sliderValue,
            currentValue !== undefined
              ? {
                  backgroundColor: Colors[colorScheme ?? "light"].secondary,
                  height: maxHeihgt,
                  zIndex: 1,
                }
              : {
                  backgroundColor: Colors[colorScheme ?? "light"].primary,
                  height: maxHeihgt,
                },
          ]}
        ></Animated.View>
      </View>
      <View style={styles.sliderLabels}>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          —
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          –
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          —
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          –
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          —
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          –
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          —
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          –
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          —
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          –
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          —
        </ThemedText>
      </View>
      <View style={styles.sliderLabels}>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          100
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          80
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          60
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          40
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          20
        </ThemedText>
        <ThemedText
          type="label"
          style={[
            styles.sliderText,
            { textAlign: position === "right" ? "left" : "right" },
          ]}
        >
          0
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderBg: {
    backgroundColor: "#eee",
    width: 5,
    borderRadius: 3,
  },
  sliderValue: {
    position: "absolute",
    backgroundColor: "rgb(250, 174, 23)",
    width: 5,
    left: 0,
    zIndex: 1,
    borderRadius: 3,
  },
  sliderContainer: {
    height: "100%",
    flex: 1,
  },
  sliderLabels: {
    flex: 1,
    flexBasis: 21,
    justifyContent: "space-between",
    flexGrow: 0,
    position: "relative",
  },
  sliderText: {
    flexBasis: "auto",
  },
});
