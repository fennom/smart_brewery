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
import { useAppContext } from "@/contexts/AppContext";
import SettingItem from "@/components/SettingItem";
import PidSettingModal from "@/components/PidSettingModal";
import RangeModal from "@/components/RangeModal";
import { Alert, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import TextModal from "@/components/TextModal";
import ConnectionSettingModal from "@/components/ConnectionSettingModal";

export default function CreateScreen() {
  const {
    state: { baseUrl, isOnline, ki, kp, kd, sensorDiff, boilingPoint },
    dispatch,
  } = useAppContext();
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
  const [selectSsid, setSelectSsid] = useState<string>("~");
  const [selectPassword, setSelectPassword] = useState<string>("!");
  const [isSaving, setIsSaving] = useState<boolean>(true);

  const getSettings = () => {
    setIsSaving(true);
    fetch(`${baseUrl}/v1/settings`, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        //console.log(json);
        dispatch({ type: "setSettings", ...json });
      })
      .catch((error) => {
        dispatch({
          type: "setOnline",
          newState: false,
        });
      })
      .finally(() => setIsSaving(false));
  };

  const setWifi = async (ssid: string, password: string) => {
    fetch(`${baseUrl}/v1/pid`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        ssid: ssid,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({ type: "setBaseUrl", newState: "http://" + json.ip });
      })
      .catch((error) => {
        dispatch({
          type: "setOnline",
          newState: false,
        });
        showNotifyAlert();
        console.error(error);
      })
      .finally(() => setIsSaving(false));
  };

  const setPid = async (kp: number, ki: number, kd: number) => {
    fetch(`${baseUrl}/v1/pid`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        kp: kp,
        ki: ki,
        kd: kd,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({ type: "setKp", newState: json.kp });
        dispatch({ type: "setKi", newState: json.ki });
        dispatch({ type: "setKd", newState: json.kd });
      })
      .catch((error) => {
        dispatch({
          type: "setOnline",
          newState: false,
        });
        showNotifyAlert();
        console.error(error);
      })
      .finally(() => setIsSaving(false));
  };

  const setSensorDiff = async (sensorDiff: number) => {
    fetch(`${baseUrl}/v1/sensor-diff`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        sensorDiff: sensorDiff,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        dispatch({ type: "setSensorDiff", newState: json.sensorDiff });
      })
      .catch((error) => {
        dispatch({
          type: "setOnline",
          newState: false,
        });
        showNotifyAlert();
        console.error(error);
      })
      .finally(() => setIsSaving(false));
  };

  const setBoilingPoint = async (boilingPoint: number) => {
    fetch(`${baseUrl}/v1/boiling-point`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        boilingPoint: boilingPoint,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        dispatch({ type: "setBoilingPoint", newState: json.boilingPoint });
      })
      .catch((error) => {
        dispatch({
          type: "setOnline",
          newState: false,
        });
        showNotifyAlert();
        console.error(error);
      })
      .finally(() => setIsSaving(false));
  };

  const showNotifyAlert = () => {
    Alert.alert(
      "Ошибка редактирования",
      "Для редактирования настроек убедитесь что приложение сопрежено с автоматикой",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
  };

  useEffect(() => {
    getSettings();
  }, []);

  //();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
        edges={["top"]}
      >
        {isSaving && (
          <View style={styles.loader}>
            <ThemedView style={styles.indicator}>
              <ActivityIndicator size="large" color="#000" />
            </ThemedView>
          </View>
        )}
        <ScrollView style={{}}>
          <SettingItem
            icon="tune-vertical-variant"
            name="Подключение"
            description="Настройки подключения wifi, bluetooth"
            disabled={isSaving}
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
            name="Пид регулятор"
            description="Настройки кооэфицентов пид регулятора"
            disabled={isSaving}
            onPress={async () => {
              try {
                if (!isOnline) {
                  showNotifyAlert();
                  throw new Error("Ошибка сохранения");
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
            name="Настройка температурой дельты"
            description="Настройки макс. разницы темп. датчиков"
            disabled={isSaving}
            onPress={() => {
              try {
                if (!isOnline) {
                  showNotifyAlert();
                  throw new Error("Ошибка сохранения");
                }
                setIsSensorDiffdModalVisible(true);
              } catch (e) {
                console.log(e);
              }
            }}
          />
          <SettingItem
            icon="thermometer-high"
            name="Температура кипения"
            description="Настройки температуры кипения"
            disabled={isSaving}
            onPress={() => {
              try {
                if (!isOnline) {
                  showNotifyAlert();
                  throw new Error("Ошибка сохранения");
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
          label="Пропорциональная составляющея"
          step={0.001}
          min={0}
          max={1}
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
          label="Интегрирующая составляющея"
          step={0.001}
          value={selectKi}
          min={0}
          max={1}
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
          label="Дифференцирующая составляющея"
          step={0.001}
          min={0}
          max={1}
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
          label="Макс разица темп. датчиков"
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
          label=""
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
          label="SSID"
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
          label="Пароль"
          value={selectPassword}
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
    paddingHorizontal: 16,
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
