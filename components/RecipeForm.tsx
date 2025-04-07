import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  useColorScheme,
  StatusBar,
  Pressable,
} from "react-native";
import { ThemedText } from "./ThemedText";
import ListItem from "./ListItem";
import EditItemModal from "./EditItemModal";
import RangeModal from "./RangeModal";
import TimeModal from "./TimeModal";

type Props = {
  value?: any;
  immediateSaving?: boolean;
  onSave: (temperaturePauses: any[]) => void;
};

export default function RecipeFrom({
  value,
  onSave,
  immediateSaving = false,
}: Props) {
  const colorScheme = useColorScheme();
  const [selectTemp, setSelectTemp] = useState<number>(0);
  const [selectPower, setSelectPower] = useState<number>(0);
  const [selectTime, setSelectTime] = useState<number>(0);
  const [selectHops, setSelectHops] = useState<number[]>([]);
  const [selectedHopIndex, setSelectedHopIndex] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [typeEdit, setTypeEdit] = useState<string | null>(null);

  const initialTemperaturePauses = [
    {
      name: "Температурная пауза",
      temperature: 0,
      time: 0,
      power: 100,
      edited: false,
      hops: [],
    },
    {
      name: "Температурная пауза",
      temperature: 0,
      time: 0,
      power: 100,
      edited: false,
      hops: [],
    },
    {
      name: "Температурная пауза",
      temperature: 0,
      time: 0,
      power: 100,
      edited: false,
      hops: [],
    },
    {
      name: "Температурная пауза",
      temperature: 0,
      time: 0,
      power: 100,
      edited: false,
      hops: [],
    },
    {
      name: "Температурная пауза",
      temperature: 0,
      time: 0,
      power: 100,
      edited: false,
      hops: [],
    },
  ];
  const [temperaturePauses, setTemperaturePauses] = React.useState(
    value ?? initialTemperaturePauses
  );

  const pushOrUpdateSelectHops = (time: number, index: number) => {
    const newList = [...selectHops];
    if (selectHops.length <= index) {
      newList.push(time);
    } else {
      newList[index] = time;
    }
    setSelectHops(newList);
  };

  const deleteSelectHope = (hopeIndex: number) => {
    const newList = [...selectHops];
    newList.splice(hopeIndex, 1);
    setSelectHops(newList);
  };

  const setTemperature = (temperature: number, index: number) => {
    const newList = [...temperaturePauses];
    const temperaturePause = newList[index];
    temperaturePause.temperature = temperature;
    setTemperaturePauses(newList);
  };

  const setTime = (time: number, index: number) => {
    const newList = [...temperaturePauses];
    const temperaturePause = newList[index];
    temperaturePause.time = time;
    setTemperaturePauses(newList);
  };

  const setPower = (power: number, index: number) => {
    const newList = [...temperaturePauses];
    const temperaturePause = newList[index];
    temperaturePause.power = power;
    setTemperaturePauses(newList);
  };

  const setHops = (hops: number[], index: number) => {
    const newList = [...temperaturePauses];
    const temperaturePause = newList[index];
    temperaturePause.hops = hops;
    setTemperaturePauses(newList);
  };

  const setEdited = (edited: boolean, index: number) => {
    const newList = [...temperaturePauses];
    const temperaturePause = newList[index];
    temperaturePause.edited = edited;
    setTemperaturePauses(newList);
  };

  const appendTemperaturePause = () => {
    const newList = [...temperaturePauses];
    newList.push({ temperature: 0, time: 0 });
    setTemperaturePauses(newList);
  };

  const [boilingTimes, setBoilingTimes] = React.useState(
    value?.boilingTimes ?? [0, 0, 0, 0, 0]
  );

  const setBoilingTime = (time: number, index: number) => {
    const newList = [...boilingTimes];
    newList[index] = time;
    setBoilingTimes(newList);
  };

  const deleteBoilingTime = (index: number) => {
    const newList = [...boilingTimes];
    newList.splice(index, 1);
    setBoilingTimes(newList);
  };

  const appendBoilingTime = () => {
    const newList = [...boilingTimes];
    newList.push(0);
    setBoilingTimes(newList);
  };

  useEffect(() => {
    if (selectedIndex === null) return;
    setSelectTemp(temperaturePauses[selectedIndex ?? 0].temperature);
    setSelectPower(temperaturePauses[selectedIndex ?? 0].power);
    setSelectTime(temperaturePauses[selectedIndex ?? 0].time);
    setSelectHops(temperaturePauses[selectedIndex ?? 0].hops);
  }, [selectedIndex]);
  return (
    <View style={{ height: "100%" }}>
      <ScrollView style={{ paddingBottom: 94 }}>
        <View key={1}>
          {temperaturePauses.map((temperaturePause: any, index: number) => (
            <ListItem
              key={index}
              icon="1"
              disabled={
                !(
                  temperaturePause.edited ||
                  index === 0 ||
                  temperaturePauses[index - 1].edited
                )
              }
              name={temperaturePause.name}
              temp={temperaturePause.temperature}
              power={temperaturePause.power}
              time={temperaturePause.time}
              deletable
              onDeleted={() => {
                setTemperature(0, index);
                setPower(100, index);
                setTime(0, index);
                setHops([], index);
                setEdited(false, index);
              }}
              onPress={() => {
                setSelectedIndex(index);
                setIsModalVisible(true);
              }}
            >
              <ThemedText style={{ fontFamily: "Manrope_500Medium" }}>
                {index + 1}
              </ThemedText>
            </ListItem>
          ))}
        </View>
      </ScrollView>
      {!immediateSaving && (
        <Pressable
          style={[styles.saveButton]}
          onPress={() => {
            onSave(temperaturePauses);
          }}
        >
          <Text style={styles.saveButtonText}>Сохр!анить</Text>
        </Pressable>
      )}
      <EditItemModal
        isVisible={isModalVisible !== false}
        temp={selectTemp}
        time={selectTime}
        power={selectPower}
        hops={selectHops}
        onEdit={(type, idx) => {
          setTypeEdit(type);
          if (idx) setSelectedHopIndex(idx);
          setIsModalVisible(false);
        }}
        onCancel={() => {
          setSelectedIndex(null);
          setIsModalVisible(false);
        }}
        onSave={() => {
          if (selectedIndex !== null) {
            setTemperature(selectTemp, selectedIndex);
            setPower(selectPower, selectedIndex);
            setTime(selectTime, selectedIndex);
            setHops(selectHops, selectedIndex);
            setEdited(true, selectedIndex);
            setSelectedIndex(null);

            if (immediateSaving) {
              onSave(temperaturePauses);
            }
          }
          setIsModalVisible(false);
        }}
        onHopDeleted={deleteSelectHope}
      ></EditItemModal>
      <RangeModal
        isVisible={typeEdit === "temp" && !isModalVisible}
        label="Temperature"
        value={selectTemp}
        symbol="gradus"
        onCancel={() => {
          setIsModalVisible(true);
          setTypeEdit(null);
        }}
        onSave={(saveValue: number) => {
          setIsModalVisible(true);
          setTypeEdit(null);
          setSelectTemp(saveValue);
        }}
      ></RangeModal>
      <RangeModal
        isVisible={typeEdit === "power" && !isModalVisible}
        label="Power"
        value={selectPower}
        symbol="percent"
        onCancel={() => {
          setIsModalVisible(true);
          setTypeEdit(null);
        }}
        onSave={(saveValue: number) => {
          setIsModalVisible(true);
          setTypeEdit(null);
          setSelectPower(saveValue);
        }}
      ></RangeModal>
      <TimeModal
        isVisible={typeEdit === "time" && !isModalVisible}
        label="Time"
        value={selectTime}
        onCancel={() => {
          setIsModalVisible(true);
          setTypeEdit(null);
        }}
        onSave={(saveValue: number) => {
          setIsModalVisible(true);
          setTypeEdit(null);
          setSelectTime(saveValue);
        }}
      ></TimeModal>
      <TimeModal
        isVisible={typeEdit === "hop" && !isModalVisible}
        label="Time"
        value={selectHops[selectedHopIndex] ?? 0}
        max={selectTime}
        onCancel={() => {
          setIsModalVisible(true);
          setTypeEdit(null);
        }}
        onSave={(saveValue: number) => {
          setIsModalVisible(true);
          setTypeEdit(null);
          pushOrUpdateSelectHops(saveValue, selectedHopIndex);
        }}
      ></TimeModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight,
  },
  inputContainers: {
    flex: 1,
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  saveButton: {
    position: "absolute",
    backgroundColor: "#FCFCFC",
    left: 16,
    right: 16,
    bottom: 32,
    paddingVertical: 18,
    borderRadius: 31,
    boxShadow: "0px 22px 20px 0px rgba(36, 36, 36, 0.07)",
  },
  saveButtonText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 19,
    lineHeight: 26,
    textAlign: "center",
    color: "#000",
  },
  buttonAdd: {
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: "center",
  },
});
