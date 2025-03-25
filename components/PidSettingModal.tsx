import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { PropsWithChildren } from "react";
import Sheet from "./Sheet";

type Props = PropsWithChildren<{
  isVisible: boolean;
  kp: number;
  ki: number;
  kd: number;
  onEdit: (type: "kp" | "ki" | "kd", index?: number) => void;
  onCancel: () => void;
  onSave: () => void;
}>;

export default function PidSettingModal({
  isVisible,
  kp,
  ki,
  kd,
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
          Составляющие пид регулятора
        </ThemedText>
      </View>
      <Pressable
        onPress={() => onEdit("kp")}
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
          Пропорциональная
        </ThemedText>
        <ThemedText style={{ flex: 1, fontFamily: "Manrope_500Medium" }}>
          {kp.toFixed(3)}
        </ThemedText>
      </Pressable>
      <Pressable
        onPress={() => onEdit("ki")}
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
          Интегрирующая
        </ThemedText>
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
            {ki.toFixed(3)}
          </ThemedText>
        </View>
      </Pressable>
      <Pressable
        onPress={() => onEdit("kd")}
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
          Дифференцирующая
        </ThemedText>
        <ThemedText style={{ flex: 1, fontFamily: "Manrope_500Medium" }}>
          {kd.toFixed(3)}
        </ThemedText>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: {},
});
