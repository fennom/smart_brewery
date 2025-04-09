import { PermissionsAndroid, StyleSheet } from "react-native";
import * as Location from "expo-location";
import WifiManager from "react-native-wifi-reborn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAppStore from "@/lib/useAppStore";
import Card from "./Card";
import { useState } from "react";
import i18n from "../i18n";
export default function ConnectionCard() {
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
