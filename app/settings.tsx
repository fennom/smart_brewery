import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  useColorScheme,
  StatusBar,
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
import i18n from "../i18n";
import { WiFiService } from "@/lib/WiFiManager";
import { router } from "expo-router";
import { useShallow } from "zustand/react/shallow";

export default function SettingsScreen() {
  const {
    isOnline,
    settings: { ki, kp, kd, sensorDiff, boilingPoint },
    isFetcheSettings,
  } = useAppStore(useShallow((state) => state));
  const colorScheme = useColorScheme();

  const [isPidModalVisible, setIsPidModalVisible] = useState<boolean>(false);
  const [isSensorDiffModalVisible, setIsSensorDiffdModalVisible] =
    useState<boolean>(false);
  const [isBoilingPointModalVisible, setIsBoilingPointModalVisible] =
    useState<boolean>(false);
  const [isWifiModalVisible, setIsWifiModalVisible] = useState<boolean>(false);
  const [isWifiPassModalVisible, setIsWifiPassModalVisible] =
    useState<boolean>(false);
  const [wifiSsid, setWifiSsid] = useState<string | null>(null);
  const [typeEdit, setTypeEdit] = useState<string | null>(null);

  const [selectKp, setSelectKp] = useState<number>(0);
  const [selectKi, setSelectKi] = useState<number>(0);
  const [selectKd, setSelectKd] = useState<number>(0);

  const getSettings = useAppStore((state) => state.fetchSettings);
  const setWifi = useAppStore((state) => state.fetchWifiConfig);
  const setWifiConfig = useAppStore((state) => state.setWifiConfig);
  const setPid = useAppStore((state) => state.fetchPidConfig);
  const setSensorDiff = useAppStore((state) => state.fetchSensorDiff);
  const setBoilingPoint = useAppStore((state) => state.fetchBoilingPoint);

  const showNotifyAlert = useCallback(() => {
    Alert.alert(
      i18n.t("alerts.editError"),
      i18n.t("alerts.editErrorDescription")
    );
  }, []);

  useEffect(() => {
    console.log("component rerendered");
  });

  useEffect(() => {
    if (isOnline) {
      getSettings();
    }
  }, [isOnline, showNotifyAlert, getSettings]);

  const handleWifiPress = useCallback(async () => {
    try {
      if (!isOnline) {
        showNotifyAlert();
        throw new Error(i18n.t("alerts.saveError"));
      }
      setIsWifiModalVisible(true);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handlePidPress = useCallback(async () => {
    try {
      if (!isOnline) {
        showNotifyAlert();
        throw new Error(i18n.t("alerts.saveError"));
      }
      setSelectKp(kp);
      setSelectKi(ki);
      setSelectKd(kd);
      setIsPidModalVisible(true);
    } catch (e) {
      console.log(e);
    }
  }, [isOnline, kp, ki, kd, showNotifyAlert]);

  const handleSensorDiffPress = useCallback(() => {
    try {
      if (!isOnline) {
        showNotifyAlert();
        throw new Error(i18n.t("alerts.saveError"));
      }
      setIsSensorDiffdModalVisible(true);
    } catch (e) {
      console.log(e);
    }
  }, [isOnline, showNotifyAlert]);

  const handleBoilingPointPress = useCallback(() => {
    try {
      if (!isOnline) {
        showNotifyAlert();
        throw new Error(i18n.t("alerts.saveError"));
      }
      setIsBoilingPointModalVisible(true);
    } catch (e) {
      console.log(e);
    }
  }, [isOnline, showNotifyAlert]);

  const handleWifiSsidSave = useCallback(async (ssid: string) => {
    try {
      setWifiSsid(ssid);
      setIsWifiModalVisible(false);
      setIsWifiPassModalVisible(true);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleWifiSave = useCallback(
    async (password: string) => {
      try {
        const result = await setWifi(wifiSsid ?? "", password);
        if (result) {
          await WiFiService.getInstance().connectToWifi(
            wifiSsid ?? "",
            password
          );

          setIsWifiModalVisible(false);
          setIsWifiPassModalVisible(false);
          setWifiConfig(wifiSsid ?? "", password);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [wifiSsid, setWifi]
  );

  const handlePidSave = useCallback(async () => {
    try {
      setTypeEdit(null);
      setPid(selectKp, selectKi, selectKd);
      setIsPidModalVisible(false);
    } catch (e) {
      console.log(e);
    }
  }, [selectKp, selectKi, selectKd, setPid]);

  const handleRangeSave = useCallback(
    (type: string, value: number) => {
      switch (type) {
        case "kp":
          setSelectKp(value);
          setIsPidModalVisible(true);
          setTypeEdit(null);
          break;
        case "ki":
          setSelectKi(value);
          setIsPidModalVisible(true);
          setTypeEdit(null);
          break;
        case "kd":
          setSelectKd(value);
          setIsPidModalVisible(true);
          setTypeEdit(null);
          break;
        case "sensorDiff":
          setSensorDiff(value);
          setIsSensorDiffdModalVisible(false);
          break;
        case "boilingPoint":
          setBoilingPoint(value);
          setIsBoilingPointModalVisible(false);
          break;
      }
    },
    [setSensorDiff, setBoilingPoint, setSelectKd, setSelectKi, setSelectKp]
  );

  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: Colors[colorScheme ?? "light"].background,
        flex: 1,
      },
    ],
    [colorScheme]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={containerStyle} edges={["top"]}>
        {isFetcheSettings && (
          <View style={styles.loader}>
            <ThemedView style={styles.indicator}>
              <ActivityIndicator size="large" color="#000" />
            </ThemedView>
          </View>
        )}
        <ScrollView style={{ paddingHorizontal: 16 }}>
          <SettingItem
            icon="wifi-settings"
            name={i18n.t("settings.connection.name")}
            description={i18n.t("settings.connection.description")}
            disabled={isFetcheSettings}
            onPress={handleWifiPress}
          />
          <SettingItem
            icon="tune-vertical-variant"
            name={i18n.t("pid.name")}
            description={i18n.t("pid.description")}
            disabled={isFetcheSettings}
            onPress={handlePidPress}
          />
          <SettingItem
            icon="thermometer-lines"
            name={i18n.t("settings.temperatureDelta.name")}
            description={i18n.t("settings.temperatureDelta.description")}
            disabled={isFetcheSettings}
            onPress={handleSensorDiffPress}
          />
          <SettingItem
            icon="thermometer-high"
            name={i18n.t("settings.boilingPoint.name")}
            description={i18n.t("settings.boilingPoint.description")}
            disabled={isFetcheSettings}
            onPress={handleBoilingPointPress}
          />
        </ScrollView>
        <PidSettingModal
          isVisible={isPidModalVisible}
          kp={selectKp}
          ki={selectKi}
          kd={selectKd}
          onCancel={() => setIsPidModalVisible(false)}
          onEdit={(type) => {
            setTypeEdit(type);
            setIsPidModalVisible(false);
          }}
          onSave={handlePidSave}
        />
        <ConnectionSettingModal
          isVisible={isWifiModalVisible}
          onCancel={() => setIsWifiModalVisible(false)}
          onSave={handleWifiSsidSave}
        />
        {typeEdit && !isPidModalVisible && (
          <RangeModal
            isVisible={true}
            label={i18n.t(`pid.${typeEdit}`)}
            step={0.001}
            min={0}
            max={1}
            fixed={3}
            value={
              typeEdit === "kp"
                ? selectKp
                : typeEdit === "ki"
                ? selectKi
                : selectKd
            }
            onCancel={() => {
              setIsPidModalVisible(true);
              setTypeEdit(null);
            }}
            onSave={(value) => handleRangeSave(typeEdit, value)}
          />
        )}
        <RangeModal
          isVisible={isSensorDiffModalVisible}
          label={i18n.t("settings.temperatureDelta.name")}
          step={1}
          min={0}
          max={100}
          value={sensorDiff}
          onCancel={() => setIsSensorDiffdModalVisible(false)}
          onSave={(value) => handleRangeSave("sensorDiff", value)}
        />
        <RangeModal
          isVisible={isBoilingPointModalVisible}
          label={i18n.t("settings.boilingPoint.name")}
          step={1}
          min={0}
          max={100}
          value={boilingPoint}
          onCancel={() => setIsBoilingPointModalVisible(false)}
          onSave={(value) => handleRangeSave("boilingPoint", value)}
        />
        <TextModal
          isVisible={isWifiPassModalVisible}
          label={i18n.t("settings.connection.password")}
          value=""
          onCancel={() => setIsWifiPassModalVisible(false)}
          onSave={handleWifiSave}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
