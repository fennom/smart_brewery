import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet } from "react-native";
import { PropsWithChildren, useEffect, useState } from "react";
import Sheet from "./Sheet";
import TextInput from "./TextInput";

type Props = PropsWithChildren<{
  isVisible: boolean;
  value: string;
  label: string;
  secureTextEntry?: boolean;
  onCancel: () => void;
  onSave: (value: string) => void;
}>;

export default function TextModal({
  isVisible,
  label,
  value,
  secureTextEntry = false,
  onCancel,
  onSave,
}: Props) {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => {
    if (isVisible) setCurrentValue(value);
  }, [isVisible]);

  return (
    <Sheet
      isVisible={isVisible}
      onCancel={onCancel}
      onSave={() => onSave(currentValue)}
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
          {label}
        </ThemedText>
      </View>
      <View>
        <TextInput
          label={label}
          keyboardType="default"
          value={currentValue}
          secureTextEntry={secureTextEntry}
          onChangeText={setCurrentValue}
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    height: 300,
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#121212",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    padding: 16,
    zIndex: 2,
  },
  controls: {
    height: 80,
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    fontFamily: "Manrope_400Regular",
    paddingHorizontal: 16,
  },
});
