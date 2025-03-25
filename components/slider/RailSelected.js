import { LinearGradient } from "expo-linear-gradient";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

const RailSelected = () => {
  return (
    <LinearGradient
      colors={["#EEDCA0", "#887E5B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.root}
    />
  );
};

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
});
