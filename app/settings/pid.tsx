import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  useColorScheme,
  StatusBar,
  Pressable,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import SettingItem from "@/components/SettingItem";
import PidSettingModal from "@/components/PidSettingModal";
import RangeModal from "@/components/RangeModal";
import { Alert, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import TextModal from "@/components/TextModal";
import ConnectionSettingModal from "@/components/ConnectionSettingModal";
import useAppStore from "@/lib/useAppStore";
import i18n from "../../i18n";
import { WiFiService } from "@/lib/WiFiManager";
import { ThemedText } from "@/components/ThemedText";

export default function SettingsScreen() {
  const {
    isOnline,
    settings: { ki, kp, kd, sensorDiff, boilingPoint },
    isFetcheSettings,
  } = useAppStore();
  const colorScheme = useColorScheme();

  const [selectKp, setSelectKp] = useState<number>(0);
  const [selectKi, setSelectKi] = useState<number>(0);
  const [selectKd, setSelectKd] = useState<number>(0);

  const setPid = useAppStore((state) => state.fetchPidConfig);

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: Colors[colorScheme ?? "light"].background,
      },
    ],
    [colorScheme]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={containerStyle} edges={["top"]}>
        <View
          style={{
            height: 30,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ThemedText
            style={{
              fontFamily: "Manrope_300Light",
              fontSize: 12,
              color: "#C1C1C1",
              paddingBottom: 8,
              textAlign: "center",
            }}
          >
            {i18n.t("pid.title")}
          </ThemedText>
        </View>
        <Pressable
          onPress={() => console.log("kp")}
          style={{
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 8,
          }}
        >
          <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
            {i18n.t("pid.proportional")}
          </ThemedText>
          <ThemedText style={{ flex: 1, fontFamily: "Manrope_500Medium" }}>
            {kp.toFixed(3)}
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => console.log("ki")}
          style={{
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 8,
          }}
        >
          <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
            {i18n.t("pid.integral")}
          </ThemedText>
          <View style={{ flex: 1 }}>
            <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
              {ki.toFixed(3)}
            </ThemedText>
          </View>
        </Pressable>
        <Pressable
          onPress={() => console.log("kd")}
          style={{
            alignSelf: "stretch",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 8,
          }}
        >
          <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
            {i18n.t("pid.derivative")}
          </ThemedText>
          <ThemedText style={{ flex: 1, fontFamily: "Manrope_500Medium" }}>
            {kd.toFixed(3)}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {},
  loader: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  indicator: {
    flexDirection: "row",
    alignSelf: "center",
    flexGrow: 0,
    padding: 16,
    borderRadius: 8,
  },
});
