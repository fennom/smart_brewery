import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import RecipeFrom from "@/components/RecipeForm";
import { useRouter } from "expo-router";
import useAppStore from "@/lib/useAppStore";
import { ThemedView } from "@/components/ThemedView";
import i18n from "@/i18n";
import TextModal from "@/components/TextModal";
import { useShallow } from "zustand/react/shallow";

export default function CreateScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const fetchRecipe = useAppStore(useShallow((state) => state.fetchRecipe));
  const fetchSaveRecipe = useAppStore(
    useShallow((state) => state.fetchSaveRecipe)
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [temperaturePauses, setTemperaturePauses] = useState<any[]>([]);

  const onSave = async (temperaturePauses: any[], add: boolean) => {
    if (add) {
      setTemperaturePauses(temperaturePauses.filter((i) => i.edited));
      setShowModal(true);
    } else {
      await fetchRecipe(temperaturePauses);
      router.navigate("/");
    }
  };

  const onSaveRecipe = async (name: string) => {
    try {
      setIsLoading(true);
      const data = temperaturePauses.filter((i) => i.edited);
      await fetchSaveRecipe({
        name: name,
        temperaturePauses: data,
      });
      await fetchRecipe(data);
      router.navigate("/");
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
    console.log("Render page create count:", renderCount.current);
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme ?? "light"].background },
        ]}
        edges={["top"]}
      >
        {isLoading && (
          <View style={styles.loader}>
            <ThemedView style={styles.indicator}>
              <ActivityIndicator size="large" color="#000" />
            </ThemedView>
          </View>
        )}
        <RecipeFrom onSave={onSave} />
        <TextModal
          isVisible={showModal}
          label={i18n.t("main.recipeName")}
          value=""
          onCancel={() => {
            setShowModal(false);
          }}
          onSave={(saveValue: string) => {
            onSaveRecipe(saveValue);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {},
  loader: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",

    padding: 10,
  },
  indicator: {
    flexDirection: "row",
    alignSelf: "center",
    flexGrow: 0,
    padding: 16,
    borderRadius: 8,
  },
});
