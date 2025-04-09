import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { PropsWithChildren } from "react";
import Sheet from "./Sheet";
import i18n from "../i18n";
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
          {i18n.t("settings.connection.name")}
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
          {i18n.t("settings.connection.ssid")}
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
          {i18n.t("settings.connection.password")}
        </ThemedText>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: {},
});
