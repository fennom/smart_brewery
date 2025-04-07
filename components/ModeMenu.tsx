import { StyleSheet, View } from "react-native";
import React, { PropsWithChildren } from "react";

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
        Авто режим
      </ModeMenuItem>
      <ModeMenuItem
        highlighted={selected === "manual"}
        disabled={selected === "manual"}
        onPress={() => router.navigate("/manual")}
      >
        Ручной режим
      </ModeMenuItem>
    </View>
  );
}

const styles = StyleSheet.create({});
