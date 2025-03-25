/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#FAAE17";
const secondary = "#FFECDA";
const tintColorDark = "#fff";
const error = "#FF5454";
const success = "#3CD07A";

export const Colors = {
  light: {
    primary: tintColorLight,
    card: "#FCFCFC",
    highlighted: "#242424",
    secondary: secondary,
    gray: "#777A95",
    lightGray: "#F5F6F8",
    text: "#302F3C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#777A95",
    tabIconSelected: tintColorLight,
    borderColor: "#777a95",
    error,
    success,
  },
  dark: {
    primary: tintColorLight,
    secondary: secondary,
    highlighted: "#FCFCFC",
    gray: "#777A95",
    card: "#1f1f1f",
    lightGray: "rgba(255, 255, 255, 0.1)",
    text: "#FCFCFC",
    background: "#121212",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    borderColor: "#fff",
    error,
    success,
  },
};
