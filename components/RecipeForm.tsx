import React, { useState, useEffect, useRef } from "react";
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
import i18n from "../i18n";
import TextModal from "./TextModal";
type Props = {
  value?: any;
  immediateSaving?: boolean;
  showOnlyEdited?: boolean;
  saveBtnText?: string;
  saveAndAddBtnText?: string;
  step?: number;
  stage?: number;
  onSave: (temperaturePauses: any[], add: boolean) => void;
};

export default function RecipeFrom({
  value,
  onSave,
  immediateSaving = false,
  showOnlyEdited = false,
  saveBtnText = i18n.t("main.add"),
  saveAndAddBtnText = i18n.t("main.saveAndAdd"),
  stage = 0,
  step = 0,
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
      name: i18n.t("main.temperaturePause"),
      temperature: 0,
      time: 0,
      power: 100,
      edited: false,
      hops: [],
    },
    {
      name: i18n.t("main.temperaturePause"),
      temperature: 0,
      time: 0,
      power: 100,
      edited: false,
      hops: [],
    },
    {
      name: i18n.t("main.temperaturePause"),
      temperature: 0,
      time: 0,
      power: 100,
      edited: false,
      hops: [],
    },
    {
      name: i18n.t("main.temperaturePause"),
      temperature: 0,
      time: 0,
      power: 100,
      edited: false,
      hops: [],
    },
    {
      name: i18n.t("main.temperaturePause"),
      temperature: 0,
      time: 0,
      power: 100,
      edited: false,
      hops: [],
    },
  ];
  const [temperaturePauses, setTemperaturePauses] = React.useState(
    value
      ? showOnlyEdited
        ? value
        : initialTemperaturePauses.map((e, i) => {
            if (value[i]) return value[i];
            return e;
          })
      : initialTemperaturePauses
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

  useEffect(() => {
    if (selectedIndex === null) return;
    setSelectTemp(temperaturePauses[selectedIndex ?? 0].temperature);
    setSelectPower(temperaturePauses[selectedIndex ?? 0].power);
    setSelectTime(temperaturePauses[selectedIndex ?? 0].time);
    setSelectHops(temperaturePauses[selectedIndex ?? 0].hops);
  }, [selectedIndex]);

  return (
    <View style={{ height: "100%" }}>
      <ScrollView
        style={{ paddingBottom: 94, paddingHorizontal: 16, paddingTop: 16 }}
      >
        <View key={1}>
          {temperaturePauses
            .filter((i: any) => (showOnlyEdited && i.edited) || !showOnlyEdited)
            .map((temperaturePause: any, index: number) => (
              <ListItem
                key={index}
                icon="1"
                disabled={
                  step > index ||
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
                <ThemedText
                  style={{
                    fontFamily: "Manrope_500Medium",
                    color: step === index ? "#EEDCA0" : "#FCFCFC",
                  }}
                >
                  {index + 1}
                </ThemedText>
              </ListItem>
            ))}
        </View>
      </ScrollView>
      {!immediateSaving && (
        <View
          style={{
            position: "absolute",
            bottom: 32,
            left: 16,
            right: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Pressable
            style={[styles.saveButton]}
            onPress={() => {
              onSave(temperaturePauses, false);
            }}
          >
            <Text style={styles.saveButtonText}>{saveBtnText}</Text>
          </Pressable>
          <Pressable
            style={[styles.saveButton]}
            onPress={() => {
              onSave(temperaturePauses, true);
            }}
          >
            <Text style={styles.saveButtonText}>{saveAndAddBtnText}</Text>
          </Pressable>
        </View>
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
              onSave(temperaturePauses, false);
            }
          }
          setIsModalVisible(false);
        }}
        onHopDeleted={deleteSelectHope}
      ></EditItemModal>
      <RangeModal
        isVisible={typeEdit === "temp" && !isModalVisible}
        label={i18n.t("main.temperature.label")}
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
        label={i18n.t("main.power")}
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
      <TextModal
        isVisible={typeEdit === "time" && !isModalVisible}
        label={i18n.t("main.time.minutes")}
        value={selectTime.toString()}
        keyboardType="numeric"
        onCancel={() => {
          setIsModalVisible(true);
          setTypeEdit(null);
        }}
        onSave={(saveValue: string) => {
          setIsModalVisible(true);
          setTypeEdit(null);
          setSelectTime(parseInt(saveValue));
        }}
      ></TextModal>
      <TextModal
        isVisible={typeEdit === "hop" && !isModalVisible}
        label={i18n.t("main.time.minutes") + "Hop"}
        keyboardType="numeric"
        value={
          selectHops[selectedHopIndex]
            ? selectHops[selectedHopIndex].toString()
            : "0"
        }
        onCancel={() => {
          setIsModalVisible(true);
          setTypeEdit(null);
        }}
        onSave={(saveValue: string) => {
          setIsModalVisible(true);
          setTypeEdit(null);
          pushOrUpdateSelectHops(parseInt(saveValue), selectedHopIndex);
        }}
      ></TextModal>
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
    flexGrow: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 31,
    boxShadow: "0px 22px 20px 0px rgba(36, 36, 36, 0.07)",
  },
  saveButtonText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 19,
    lineHeight: 26,
    textAlign: "center",
    color: "#FCFCFC",
  },
  buttonAdd: {
    paddingVertical: 8,
    borderRadius: 15,
    alignItems: "center",
  },
});
