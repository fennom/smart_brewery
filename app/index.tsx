import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  useColorScheme,
  PermissionsAndroid,
} from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Colors } from "@/constants/Colors";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "@/components/Card";
import { useNavigation } from "expo-router";
import ThemedButton from "@/components/ThemedButton";
import RecipeFrom from "@/components/RecipeForm";
import RangeModal from "@/components/RangeModal";
import * as Location from "expo-location";
import WifiManager from "react-native-wifi-reborn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAppStore from "@/lib/useAppStore";

export default function HomeScreen() {
  const [showPumpRangeModal, setShowPumpRangeModal] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

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

  const [ssid, setSsid] = useState("SmartBrewery");
  const [password, setPassword] = useState("123456789");
  const setBaseUrl = useAppStore((state) => state.setBaseUrl);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  };

  const turnOnLocation = async () => {
    var permit = await requestLocationPermission();
    if (!permit) return false;
    const result = await Location.getCurrentPositionAsync();
    console.log("turnOnLocation result", result);
    return result;
  };

  const connectWifi = async () => {
    // setBaseUrl("http://192.168.123.123");
    // AsyncStorage.setItem("baseUrl", "http://192.168.123.123").catch((e) =>
    //   alert(e.message)
    // );
    // alert("Connection success");
    // return;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location permission is required for WiFi connections",
          message:
            "This app needs location permission as this is required  " +
            "to scan for wifi networks.",
          buttonNegative: "DENY",
          buttonPositive: "ALLOW",
        }
      );

      if (granted) {
        WifiManager.setEnabled(true);
        WifiManager.disconnect();
        await turnOnLocation();
        WifiManager.connectToProtectedSSID(ssid, password, false, false).then(
          async () => {
            setBaseUrl("http://192.168.123.123");
            AsyncStorage.setItem("baseUrl", "http://192.168.123.123").catch(
              (e) => alert(e.message)
            );
          },
          () => {
            alert("unable to connect wifi\n\n" + "Connection failed!");
            console.log("Connection failed!");
          }
        );
      } else {
        console.log(
          "unable to connect wifi\n\n" +
            "Location service is turned off or Location permission denied"
        );
        alert(
          "unable to connect wifi\n\n" +
            "Location service is turned off or Location permission denied"
        );
      }
    } catch (err1) {
      alert("unable to connect wifi\n\n" + err1);
    }
  };

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
            <ThemedButton
              highlighted={true}
              onPress={() => console.log("ssds")}
            >
              Авто режим
            </ThemedButton>
            <ThemedButton onPress={() => navigation.navigate("manual")}>
              Ручной режим
            </ThemedButton>
          </View>
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
              {!isOnline && (
                <Card
                  icon="access-point-remove"
                  label=""
                  value="N/A"
                  note="Нет подключения"
                  type="orange"
                  isToggle={true}
                  isEnable={false}
                  onTogglePress={() => connectWifi()}
                ></Card>
              )}
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
                  onPress={() => navigation.navigate("create")}
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
