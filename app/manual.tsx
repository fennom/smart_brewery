import React, { useState } from "react";
import CircleButton from "@/components/CircleButton";
import { StyleSheet, View, Text, useColorScheme } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "@/components/Card";
import { useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import RangeModal from "@/components/RangeModal";
import useAppStore from "@/lib/useAppStore";
import ModeMenu from "@/components/ModeMenu";
import ConnectionCard from "@/components/ConnectionCard";

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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{}}>
              <ThemedText
                style={{ fontSize: 24, fontFamily: "Manrope_300Light" }}
              >
                Выбирите {"\n"}
              </ThemedText>
              <ThemedText
                style={{ fontSize: 24, fontFamily: "Manrope_500Medium" }}
              >
                Режим работы
              </ThemedText>
            </Text>
            <Pressable onPress={() => router.navigate("/settings")}>
              <MaterialCommunityIcons
                name="cog-outline"
                color={Colors[colorScheme ?? "light"].text}
                size={24}
              />
            </Pressable>
          </View>
          <ModeMenu selected="manual" />
          <View style={{ flexDirection: "row", paddingBottom: 32 }}>
            <View style={{ width: "50%", paddingRight: 4, gap: 8 }}>
              {isOnline && (
                <Card
                  icon="thermometer"
                  label="Температура"
                  value={temperature.toFixed(1) + "°"}
                  subValue={targetTemperature + "°"}
                  note="Текущая/Целевая"
                  type="blue"
                  onPress={() => setShowTempRangeModal(true)}
                ></Card>
              )}
              {!isOnline && <ConnectionCard></ConnectionCard>}
              <Card
                icon="pump"
                label="Насос"
                value={pumpLimit.toString()}
                valueSymbol="%"
                note="Мощность насоса в %"
                isToggle={true}
                isEnable={isPumpEnabled}
                onPress={() => setShowPumpRangeModal(true)}
                onTogglePress={() => togglePumpSwitch()}
              ></Card>
            </View>
            <View style={{ width: "50%", paddingLeft: 4, gap: 8 }}>
              <Card
                icon="lightning-bolt-outline"
                label="Тэн"
                value={heatLimit.toString()}
                valueSymbol="%"
                note="Мощность тэна в %"
                onPress={() => setShowHeatRangeModal(true)}
              ></Card>
              <Card
                icon="timer-outline"
                label="Время"
                value={toHmsTimeString(timeToEnd)}
                note="Оставшееся время"
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
              Этапы
              <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
                {" затерания"}
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
                Стоп
              </ThemedButton>
            </View>
          </View>
        </View>
        <RangeModal
          isVisible={showTempRangeModal}
          label="Температура"
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
          label="Тэн"
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
          label="Насос"
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
