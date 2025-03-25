import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { PropsWithChildren } from "react";
import Sheet from "./Sheet";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onEdit: (type: "ssid" | "password", index?: number) => void;
  onCancel: () => void;
  onSave: () => void;
}>;

export default function ConnectionSettingModal({
  isVisible,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  return (
    <Sheet
      isVisible={isVisible}
      heightSheet={500}
      onCancel={onCancel}
      onSave={onSave}
    >
      <View
        style={{
          height: 30,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText
          style={{
            fontFamily: "Manrope_300Light",
            fontSize: 12,
            color: "#C1C1C1",
            paddingBottom: 8,
            textAlign: "center",
          }}
        >
          Настройка подключения WiFi
        </ThemedText>
      </View>
      <Pressable
        onPress={() => onEdit("ssid")}
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
          SSID
        </ThemedText>
      </Pressable>
      <Pressable
        onPress={() => onEdit("password")}
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
          Пароль
        </ThemedText>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: {},
});
