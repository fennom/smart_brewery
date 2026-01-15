import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface SettingsStore {
  baseUrl: string;
  sensorDiff: number;
  kp: number;
  ki: number;
  kd: number;
  boilingPoint: number;
  setBaseUrl: (baseUrl: string) => void;
  fetchSettings: () => Promise<void>;
  fetchWifiConfig: (ssid: string, password: string) => Promise<boolean>;
  fetchPidConfig: (kp: number, ki: number, kd: number) => Promise<void>;
  fetchSensorDiff: (value: number) => Promise<void>;
  fetchBoilingPoint: (value: number) => Promise<void>;
}

const useSettingStore = create<SettingsStore>((set, get) => ({
  baseUrl: "",
  sensorDiff: 5.0,
  kp: 0.0,
  ki: 0.0,
  kd: 0.0,
  boilingPoint: 100.0,
  setBaseUrl: (baseUrl: string) => {
    set({ baseUrl: baseUrl });
  },
  fetchSettings: async () => {
    if (get().baseUrl === "") return;
    try {
      const response = await fetch(`${get().baseUrl}/v1/settings`, {
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
      set({ ...settings  });
    } catch (e: any) {
      alert(e?.message ?? e);
    }
  },
  fetchWifiConfig: async (ssid: string, password: string) => {
    try {
      const response = await fetch(`${get().baseUrl}/v1/wifi-settings`, {
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
      if (!response.ok) {
        throw response;
      }
      const json = await response.json();
      console.log(json, 'wifi');
       
      set({ baseUrl: "http://" + json.ip });
      await AsyncStorage.setItem("baseUrl", "http://" + json.ip )
      return true;
    } catch (e: any) {
      alert(e?.message ?? e);
      return false;
    }
  },
  fetchPidConfig: async (kp: number, ki: number, kd: number) => {
    try {
      const response = await fetch(`${get().baseUrl}/v1/pid`, {
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
         ...state, ki: json.ki, kp: json.kp, kd: json.kd,
      }));
    } catch (e) {
      alert(e);
    }
  },
  fetchSensorDiff: async (value: number) => {
    try {
      const response = await fetch(`${get().baseUrl}/v1/sensor-diff`, {
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
         ...state, sensorDiff: json.sensorDiff ,
      }));
    } catch (e) {
      alert(e);
    }
  },
  fetchBoilingPoint: async (value: number) => {
    try {
      const response = await fetch(`${get().baseUrl}/v1/boiling-point`, {
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
        ...state, boilingPoint: json.boilingPoint ,
      }));
    } catch (e) {
      alert(e);
    }
  },
}));

export default useSettingStore;
