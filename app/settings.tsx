import React, { useState, useEffect } from "react";
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

export default function CreateScreen() {
  const {
    isOnline,
    settings: { ki, kp, kd, sensorDiff, boilingPoint },
    isFetcheSettings,
  } = useAppStore();
  const colorScheme = useColorScheme();

  const [isPidModalVisible, setIsPidModalVisible] = useState<boolean>(false);
  const [isSensorDiffModalVisible, setIsSensorDiffdModalVisible] =
    useState<boolean>(false);
  const [isBoilingPointModalVisible, setIsBoilingPointModalVisible] =
    useState<boolean>(false);
  const [isWifiModalVisible, setIsWifiModalVisible] = useState<boolean>(false);
  const [typeEdit, setTypeEdit] = useState<string | null>(null);

  const [selectKp, setSelectKp] = useState<number>(0);
  const [selectKi, setSelectKi] = useState<number>(0);
  const [selectKd, setSelectKd] = useState<number>(0);
  const [selectSsid, setSelectSsid] = useState<string>("s");
  const [selectPassword, setSelectPassword] = useState<string>("");

  const getSettings = useAppStore((state) => state.fetchSettings);
  const setWifi = useAppStore((state) => state.fetchWifiConfig);
  const setPid = useAppStore((state) => state.fetchPidConfig);
  const setSensorDiff = useAppStore((state) => state.fetchSensorDiff);
  const setBoilingPoint = useAppStore((state) => state.fetchBoilingPoint);

  const showNotifyAlert = () => {
    Alert.alert(
      i18n.t("alerts.editError"),
      i18n.t("alerts.editErrorDescription")
    );
  };

  useEffect(() => {
    if (!isOnline) {
      showNotifyAlert();
      return;
    }
    getSettings();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            flex: 1,
          },
        ]}
        edges={["top"]}
      >
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
            onPress={async () => {
              try {
                setIsWifiModalVisible(true);
              } catch (e) {
                console.log(e);
              }
            }}
          />
          <SettingItem
            icon="tune-vertical-variant"
            name={i18n.t("pid.name")}
            description={i18n.t("pid.description")}
            disabled={isFetcheSettings}
            onPress={async () => {
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
            }}
          />
          <SettingItem
            icon="thermometer-lines"
            name={i18n.t("settings.temperatureDelta.name")}
            description={i18n.t("settings.temperatureDelta.description")}
            disabled={isFetcheSettings}
            onPress={() => {
              try {
                if (!isOnline) {
                  showNotifyAlert();
                  throw new Error(i18n.t("alerts.saveError"));
                }
                setIsSensorDiffdModalVisible(true);
              } catch (e) {
                console.log(e);
              }
            }}
          />
          <SettingItem
            icon="thermometer-high"
            name={i18n.t("settings.boilingPoint.name")}
            description={i18n.t("settings.boilingPoint.description")}
            disabled={isFetcheSettings}
            onPress={() => {
              try {
                if (!isOnline) {
                  showNotifyAlert();
                  throw new Error(i18n.t("alerts.saveError"));
                }
                setIsBoilingPointModalVisible(true);
              } catch (e) {
                console.log(e);
              }
            }}
          />
        </ScrollView>
        <ConnectionSettingModal
          isVisible={isWifiModalVisible}
          onCancel={() => {
            setIsWifiModalVisible(false);
          }}
          onEdit={(type) => {
            setTypeEdit(type);
            setIsWifiModalVisible(false);
          }}
          onSave={async () => {
            try {
              setTypeEdit(null);
              setWifi(selectSsid, selectPassword);
              setIsWifiModalVisible(false);
            } catch (e) {
              console.log(e);
            }
          }}
        />
        <PidSettingModal
          isVisible={isPidModalVisible}
          kp={selectKp}
          kd={selectKd}
          ki={selectKi}
          onCancel={() => {
            setIsPidModalVisible(false);
          }}
          onEdit={(type) => {
            setTypeEdit(type);
            setIsPidModalVisible(false);
          }}
          onSave={async () => {
            try {
              setTypeEdit(null);
              setPid(selectKp, selectKi, selectKi);
              setIsPidModalVisible(false);
            } catch (e) {
              console.log(e);
            }
          }}
        />
        <RangeModal
          isVisible={typeEdit === "kp" && !isPidModalVisible}
          label={i18n.t("pid.kp")}
          step={0.001}
          min={0}
          max={1}
          fixed={3}
          value={selectKp}
          onCancel={() => {
            setIsPidModalVisible(true);
            setTypeEdit(null);
          }}
          onSave={(saveValue: number) => {
            setIsPidModalVisible(true);
            setTypeEdit(null);
            setSelectKp(parseFloat(saveValue.toFixed(3)));
          }}
        ></RangeModal>
        <RangeModal
          isVisible={typeEdit === "ki" && !isPidModalVisible}
          label={i18n.t("pid.ki")}
          step={0.001}
          value={selectKi}
          min={0}
          max={1}
          fixed={3}
          onCancel={() => {
            setIsPidModalVisible(true);
            setTypeEdit(null);
          }}
          onSave={(saveValue: number) => {
            setIsPidModalVisible(true);
            setTypeEdit(null);
            setSelectKi(saveValue);
          }}
        ></RangeModal>
        <RangeModal
          isVisible={typeEdit === "kd" && !isPidModalVisible}
          label={i18n.t("pid.kd")}
          step={0.001}
          min={0}
          max={1}
          fixed={3}
          value={selectKd}
          onCancel={() => {
            setIsPidModalVisible(true);
            setTypeEdit(null);
          }}
          onSave={(saveValue: number) => {
            setIsPidModalVisible(true);
            setTypeEdit(null);
            setSelectKd(saveValue);
          }}
        ></RangeModal>
        <RangeModal
          isVisible={isSensorDiffModalVisible}
          label={i18n.t("settings.temperatureDelta.name")}
          step={1}
          min={0}
          max={100}
          value={sensorDiff}
          onCancel={() => {
            setIsSensorDiffdModalVisible(false);
          }}
          onSave={(saveValue: number) => {
            setSensorDiff(saveValue);
            setIsSensorDiffdModalVisible(false);
          }}
        ></RangeModal>
        <RangeModal
          isVisible={isBoilingPointModalVisible}
          label={i18n.t("settings.boilingPoint.name")}
          step={1}
          min={0}
          max={100}
          value={boilingPoint}
          onCancel={() => {
            setIsBoilingPointModalVisible(false);
          }}
          onSave={(saveValue: number) => {
            setBoilingPoint(saveValue);
            setIsBoilingPointModalVisible(false);
          }}
        ></RangeModal>
        <TextModal
          isVisible={typeEdit === "ssid" && !isWifiModalVisible}
          label={i18n.t("settings.connection.ssid")}
          value={selectSsid}
          onCancel={() => {
            setTypeEdit(null);
            setIsWifiModalVisible(true);
          }}
          onSave={(saveValue: string) => {
            setSelectSsid(saveValue);
            setTypeEdit(null);
            setIsWifiModalVisible(true);
          }}
        />
        <TextModal
          isVisible={typeEdit === "password" && !isWifiModalVisible}
          label={i18n.t("settings.connection.password")}
          value={selectPassword}
          secureTextEntry={true}
          onCancel={() => {
            setTypeEdit(null);
            setIsWifiModalVisible(true);
          }}
          onSave={(saveValue: string) => {
            setSelectPassword(saveValue);
            setTypeEdit(null);
            setIsWifiModalVisible(true);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "90%",
    paddingTop: StatusBar.currentHeight,
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
