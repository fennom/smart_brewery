import { View, StyleSheet } from "react-native";
import { PropsWithChildren, useEffect, useState } from "react";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ThemedText } from "./ThemedText";

type Props = PropsWithChildren<{
  isVisible: boolean;
  value: number;
  label: string;
  min?: number;
  max?: number;
  onCancel: () => void;
  onSave: (value: number) => void;
}>;

export default function TimeModal({
  isVisible,
  value,
  max,
  onCancel,
  onSave,
}: Props) {
  const [currentValue, setCurrentValue] = useState(
    new Date(1970, 0, 1, Math.floor(value / 60), (value % 60) * 60)
  );
  const [maxValue, setMaxValue] = useState(
    max
      ? new Date(1970, 0, 1, Math.floor(max / 60), (max % 60) * 60)
      : undefined
  );
  useEffect(() => {
    if (isVisible) {
      setCurrentValue(new Date(1970, 0, 1, Math.floor(value / 60), value % 60));
      setMaxValue(
        max ? new Date(1970, 0, 1, Math.floor(max / 60), max % 60) : undefined
      );
    }
  }, [isVisible]);

  useEffect(() => {
    setMaxValue(
      max ? new Date(1970, 0, 1, Math.floor(max / 60), max % 60) : undefined
    );
  }, [max]);

  return (
    <View>
      {isVisible && (
        <DateTimePicker
          mode="time"
          display="spinner"
          value={currentValue}
          maximumDate={maxValue}
          onChange={(
            event: DateTimePickerEvent,
            selectedDate: Date | undefined
          ) => {
            if (event.type === "set") {
              onSave(
                (selectedDate?.getHours() ?? 0) * 60 +
                  (selectedDate?.getMinutes() ?? 0)
              );
              return;
            }

            onCancel();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
