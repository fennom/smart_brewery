import { ThemedText } from "@/components/ThemedText";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";
import Sheet from "./Sheet";
import ListItem from "./ListItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = PropsWithChildren<{
  isVisible: boolean;
  temp: number;
  time: number;
  power: number;
  hops: number[];
  onEdit: (type: "temp" | "power" | "time" | "hop", index?: number) => void;
  onHopDeleted: (index: number) => void;
  onCancel: () => void;
  onSave: () => void;
}>;

export default function EditItemModal({
  isVisible,
  temp,
  time,
  power,
  hops,
  onEdit,
  onHopDeleted,
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
          Температурная пауза
        </ThemedText>
      </View>
      <Pressable
        onPress={() => onEdit("temp")}
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
          Температруа
        </ThemedText>
        <ThemedText style={{ flex: 1, fontFamily: "Manrope_500Medium" }}>
          {temp}
          <ThemedText style={{ fontFamily: "Manrope_300Light" }}>°</ThemedText>
        </ThemedText>
      </Pressable>
      <Pressable
        onPress={() => onEdit("time")}
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
          Продолжительность
        </ThemedText>
        <View style={{ flex: 1 }}>
          <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
            {time}
            <ThemedText
              style={{ fontSize: 12, fontFamily: "Manrope_300Light" }}
            >
              {" мин"}
            </ThemedText>
          </ThemedText>
        </View>
      </Pressable>
      <Pressable
        onPress={() => onEdit("power")}
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
          Мощность
        </ThemedText>
        <ThemedText style={{ flex: 1, fontFamily: "Manrope_500Medium" }}>
          {power}
          <ThemedText style={{ fontSize: 12, fontFamily: "Manrope_300Light" }}>
            %
          </ThemedText>
        </ThemedText>
      </Pressable>
      {temp === 100 && time > 0 && (
        <View>
          <Pressable
            onPress={() => onEdit("hop", hops.length)}
            style={{
              alignSelf: "stretch",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemedText style={{ flex: 5, fontFamily: "Manrope_400Regular" }}>
              Внесение хмеля
            </ThemedText>
            <View
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 16,
                paddingVertical: 4,
                backgroundColor: "#242424",
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "#2D2D2D",
              }}
            >
              <ThemedText
                style={{
                  fontFamily: "Manrope_400Regular",
                  color: "#C1C1C1",
                }}
              >
                Добавить
              </ThemedText>
            </View>
          </Pressable>
          <View key={1}>
            {hops.map((hop: any, index: number) => (
              <ListItem
                key={index}
                icon="1"
                name={`Хмель №${index + 1}`}
                time={hop}
                deletable
                onDeleted={() => onHopDeleted(index)}
                onPress={() => {
                  onEdit("hop", index);
                }}
              >
                <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
                  <MaterialCommunityIcons name="hops" size={24} />
                </ThemedText>
              </ListItem>
            ))}
          </View>
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  container: {},
});
