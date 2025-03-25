import { View, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { useAppContext } from "@/contexts/AppContext";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";
import { MaterialIcons } from "@expo/vector-icons";

export default function StatusView() {
  const {
    state: { isOnline },
  } = useAppContext();
  const colorScheme = useColorScheme();
  return (
    <View style={styles.statusViewContainer}>
      <MaterialIcons
        name={isOnline ? "wifi-tethering" : "wifi-tethering-error"}
        size={18}
        color={
          isOnline
            ? Colors[colorScheme ?? "light"].success
            : Colors[colorScheme ?? "light"].error
        }
      />

      {isOnline ? (
        <ThemedText>Подключенно</ThemedText>
      ) : (
        <ThemedText>Не подключенно</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statusViewContainer: {
    flex: 1,
    flexBasis: "auto",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: "10%",
    gap: 8,
    padding: 3,
  },
});
