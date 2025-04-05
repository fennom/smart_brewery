import { create } from "zustand";

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

interface AppStore {
  info: Info;
  settings: Settings;
  baseUrl: string;
  isOnline: boolean;
  isFetcheState: boolean;
  isFetcheSettings: boolean;
  setBaseUrl: (baseUrl: string) => void;
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
  fetchWifiConfig: (ssid: string, password: string) => Promise<void>;
  fetchPidConfig: (kp: number, ki: number, kd: number) => Promise<void>;
  fetchSensorDiff: (value: number) => Promise<void>;
  fetchBoilingPoint: (value: number) => Promise<void>;
}

const useAppStore = create<AppStore>((set, get) => ({
  baseUrl: "",
  isOnline: false,
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
  isFetcheState: false,
  isFetcheSettings: false,
  setBaseUrl: (baseUrl: string) => {
    set({ baseUrl: baseUrl });
  },
  fetchState: async () => {
    if (get().isFetcheState || get().baseUrl === "") return;

    try {
      set({ isFetcheState: true });
      const response = await fetch(`${get().baseUrl}/v1/info`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        set({ isOnline: false });
        console.log(response);
        throw response;
      }

      set({ info: await response.json() });
      set({ isOnline: true });

      console.log(get().info);
    } catch (e) {
      alert(e);
    } finally {
      set({ isFetcheState: false });
    }
  },
  fetchSettings: async () => {
    if (get().isFetcheSettings || get().baseUrl === "") return;
    try {
      set({ isFetcheSettings: true });
      const response = await fetch(`${get().baseUrl}/v1/settings`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        set({ isOnline: false });
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
    const response = await fetch(`${get().baseUrl}/v1/start`, {
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
      console.error(response.status + ": " + response.statusText);
      set({ isOnline: false });
      return;
    }
    set((state) => ({
      info: { ...state.info, mode: mode },
    }));
  },
  fetchStop: async () => {
    const response = await fetch(`${get().baseUrl}/v1/stop`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(response.status + ": " + response.statusText);
      set({ isOnline: false });
      return;
    }
    set((state) => ({
      info: { ...state.info, mode: "idle" },
    }));
  },
  fetchPause: async () => {
    const response = await fetch(`${get().baseUrl}/v1/paused`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(response.status + ": " + response.statusText);
      set({ isOnline: false });
      return;
    }
    const json = await response.json();
    set((state) => ({
      info: { ...state.info, isPaused: json.result },
    }));
  },
  fetchConfirme: async () => {
    const response = await fetch(`${get().baseUrl}/v1/confirme`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(response.status + ": " + response.statusText);
      set({ isOnline: false });
      return;
    }
    const json = await response.json();
    set((state) => ({
      info: { ...state.info, isNeedConfirm: json.result },
    }));
  },
  fetchPumpSwitch: async () => {
    const response = await fetch(`${get().baseUrl}/v1/pump`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error(response.status + ": " + response.statusText);
      set({ isOnline: false });
      return;
    }
    const json = await response.json();
    set((state) => ({
      ...state,
      info: { ...state.info, isPumpEnabled: json.result },
    }));
  },
  fetchPumpLimit: async (value: number) => {
    const response = await fetch(`${get().baseUrl}/v1/pump-limit`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pumpLimit: value }),
    });
    if (!response.ok) {
      console.error(response.status + ": " + response.statusText);
      set({ isOnline: false });
      return;
    }
    set((state) => ({
      info: { ...state.info, pumpLimit: value },
    }));
  },
  fetchHeatLimit: async (value: number) => {
    const response = await fetch(`${get().baseUrl}/v1/heat-limit`, {
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
  },
  fetchTargetTemperature: async (value: number) => {
    const response = await fetch(`${get().baseUrl}/v1/target-temperaturet`, {
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
      info: { ...state.info, targetTemperature: value },
    }));
  },
  fetchRecipe: async (recipe: any[]) => {
    try {
      const response = await fetch(`${get().baseUrl}/v1/recipe`, {
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
      set((state) => ({
        info: { ...state.info, recipe: recipe },
      }));
    } catch (e) {
      alert(e);
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
      set({ baseUrl: "http://" + json.ip });
    } catch (e: any) {
      alert(e?.message ?? e);
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
        settings: { ...state.settings, ki: json.ki, kp: json.kp, kd: json.kd },
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
        settings: { ...state.settings, sensorDiff: json.sensorDiff },
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
        settings: { ...state.settings, boilingPoint: json.boilingPoint },
      }));
    } catch (e) {
      alert(e);
    }
  },
}));

export default useAppStore;
