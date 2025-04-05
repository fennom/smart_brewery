import useAppStore from "@/lib/useAppStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert } from "react-native";

export default function Data() {
  const {
    info: { isNeedConfirm, confirmMessage },
  } = useAppStore();

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

  AsyncStorage.getItem("baseUrl").then((value) => {
    if (value !== null) {
      const setBaseUrl = useAppStore((state) => state.setBaseUrl);
      setBaseUrl(value);
    }
  });

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

  const setState = useAppStore((state) => state.fetchState);
  useEffect(() => {
    const interval = setInterval(() => {
      setState().catch((e) => alert(e.message));
    }, 1000);

    setState().catch((e) => alert(e.message));

    return () => clearInterval(interval);
  }, []);

  return null;
}
