import { Pressable, Text, View, useColorScheme } from "react-native";
import { ThemedText } from "./ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import i18n from "../i18n";

export default function HeaderModeMenu() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{}}>
        <ThemedText style={{ fontSize: 24, fontFamily: "Manrope_300Light" }}>
          {i18n.t("header.select")}
          {"\n"}
        </ThemedText>
        <ThemedText style={{ fontSize: 24, fontFamily: "Manrope_500Medium" }}>
          {i18n.t("header.mode")}
        </ThemedText>
      </Text>
      <Pressable onPress={() => router.navigate("/settings")}>
        <MaterialCommunityIcons
          name="cog-outline"
          color={Colors[colorScheme ?? "light"].text}
          size={24}
        />
      </Pressable>
    </View>
  );
}
