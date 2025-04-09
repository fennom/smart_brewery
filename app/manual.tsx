import React, { useState } from "react";
import CircleButton from "@/components/CircleButton";
import { StyleSheet, View, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import Card from "@/components/Card";
import { useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import RangeModal from "@/components/RangeModal";
import useAppStore from "@/lib/useAppStore";
import ModeMenu from "@/components/ModeMenu";
import ConnectionCard from "@/components/ConnectionCard";
import HeaderModeMenu from "@/components/HeaderModeMenu";
import i18n from "../i18n";

export default function ManualScreen() {
  const [showPumpRangeModal, setShowPumpRangeModal] = useState<boolean>(false);
  const [showTempRangeModal, setShowTempRangeModal] = useState<boolean>(false);
  const [showHeatRangeModal, setShowHeatRangeModal] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const {
    info: {
      mode,
      isPumpEnabled,
      isPaused,
      temperature,
      targetTemperature,
      heatLimit,
      pumpLimit,
      timeToEnd,
    },
    isOnline,
  } = useAppStore();

  const start = useAppStore((state) => state.fetchStart);
  const stop = useAppStore((state) => state.fetchStop);
  const togglePaused = useAppStore((state) => state.fetchPause);
  const togglePumpSwitch = useAppStore((state) => state.fetchPumpSwitch);
  const setHeatLimit = useAppStore((state) => state.fetchHeatLimit);
  const setPumpLimit = useAppStore((state) => state.fetchPumpLimit);
  const setTargetTemperature = useAppStore(
    (state) => state.fetchTargetTemperature
  );

  const toHmsTimeString = (seconds: number) => {
    const date = new Date(seconds > 0 ? seconds / 60 : 0);
    return [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()]
      .map((val) => String(val).padStart(2, "0"))
      .join(":")
      .replace(/^00:/, "");
  };

  return (
    <SafeAreaProvider
      style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: 16,
          paddingHorizontal: 16,
        }}
        edges={["top"]}
      >
        <View
          style={{
            height: "100%",
          }}
        >
          <HeaderModeMenu />
          <ModeMenu selected="manual" />
          <View style={{ flexDirection: "row", paddingBottom: 32 }}>
            <View style={{ width: "50%", paddingRight: 4, gap: 8 }}>
              {isOnline && (
                <Card
                  icon="thermometer"
                  label={i18n.t("main.temperature.label")}
                  value={temperature.toFixed(1) + "°"}
                  subValue={targetTemperature + "°"}
                  note={i18n.t("main.temperature.note")}
                  type="blue"
                  onPress={() => setShowTempRangeModal(true)}
                ></Card>
              )}
              {!isOnline && <ConnectionCard></ConnectionCard>}
              <Card
                icon="pump"
                label={i18n.t("main.pump.label")}
                value={pumpLimit.toString()}
                valueSymbol="%"
                note={i18n.t("main.pump.note")}
                isToggle={true}
                isEnable={isPumpEnabled}
                onPress={() => setShowPumpRangeModal(true)}
                onTogglePress={() => togglePumpSwitch()}
              ></Card>
            </View>
            <View style={{ width: "50%", paddingLeft: 4, gap: 8 }}>
              <Card
                icon="lightning-bolt-outline"
                label={i18n.t("main.heater.label")}
                value={heatLimit.toString()}
                valueSymbol="%"
                note={i18n.t("main.heater.note")}
                onPress={() => setShowHeatRangeModal(true)}
              ></Card>
              <Card
                icon="timer-outline"
                label={i18n.t("main.time.label")}
                value={toHmsTimeString(timeToEnd)}
                note={i18n.t("main.time.note")}
                isToggle={true}
              ></Card>
            </View>
          </View>
          <View
            style={{
              paddingBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedText style={{ fontFamily: "Manrope_300Light" }}>
              {i18n.t("main.stages")}
              <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
                {i18n.t("main.mashing")}
              </ThemedText>
            </ThemedText>
            <View style={{ flexDirection: "row", gap: 8 }}></View>
          </View>

          <View
            style={{
              height: "auto",
              alignItems: "center",
              justifyContent: "center",
              flex: 2,
            }}
          >
            <View style={{ alignItems: "center", gap: 16 }}>
              <CircleButton
                icon={isPaused || mode === "idle" ? "play" : "pause"}
                onPress={async () =>
                  mode === "idle" ? await start("manual") : togglePaused()
                }
              />

              <ThemedButton icon="stop" onPress={() => stop}>
                {i18n.t("main.controls.stop")}
              </ThemedButton>
            </View>
          </View>
        </View>
        <RangeModal
          isVisible={showTempRangeModal}
          label={i18n.t("main.temperature.label")}
          value={targetTemperature}
          symbol="gradus"
          onCancel={() => {
            setShowTempRangeModal(false);
          }}
          onSave={(saveValue: number) => {
            setShowTempRangeModal(false);
            setTargetTemperature(saveValue);
          }}
        ></RangeModal>
        <RangeModal
          isVisible={showHeatRangeModal}
          label={i18n.t("main.heater.label")}
          value={heatLimit}
          symbol="percent"
          onCancel={() => {
            setShowHeatRangeModal(false);
          }}
          onSave={(saveValue: number) => {
            setShowHeatRangeModal(false);
            setHeatLimit(saveValue);
          }}
        ></RangeModal>
        <RangeModal
          isVisible={showPumpRangeModal}
          label={i18n.t("main.pump.label")}
          value={pumpLimit}
          symbol="percent"
          onCancel={() => {
            setShowPumpRangeModal(false);
          }}
          onSave={(saveValue: number) => {
            setShowPumpRangeModal(false);
            setPumpLimit(saveValue);
          }}
        ></RangeModal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  column: { flexGrow: 1, flexShrink: 0, gap: 8 },
});
