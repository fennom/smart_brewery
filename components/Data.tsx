import { useAppContext } from "@/contexts/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert, Platform, PermissionsAndroid } from "react-native";

export default function Data() {
  const {
    state: { baseUrl, isNeedConfirm, confirmMessage },
    dispatch,
  } = useAppContext();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const showNotifyAlert = () => {
    Alert.alert("Требуется подтверждение", confirmMessage, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  const [isGetInfo, setIsGetInfo] = useState<boolean>(false);

  useEffect(() => {
    if (isNeedConfirm) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Требуется подтверждение",
          body: confirmMessage,
        },
        trigger: null,
      });
      showNotifyAlert();
    }
  }, [isNeedConfirm]);

  useEffect(() => {
    const getInfo = () => {
      AsyncStorage.getItem("baseUrl").then((value) => {
        if (value !== null) {
          dispatch({ type: "setBaseUrl", baseUrl: value });
        }
      });
      if (isGetInfo || baseUrl === "") return;
      setIsGetInfo(true);
      fetch(`${baseUrl}/v1/info`, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          dispatch({ type: "setInfo", ...json });
        })
        .catch((error) => {
          console.error(error);
          dispatch({
            type: "setOnline",
            newState: false,
          });
        })
        .finally(() => setIsGetInfo(false));
    };

    const interval = setInterval(() => {
      getInfo();
    }, 1000);

    getInfo();

    // setTimeout(() => {
    //   dispatch({ type: "setConfirmeMessage", newState: "Testove soobschenie" });
    //   dispatch({ type: "setNeedConfirme", newState: true });
    // }, 3000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
