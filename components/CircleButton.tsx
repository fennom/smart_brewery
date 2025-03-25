import { View, Pressable, StyleSheet, useColorScheme } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  icon?: string;
  onPress: () => void;
  onLongPress?: () => void;
};

export default function CircleButton({
  onPress,
  onLongPress,
  icon = "play-arrow",
}: Props) {
  const colorScheme = useColorScheme();
  return (
    <View
      style={[styles.circleButtonContainer, { backgroundColor: "#F8E5A5" }]}
    >
      <Pressable
        style={styles.circleButton}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <MaterialCommunityIcons name={icon} size={38} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    padding: 3,
    boxShadow: "0px 22px 20px 0px #24242412",
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 42,
  },
});
