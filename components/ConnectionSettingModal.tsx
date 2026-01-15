import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { PropsWithChildren, useState, useEffect } from "react";
import Sheet from "./Sheet";
import i18n from "../i18n";
import { ScrollView } from "react-native-gesture-handler";
import SettingItem from "./SettingItem";
import { WiFiService } from "@/lib/WiFiManager";
import { WifiEntry } from "react-native-wifi-reborn";
import { ThemedView } from "./ThemedView";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onCancel: () => void;
  onSave: (ssid: string) => void;
}>;

export default function ConnectionSettingModal({
  isVisible,
  onCancel,
  onSave,
}: Props) {
  const [wifiEntries, setWifiEntries] = useState<WifiEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const scanWifi = async () => {
    try {
      setIsLoading(true);
      const entries = await WiFiService.getInstance().scanWifi();
      setWifiEntries(entries);
    } catch (error) {
      console.error("WiFi scan error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      scanWifi();
    }
  }, [isVisible]);

  return (
    <Sheet
      isVisible={isVisible}
      heightSheet={600}
      onCancel={onCancel}
      showSaveButton={false}
    >
      <View
        style={{
          height: 30,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <ThemedText
          darkColor="#C1C1C1"
          style={{
            fontFamily: "Manrope_300Light",
            fontSize: 12,
            paddingBottom: 8,
            textAlign: "center",
          }}
        >
          {i18n.t("settings.connection.name")}
        </ThemedText>
      </View>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              alignSelf: "center",
              flexGrow: 0,
              padding: 16,
              borderRadius: 8,
            }}
          >
            <ActivityIndicator size="large" color="#000" />
          </ThemedView>
        </View>
      )}

      <ScrollView style={{ paddingBottom: 16 }}>
        {wifiEntries.map((value: WifiEntry) => (
          <SettingItem
            key={value.SSID}
            icon={
              "wifi-strength" + Math.round((4 * value.level) / 100).toString()
            }
            name={value.SSID}
            description={""}
            onPress={() => onSave(value.SSID)}
          />
        ))}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: {},
});
