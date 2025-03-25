import React, { useState } from "react";
import CircleButton from "@/components/CircleButton";
import ControlSlider from "@/components/ControlSilder";
import {
  Image,
  StyleSheet,
  View,
  Text,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Pressable, Switch } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import Card from "@/components/Card";
import { useAppContext } from "@/contexts/AppContext";
import { Link, useNavigation } from "expo-router";
import ListItem from "@/components/ListItem";
import Data from "@/components/Data";
import ThemedButton from "@/components/ThemedButton";
import RecipeFrom from "@/components/RecipeForm";
import RangeModal from "@/components/RangeModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ManualScreen() {
  const [showPumpRangeModal, setShowPumpRangeModal] = useState<boolean>(false);
  const [showTempRangeModal, setShowTempRangeModal] = useState<boolean>(false);
  const [showHeatRangeModal, setShowHeatRangeModal] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const {
    state: {
      mode,
      step,
      stage,
      isPumpEnabled,
      isMixerEnabled,
      isPaused,
      isNeedConfirme,
      temperature,
      targetTemperature,
      heatLimit,
      pumpLimit,
      recipe,
      timeToEnd,
    },
    dispatch,
  } = useAppContext();

  const start = async () => {
    console.log("start");

    const kp = await AsyncStorage.getItem("kp");
    const ki = await AsyncStorage.getItem("ki");
    const kd = await AsyncStorage.getItem("kd");

    fetch("http://192.168.1.105/v1/start", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        mode: "manual",
        kp: kp ? parseFloat(kp) : 0,
        ki: ki ? parseFloat(ki) : 0,
        kd: kd ? parseFloat(kd) : 0,
      }),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((json) => {
        console.log(json);

        dispatch({ type: "setMode", newState: "manual" });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const togglePaused = () => {
    fetch("http://192.168.1.105/v1/paused", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({ type: "setPaused", newState: json.result });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setTargetTemperature = (value: number) => {
    fetch("http://192.168.1.105/v1/target-temperature", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ targetTemperature: value }),
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({ type: "setTargetTemperature", newState: value });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const setHeatLimit = (value: number) => {
    console.log(JSON.stringify({ heatLimit: value }));
    fetch("http://192.168.1.105/v1/heat-limit", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ heatLimit: value }),
    })
      .then((response) => {
        console.log(response);

        response.json();
      })
      .then((json) => {
        console.log(value);

        dispatch({ type: "setHeatLimit", newState: value });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const togglePumpSwitch = () => {
    fetch("http://192.168.1.105/v1/pump", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({ type: "setPumpEnabled", newState: json.result });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const setPumpLimit = (value: number) => {
    console.log(JSON.stringify({ pumpLimit: value }));

    fetch("http://192.168.1.105/v1/pump-limit", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ pumpLimit: value }),
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({ type: "setPumpLimit", newState: value });
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
            <Pressable onPress={() => navigation.navigate("settings")}>
              <MaterialCommunityIcons
                name="cog-outline"
                color={Colors[colorScheme ?? "light"].text}
                size={24}
              />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              paddingTop: 16,
              paddingBottom: 32,
            }}
          >
            <ThemedButton onPress={() => navigation.navigate("index")}>
              Авто режим
            </ThemedButton>
            <ThemedButton
              highlighted={true}
              onPress={() => console.log("ssds")}
            >
              Ручной режим
            </ThemedButton>
          </View>
          <View style={{ flexDirection: "row", paddingBottom: 32 }}>
            <View style={{ width: "50%", paddingRight: 4, gap: 8 }}>
              <Card
                icon="thermometer"
                label="Температура"
                value={temperature.toFixed(1) + "°"}
                subValue={targetTemperature + "°"}
                note="Текущая/Целевая"
                type="blue"
                onPress={() => setShowTempRangeModal(true)}
              ></Card>
              <Card
                icon="pump"
                label="Насос"
                value={pumpLimit}
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
                value={heatLimit}
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
                  mode === "idle" ? await start() : togglePaused()
                }
              />

              <ThemedButton
                icon="stop"
                onPress={() => navigation.navigate("create")}
              >
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
