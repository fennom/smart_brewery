import useAppStore from "@/lib/useAppStore";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Alert } from "react-native";
import i18n from "../i18n";
import { useShallow } from "zustand/react/shallow";
import { WebsocketService } from "@/lib/WebsocketService";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";

export default function Data() {
  const {
    ip,
    getWebsocketUrl,
    setState,
    setIsOnline,
    info: { isNeedConfirm, confirmMessage, mode },
  } = useAppStore(useShallow((state) => state));

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
        trigger: null,
      });
      showNotifyAlert();
    }
  }, [isNeedConfirm]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchState().catch((e) => alert(e.message));
  //   }, 1000);

  //   fetchState().catch((e) => alert(e.message));

  //   return () => clearInterval(interval);
  // }, []);

  // const sleep = (n: number) => new Promise((res) => setTimeout(res, n));

  // const loadData = async () => {
  //   while (true) {
  //     await fetchState();
  //     await sleep(1000);
  //   }
  // };

  useEffect(() => {
    if (mode !== "idle") {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [mode]);

  useEffect(() => {
    // WebSocket connection URL
    console.log(ip);

    const webSocketURL = getWebsocketUrl();
    WebsocketService.getInstance().connect(webSocketURL);
    WebsocketService.getInstance().onMessageEvent((event) => {
      setState(event.data);
    });
    WebsocketService.getInstance().onConnectEvent((event) => {
      setIsOnline(true);
    });
    WebsocketService.getInstance().onCloseEvent((event) => {
      setIsOnline(false);
    });
    WebsocketService.getInstance().onErrorEvent((event) => {
      setIsOnline(false);
    });

    // Clean up the WebSocket connection when the component is unmounted
    return () => {
      WebsocketService.getInstance().close();
    };
  }, []);

  //loadData();
  return null;
}
