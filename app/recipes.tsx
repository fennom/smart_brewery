import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  useColorScheme,
  StatusBar,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Alert, ActivityIndicator } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import useAppStore from "@/lib/useAppStore";
import i18n from "../i18n";
import RecipeItem from "@/components/RecipeItem";
import { useNavigation, useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useShallow } from "zustand/react/shallow";

export default function RecipesScreen() {
  const { isOnline, getUrl } = useAppStore(useShallow((state) => state));

  const colorScheme = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recipes, setRecipes] = useState<any[]>([]);

  const showNotifyAlert = () => {
    Alert.alert(
      i18n.t("alerts.editError"),
      i18n.t("alerts.editErrorDescription")
    );
  };

  const loadRecipes = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${getUrl()}/v1/recipes`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw response;
      }
      const result = await response.json();
      console.log(result);

      setRecipes(result);
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecipe = async (id: number) => {
    try {
      setIsLoading(true);

      const response = await fetch(`${getUrl()}/v1/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw response;
      }
      loadRecipes();
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOnline) {
      return;
    }
    loadRecipes();
  }, []);

  const handleAddRecipe = useCallback((): void => {
    router.push("/create");
  }, [router]);

  const handleOnDelete = useCallback((id: number) => {
    Alert.alert(i18n.t("alerts.confirmation"), i18n.t("alerts.deleteRecipe"), [
      {
        text: i18n.t("alerts.cancel"),
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: i18n.t("alerts.ok"), onPress: () => deleteRecipe(id) },
    ]);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          disabled={false}
          style={({ pressed }) => ({
            width: 32,
            height: 32,
            borderRadius: 100,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: pressed
              ? Colors[colorScheme ?? "light"].borderColor
              : "rgba(0, 0, 0, 0)",
          })}
          onPress={handleAddRecipe}
        >
          <MaterialCommunityIcons name="plus" size={28} color="black" />
        </Pressable>
      ),
    });
  }, [navigation]);

  const { height } = Dimensions.get("window");

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            height: height - (StatusBar?.currentHeight ?? 0),
          },
        ]}
        edges={["top"]}
      >
        <View style={{ flex: 1 }}>
          {isLoading && (
            <View style={styles.loader}>
              <ThemedView style={styles.indicator}>
                <ActivityIndicator size="large" color="#000" />
              </ThemedView>
            </View>
          )}
          {recipes.length === 0 && (
            <View style={styles.loader}>
              <ThemedText
                style={{
                  fontFamily: "Manrope_500Medium",
                  alignSelf: "center",
                }}
              >
                {i18n.t("recipe.noRecipes")}
              </ThemedText>
            </View>
          )}

          <ScrollView style={{ paddingHorizontal: 16 }}>
            <View>
              {recipes.map((recipe, index) => (
                <RecipeItem
                  key={index}
                  no={index + 1}
                  name={recipe.name}
                  disabled={isLoading}
                  deletable={true}
                  onPress={async () =>
                    router.push({
                      pathname: "/recipe/[id]",
                      params: { id: recipe.id },
                    })
                  }
                  onDeleted={() => handleOnDelete(recipe.id)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
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
