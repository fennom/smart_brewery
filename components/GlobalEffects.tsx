import useAppStore from "@/lib/useAppStore";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert } from "react-native";
import i18n from "@/i18n";
import { useShallow } from "zustand/react/shallow";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

export default function GlobalEffects() {
  const { isNeedConfirm, confirmMessage, mode } = useAppStore(
    useShallow((state) => ({
      isNeedConfirm: state.info.isNeedConfirm,
      confirmMessage: state.info.confirmMessage,
      mode: state.info.mode,
    }))
  );

  useEffect(() => {
    Notifications.requestPermissionsAsync().then((status) => {
      if (!status.granted) return;
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    });
  }, []);

  const showNotifyAlert = () => {
    Alert.alert(i18n.t("alerts.confirmation"), i18n.t(confirmMessage), [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  useEffect(() => {
    if (isNeedConfirm) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t("alerts.confirmation"),
          body: i18n.t(confirmMessage),
        },
        trigger: null,try {
          await WiFiService.getInstance().connectToWifi(ssid, password);
        } catch (err1) {
          alert("unable to connect wifi\n\n" + err1);
        }
      });
      showNotifyAlert();
    }
  }, [isNeedConfirm, confirmMessage]);

  useEffect(() => {
    if (mode !== "idle") {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [mode]);

  return null;
}
