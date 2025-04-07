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

export default function HomeScreen() {
  const [showPumpRangeModal, setShowPumpRangeModal] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const {
    isOnline,
    info: {
      mode,
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
                  label="Температура"
                  value={temperature.toFixed(1) + "°"}
                  subValue={targetTemperature + "°"}
                  note="Текущая/Целевая"
                  type="blue"
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
                disabled={!isOnline}
              ></Card>
            </View>
            <View style={{ width: "50%", paddingLeft: 4, gap: 8 }}>
              <Card
                icon="lightning-bolt-outline"
                label="Тэн"
                value={heatLimit.toString()}
                valueSymbol="%"
                note="Мощность тэна в %"
                disabled={!isOnline}
              ></Card>
              <Card
                icon="timer-outline"
                label="Время"
                value={toHmsTimeString(timeToEnd)}
                note="Оставшееся время"
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
              Этапы
              <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
                {" затерания"}
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
                  {mode === "idle" ? "Сброс" : "Стоп"}
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
                {isPaused || mode === "idle" ? "Старт" : "Пауза"}
              </ThemedButton>
            </View>
          </View>
          {!recipe && (
            <View
              style={{
                height: "auto",
                alignItems: "center",
                justifyContent: "center",
                flex: 2,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 12,
                  fontFamily: "Manrope_300Light",
                  color: "#C1C1C1",
                  paddingBottom: 8,
                }}
              >
                Рецепт не выбран
              </ThemedText>
              <View>
                <ThemedButton
                  onPress={() => router.navigate("/create")}
                  disabled={!isOnline}
                >
                  Добавить рецепт
                </ThemedButton>
              </View>
            </View>
          )}
          {recipe && (
            <View
              style={{
                height: "auto",
                flex: 2,
              }}
            >
              <RecipeFrom
                value={recipe}
                immediateSaving={true}
                onSave={(temperatures: any[]) => setRecipe(temperatures)}
              />
            </View>
          )}
        </View>
        <RangeModal
          isVisible={showPumpRangeModal}
          label="Насос"
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
