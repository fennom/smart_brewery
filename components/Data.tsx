import useAppStore from "@/lib/useAppStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert } from "react-native";
import i18n from "../i18n";

export default function Data() {
  const {
    info: { isNeedConfirm, confirmMessage },
  } = useAppStore();

  const setBaseUrl = useAppStore((state) => state.setBaseUrl);

  Notifications.requestPermissionsAsync().then((status) => {
    if (!status.granted) return;
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  });

  const showNotifyAlert = () => {
    Alert.alert(i18n.t("alerts.confirmation"), i18n.t(confirmMessage), [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  AsyncStorage.getItem("baseUrl").then((value) => {
    if (value !== null) {
      setBaseUrl(value);
    }
  });

  useEffect(() => {
    if (isNeedConfirm) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t("alerts.confirmation"),
          body: i18n.t(confirmMessage),
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
