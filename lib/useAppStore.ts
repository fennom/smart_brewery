import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "expo-router/build/global-state/router-store";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Info {
  mode: string;
  temperature: number;
  targetTemperature: number;
  heatTemperature: number;
  heatLimit: number;
  pumpLimit: number;
  isPaused: boolean;
  isNeedConfirm: boolean;
  isPumpEnabled: boolean;
  confirmMessage: string;
  timeToEnd: number;
  step: number;
  stage: number;
  recipe: any[] | null;
}

interface Settings {
  sensorDiff: number;
  kp: number;
  ki: number;
  kd: number;
  boilingPoint: number;
}

interface RecipeInfo {
  id: number;
  name: string;
}

interface AppStore {
  info: Info;
  settings: Settings;
  recipes: RecipeInfo[];
  ip: string | null;
  ssid: string | null;
  password: string | null;
  isOnline: boolean;
  isFetcheState: boolean;
  isFetcheSettings: boolean;
  isFetcheRecipes: boolean;
  setWifiConfig: (ssid: string, password: string) => void;
  setIp: (ip: string) => void;
  setIsOnline: (isOnline: boolean) => void;
  getUrl: () => string;
  getWebsocketUrl: () => string;
  setState: (info: Info) => void;
  fetchState: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  fetchStart: (mode: string) => Promise<void>;
  fetchStop: () => Promise<void>;
  fetchPause: () => Promise<void>;
  fetchConfirme: () => Promise<void>;
  fetchPumpSwitch: () => Promise<void>;
  fetchPumpLimit: (value: number) => Promise<void>;
  fetchHeatLimit: (value: number) => Promise<void>;
  fetchTargetTemperature: (value: number) => Promise<void>;
  fetchRecipe: (recipe: any[]) => Promise<void>;
  fetchSaveRecipe: (recipe: {
    name: string;
    temperaturePauses: any[];
  }) => Promise<void>;
  fetchWifiConfig: (ssid: string, password: string) => Promise<boolean>;
  fetchPidConfig: (kp: number, ki: number, kd: number) => Promise<void>;
  fetchSensorDiff: (value: number) => Promise<void>;
  fetchBoilingPoint: (value: number) => Promise<void>;
}

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ip: "",
      isOnline: false,
      ssid: "",
      password: "",
      info: {
        mode: "idle",
        temperature: 0.0,
        targetTemperature: 0.0,
        heatTemperature: 0.0,
        heatLimit: 100,
        pumpLimit: 100,
        isPaused: false,
        isNeedConfirm: false,
        isPumpEnabled: false,
        confirmMessage: "",
        timeToEnd: -1,
        step: 0,
        stage: 0,
        recipe: null,
      },
      settings: {
        sensorDiff: 5.0,
        kp: 0.0,
        ki: 0.0,
        kd: 0.0,
        boilingPoint: 100.0,
      },
      recipes: [],
      isFetcheState: false,
      isFetcheSettings: false,
      isFetcheRecipes: false,
      setIsOnline: (isOnline: boolean) => {
        set({ isOnline: isOnline });
      },
      setIp: (ip: string) => {
        set({ ip: ip });
      },
      setWifiConfig: (ssid: string, password: string) => {
        set({ ssid: ssid, password: password });
      },
      getUrl: () => {
        return get().ip ? "http://" + get().ip : "";
      },
      getWebsocketUrl: () => {
        return get().ip ? "ws://" + get().ip + ":81" : "";
      },
      setState: (info: Info) => {
        set({ info: info });

        set({ isOnline: true });
      },
      fetchState: async () => {
        if (get().isFetcheState || get().getUrl() === "") return;

        try {
          set({ isFetcheState: true });
          const response = await fetch(`${get().getUrl()}/v1/info`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw response;
          }
          const json = await response.json();
          set({ info: json });
          console.log(json);

          set({ isOnline: true });
        } catch (e) {
          set({ isOnline: false });
          alert(e);
        } finally {
          set({ isFetcheState: false });
        }
      },
      fetchSettings: async () => {
        if (get().isFetcheSettings || get().getUrl() === "") return;
        try {
          set({ isFetcheSettings: true });
          const response = await fetch(`${get().getUrl()}/v1/settings`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw response;
          }
          const settings = await response.json();
          console.log(settings);

          set({ settings: settings });
        } catch (e) {
          alert(e);
        } finally {
          set({ isFetcheSettings: false });
        }
      },
      fetchStart: async (mode: string) => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/start`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mode: mode,
            }),
          });
          if (!response.ok) {
            throw response;
          }
          set({ info: await response.json() });
        } catch (e) {
          alert(e);
        }
      },
      fetchStop: async () => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/stop`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw response;
          }
          set({ info: await response.json() });
        } catch (e) {
          alert(e);
        }
      },
      fetchPause: async () => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/paused`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw response;
          }
          const json = await response.json();
          set((state) => ({
            info: { ...state.info, isPaused: json.result },
          }));
        } catch (e) {
          alert(e);
        }
      },
      fetchConfirme: async () => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/confirme`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw response;
          }
          const json = await response.json();
          set((state) => ({
            info: { ...state.info, isNeedConfirm: json.result },
          }));
        } catch (e) {
          alert(e);
        }
      },
      fetchPumpSwitch: async () => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/pump`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw response;
          }
          const json = await response.json();
          set((state) => ({
            ...state,
            info: { ...state.info, isPumpEnabled: json.result },
          }));
        } catch (e) {
          alert(e);
        }
      },
      fetchPumpLimit: async (value: number) => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/pump-limit`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pumpLimit: value }),
          });
          if (!response.ok) {
            throw response;
          }
          set((state) => ({
            info: { ...state.info, pumpLimit: value },
          }));
        } catch (e) {
          alert(e);
        }
      },
      fetchHeatLimit: async (value: number) => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/heat-limit`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ heatLimit: value }),
          });
          if (!response.ok) {
            console.error(response.status + ": " + response.statusText);
            set({ isOnline: false });
            return;
          }
          set((state) => ({
            info: { ...state.info, heatLimit: value },
          }));
        } catch (e) {
          alert(e);
        }
      },
      fetchTargetTemperature: async (value: number) => {
        try {
          const response = await fetch(
            `${get().getUrl()}/v1/target-temperature`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ targetTemperature: value }),
            }
          );
          if (!response.ok) {
            throw response;
          }
          set((state) => ({
            info: { ...state.info, targetTemperature: value },
          }));
        } catch (e) {
          alert(e);
        }
      },
      fetchRecipe: async (recipe: any[]) => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/recipe`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(recipe),
          });
          if (!response.ok) {
            throw response;
          }
        } catch (e) {
          alert(e);
        }
      },
      fetchSaveRecipe: async (recipe) => {
        const response = await fetch(`${get().getUrl()}/v1/recipes`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recipe),
        });
        if (!response.ok) {
          throw response;
        }
      },
      fetchWifiConfig: async (ssid: string, password: string) => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/wifi-settings`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ssid: ssid,
              password: password,
            }),
          });
          console.log(response);

          if (!response.ok) {
            throw response;
          }
          const json = await response.json();
          console.log(json, "wifi");
          set({ ip: json.ip });
          return true;
        } catch (e: any) {
          console.log(e);
          alert(e?.message ?? e);
          return false;
        }
      },
      fetchPidConfig: async (kp: number, ki: number, kd: number) => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/pid`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              kp: kp,
              ki: ki,
              kd: kd,
            }),
          });
          if (!response.ok) {
            throw response;
          }
          const json = await response.json();
          set((state) => ({
            settings: {
              ...state.settings,
              ki: json.ki,
              kp: json.kp,
              kd: json.kd,
            },
          }));
        } catch (e) {
          alert(e);
        }
      },
      fetchSensorDiff: async (value: number) => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/sensor-diff`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sensorDiff: value }),
          });
          if (!response.ok) {
            throw response;
          }
          const json = await response.json();
          set((state) => ({
            settings: { ...state.settings, sensorDiff: json.sensorDiff },
          }));
        } catch (e) {
          alert(e);
        }
      },
      fetchBoilingPoint: async (value: number) => {
        try {
          const response = await fetch(`${get().getUrl()}/v1/boiling-point`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ boilingPoint: value }),
          });
          if (!response.ok) {
            throw response;
          }
          const json = await response.json();
          set((state) => ({
            settings: { ...state.settings, boilingPoint: json.boilingPoint },
          }));
        } catch (e) {
          alert(e);
        }
      },
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ ip: state.ip }),
    }
  )
);

export default useAppStore;
