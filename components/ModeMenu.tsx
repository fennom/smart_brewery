import { StyleSheet, View } from "react-native";
import React, { PropsWithChildren } from "react";
import i18n from "../i18n";
import ModeMenuItem from "./ModeMenuItem";
import { useRouter } from "expo-router";

type ModeMenuProps = PropsWithChildren & {
  selected: "auto" | "manual";
};

export default function ModeMenu({ selected }: ModeMenuProps) {
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        paddingTop: 16,
        paddingBottom: 32,
      }}
    >
      <ModeMenuItem
        highlighted={selected === "auto"}
        disabled={selected === "auto"}
        onPress={() => router.navigate("/")}
      >
        {i18n.t("main.auto")}
      </ModeMenuItem>
      <ModeMenuItem
        highlighted={selected === "manual"}
        disabled={selected === "manual"}
        onPress={() => router.navigate("/manual")}
      >
        {i18n.t("main.manual")}
      </ModeMenuItem>
    </View>
  );
}

const styles = StyleSheet.create({});
