import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  useColorScheme,
  StatusBar,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import RecipeFrom from "@/components/RecipeForm";
import { useLocalSearchParams, useRouter } from "expo-router";
import useAppStore from "@/lib/useAppStore";
import { ThemedView } from "@/components/ThemedView";
import i18n from "@/i18n";
import TextModal from "@/components/TextModal";
import { useShallow } from "zustand/react/shallow";

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { getUrl } = useAppStore(useShallow((state) => state));
  const [value, setValue] = useState<any[] | null>(null);
  const [name, setName] = useState<string>("");
  const setRecipe = useAppStore((state) => state.fetchRecipe);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [temperaturePauses, setTemperaturePauses] = useState<any[]>([]);

  const onSave = async (temperaturePauses: any[], add: boolean) => {
    if (add) {
      setTemperaturePauses(temperaturePauses);
      setShowModal(true);
    } else {
      await setRecipe(temperaturePauses.filter((i) => i.edited));
      router.navigate("/");
    }
  };

  const onSaveRecipe = async (name: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${getUrl()}/v1/recipes/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          temperaturePauses: temperaturePauses.filter((i) => i.edited),
        }),
      });
      if (!response.ok) {
        throw response;
      }
      await response.json();
      const data = temperaturePauses.filter((i) => i.edited);
      await setRecipe(data);
      router.navigate("/");
    } catch (e) {
      alert(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecipe = async (id: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${getUrl()}/v1/recipes/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw response;
      }
      const recipe = await response.json();
      console.log(recipe);
      setValue(recipe.temperaturePauses);
      setName(recipe.name);
    } catch (e) {
      alert(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipe(id);
  }, []);

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
        {value && (
          <RecipeFrom
            onSave={onSave}
            value={value}
            saveBtnText={i18n.t("main.choose")}
            saveAndAddBtnText={i18n.t("main.updateAndAdd")}
          />
        )}
        <TextModal
          isVisible={showModal}
          label={i18n.t("main.recipeName")}
          value={name}
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
