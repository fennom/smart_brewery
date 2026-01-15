import { ThemedText } from "@/components/ThemedText";
import { View, StyleSheet } from "react-native";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import Rail from "./slider/Rail";
import RailSelected from "./slider/RailSelected";
import Label from "./slider/Label";
import Notch from "./slider/Notch";
import Thumb from "./slider/Thumb";
import Slider from "crn-range-slider";
import Sheet from "./Sheet";
import RangeInput from "./RangeInput";

type Props = PropsWithChildren<{
  isVisible: boolean;
  value: number;
  label: string;
  step?: number;
  symbol?: "gradus" | "percent";
  min?: number;
  max?: number;
  fixed?: number;
  onCancel: () => void;
  onSave: (value: number) => void;
}>;

export default function RangeModal({
  isVisible,
  label,
  value,
  symbol,
  step = 1,
  min = 0,
  max = 100,
  fixed,
  onCancel,
  onSave,
}: Props) {
  const [currentValue, setCurrentValue] = useState(value);
  const renderThumb = useCallback(
    (name: "high" | "low") => <Thumb name={name} />,
    []
  );
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);
  const renderLabel = useCallback(
    (value: number) => <Label text={value.toString()} />,
    []
  );
  const renderNotch = useCallback(() => <Notch />, []);
  const handleValueChange = useCallback((low: number) => {
    setCurrentValue(low);
  }, []);

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
          darkColor="#C1C1C1"
          style={{
            fontFamily: "Manrope_300Light",
            fontSize: 12,
            paddingBottom: 8,
            textAlign: "center",
          }}
        >
          {label}
        </ThemedText>
      </View>
      <View>
        <Slider
          style={{ marginBottom: 32 }}
          min={min}
          max={max}
          step={step}
          low={currentValue}
          disableRange={true}
          renderThumb={renderThumb}
          renderRail={renderRail}
          renderRailSelected={renderRailSelected}
          renderLabel={renderLabel}
          renderNotch={renderNotch}
          onSliderTouchStart={(e) => console.log(e)}
          onValueChanged={handleValueChange}
        />
      </View>
      <RangeInput
        value={currentValue}
        symbol={symbol}
        min={min}
        max={max}
        step={step}
        fixed={fixed}
        onEdite={(v: number) => setCurrentValue(v)}
      />
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
