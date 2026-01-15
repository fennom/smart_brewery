import React, { useState } from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import Card from "@/components/Card";
import { useRouter } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import RecipeFrom from "@/components/RecipeForm";
import RangeModal from "@/components/RangeModal";
import useAppStore from "@/lib/useAppStore";
import ModeMenu from "@/components/ModeMenu";
import ConnectionCard from "@/components/ConnectionCard";
import HeaderModeMenu from "@/components/HeaderModeMenu";
import i18n from "../i18n";

export default function HomeScreen() {
  const [showPumpRangeModal, setShowPumpRangeModal] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const {
    isOnline,
    info: {
      mode,
      step,
      isPumpEnabled,
      isPaused,
      isNeedConfirm,
      temperature,
      targetTemperature,
      heatLimit,
      pumpLimit,
      recipe,
      timeToEnd,
    },
  } = useAppStore();

  const start = useAppStore((state) => state.fetchStart);
  const stop = useAppStore((state) => state.fetchStop);
  const togglePaused = useAppStore((state) => state.fetchPause);
  const toggleConfirme = useAppStore((state) => state.fetchConfirme);
  const togglePumpSwitch = useAppStore((state) => state.fetchPumpSwitch);
  const setPumpLimit = useAppStore((state) => state.fetchPumpLimit);
  const setRecipe = useAppStore((state) => state.fetchRecipe);

  const toHmsTimeString = (seconds: number) => {
    const date = new Date(seconds > 0 ? seconds : 0);
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
          <ModeMenu selected="auto" />
          <View style={{ flexDirection: "row", paddingBottom: 32 }}>
            <View style={{ width: "50%", paddingRight: 4, gap: 8 }}>
              {isOnline && (
                <Card
                  icon="thermometer"
                  label={i18n.t("main.temperature.label")}
                  value={temperature?.toFixed(1) + "°"}
                  subValue={targetTemperature + "°"}
                  note={i18n.t("main.temperature.note")}
                  type="blue"
                ></Card>
              )}
              {!isOnline && <ConnectionCard></ConnectionCard>}
              <Card
                icon="pump"
                label={i18n.t("main.pump.label")}
                value={pumpLimit?.toString() ?? 0}
                valueSymbol="%"
                note={i18n.t("main.pump.note")}
                isToggle={true}
                isEnable={isPumpEnabled}
                onPress={() => setShowPumpRangeModal(true)}
                onTogglePress={() => togglePumpSwitch()}
                disabled={!isOnline}
              ></Card>
            </View>
            <View style={{ width: "50%", paddingLeft: 4, gap: 8 }}>
              <Card
                icon="lightning-bolt-outline"
                label={i18n.t("main.heater.label")}
                value={heatLimit?.toString() ?? 0}
                valueSymbol="%"
                note={i18n.t("main.heater.note")}
                disabled={!isOnline}
              ></Card>
              <Card
                icon="timer-outline"
                label={i18n.t("main.time.label")}
                value={toHmsTimeString(timeToEnd)}
                note={i18n.t("main.time.note")}
                disabled={!isOnline}
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
            <View style={{ flexDirection: "row", gap: 8 }}>
              {recipe && (
                <ThemedButton
                  icon={mode === "idle" ? "close" : "stop"}
                  onPress={() => {
                    stop();
                  }}
                >
                  {mode === "idle"
                    ? i18n.t("main.controls.reset")
                    : i18n.t("main.controls.stop")}
                </ThemedButton>
              )}

              <ThemedButton
                icon={
                  isPaused || isNeedConfirm || mode === "idle"
                    ? "play"
                    : "pause"
                }
                onPress={async () => {
                  if (mode === "idle") {
                    await start("auto");
                  } else if (isNeedConfirm) {
                    toggleConfirme();
                    console.log("fetchState");
                  } else {
                    togglePaused();
                  }
                }}
                disabled={!recipe}
              >
                {isPaused || mode === "idle"
                  ? i18n.t("main.controls.start")
                  : i18n.t("main.controls.pause")}
              </ThemedButton>
            </View>
          </View>
          {!recipe && (
            <View
              style={{
                height: "auto",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                flex: 2,
              }}
            >
              <ThemedText
                darkColor="#C1C1C1"
                style={{
                  fontSize: 12,
                  fontFamily: "Manrope_300Light",
                  paddingBottom: 8,
                }}
              >
                {i18n.t("main.recipe.notSelected")}
              </ThemedText>
              <ThemedButton
                onPress={() => router.navigate("/create")}
                disabled={!isOnline}
              >
                {i18n.t("main.recipe.add")}
              </ThemedButton>
              <ThemedText
                darkColor="#C1C1C1"
                style={{
                  fontSize: 12,
                  fontFamily: "Manrope_300Light",

                  paddingBottom: 8,
                }}
              >
                {i18n.t("main.recipe.or")}
              </ThemedText>

              <ThemedButton
                icon={"receipt"}
                onPress={() => {
                  router.navigate("/recipes");
                }}
                disabled={!isOnline}
              >
                {i18n.t("main.recipe.list")}
              </ThemedButton>
            </View>
          )}
          {recipe && (
            <View
              style={{
                height: "auto",
                flex: 2,
                marginHorizontal: -16,
                marginTop: -16,
              }}
            >
              <RecipeFrom
                value={recipe}
                immediateSaving={true}
                onSave={(temperatures: any[]) => setRecipe(temperatures)}
                showOnlyEdited={true}
                step={step}
              />
            </View>
          )}
        </View>
        <RangeModal
          isVisible={showPumpRangeModal}
          label={i18n.t("main.pump.label")}
          value={pumpLimit}
          symbol="percent"
          onCancel={() => {
            setShowPumpRangeModal(false);
          }}
          onSave={async (saveValue: number) => {
            setShowPumpRangeModal(false);
            await setPumpLimit(saveValue);
          }}
        ></RangeModal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  column: { flexGrow: 1, flexShrink: 0, gap: 8 },
});
