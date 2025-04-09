import {
  View,
  StyleSheet,
  useColorScheme,
  TextInput as ReactInput,
  KeyboardTypeOptions,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";

type Props = {
  value: any;
  label: string;
  keyboardType: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  onChangeText: (value: string) => void;
};

export default function TextInput({
  onChangeText,
  value,
  label,
  keyboardType,
  secureTextEntry = false,
}: Props) {
  const colorScheme = useColorScheme();
  const [isFocus, setFocus] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      <ThemedText
        type="label"
        style={[
          styles.inputLabel,
          isFocus && { color: Colors[colorScheme ?? "light"].primary },
        ]}
      >
        {label}
      </ThemedText>
      <ReactInput
        style={[
          styles.input,
          { borderColor: Colors[colorScheme ?? "light"].borderColor },
          isFocus && { borderColor: Colors[colorScheme ?? "light"].primary },
          { color: Colors[colorScheme ?? "light"].text },
        ]}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 32,
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingBottom: 7,
    fontSize: 14,
    lineHeight: 14,
    //    outlineStyle: "none",
  },
  inputLabel: {
    fontSize: 12,
  },
  inputWrapper: {
    flexGrow: 1,
    flexShrink: 1,
  },
});
