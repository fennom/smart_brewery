import AsyncStorage from "@react-native-async-storage/async-storage";
import useAppStore from "@/lib/useAppStore";
import Card from "./Card";
import { useState } from "react";
import i18n from "../i18n";
import { WiFiService } from "@/lib/WiFiManager";
import { useShallow } from "zustand/react/shallow";
import { WebsocketService } from "@/lib/WebsocketService";

export default function ConnectionCard() {
  const [ssid, setSsid] = useState("SmartBrewery");
  const [password, setPassword] = useState("123456789");
  const setIp = useAppStore(useShallow((state) => state.setIp));
  const getWebsocketUrl = useAppStore(
    useShallow((state) => state.getWebsocketUrl)
  );

  const connectWifi = async () => {
    // setBaseUrl("http://192.168.123.123");
    // // AsyncStorage.setItem("baseUrl", "http://192.168.123.123").catch((e) =>
    // //   alert(e.message)
    // // );
    // // alert("Connection success");
    // setIp("192.168.123.123");
    // //WebsocketService.getInstance().connect(getWebsocketUrl());
    // return;

    try {
      await WiFiService.getInstance().connectToWifi(ssid, password);
      setIp("192.168.123.123");
    } catch (err1) {
      alert("unable to connect wifi\n\n" + err1);
    }
  };

  return (
    <Card
      icon="access-point-remove"
      label={""}
      value="N/A"
      note={i18n.t("main.connection.note")}
      type="orange"
      isToggle={true}
      isEnable={false}
      onTogglePress={() => connectWifi()}
    ></Card>
  );
}
