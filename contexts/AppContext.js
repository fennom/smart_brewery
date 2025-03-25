import { createContext, useContext, useReducer } from "react";

export const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case "setInfo": {
      return {
        isOnline: true,
        baseUrl: state.baseUrl,
        mode: action.mode,
        temperature: action.temparature,
        targetTemperature: action.targetTemperature,
        heatLimit: action.heatLimit,
        pumpLimit: action.pumpLimit,
        isPaused: action.isPaused,
        isNeedConfirm: action.isNeedConfirm,
        isPumpEnabled: action.isPumpEnabled,
        timeToEnd: action.timeToEnd,
        step: action?.step ?? state.step,
        stage: action?.stage ?? state.stage,
        confirmMessage: action?.confirmMessage ?? state.confirmMessage,
        recipe: action?.recipe ?? state.recipe,
        kp: action?.kp ?? state.kp,
        ki: action?.ki ?? state.ki,
        kd: action?.kd ?? state.kd,
        sensorDiff: action?.sensorDiff ?? state.sensorDiff,
        boilingPoint: action?.boilingPoint ?? state.boilingPoint,
      };
    }
    case "setSettings": {
      return {
        ...state,
        kp: action?.kp ?? state.kp,
        ki: action?.ki ?? state.ki,
        kd: action?.kd ?? state.kd,
        sensorDiff: action?.sensorDiff ?? state.sensorDiff,
        boilingPoint: action?.boilingPoint ?? state.boilingPoint,
      };
    }
    case "setBaseUrl": {
      return { ...state, baseUrl: action.newState };
    }
    case "setPaused": {
      return { ...state, isPaused: action.newState };
    }
    case "setNeedConfirme": {
      return { ...state, isNeedConfirm: action.newState };
    }
    case "setConfirmeMessage": {
      return { ...state, confirmMessage: action.newState };
    }
    case "setMode": {
      return { ...state, mode: action.newState };
    }
    case "setPumpEnabled": {
      return { ...state, isPumpEnabled: action.newState };
    }
    case "setMixerEnabled": {
      return { ...state, isMixerEnabled: action.newState };
    }
    case "setTargetTemperature": {
      return { ...state, targetTemperature: action.newState };
    }
    case "setHeatLimit": {
      return { ...state, heatLimit: action.newState };
    }
    case "setPumpLimit": {
      return { ...state, pumpLimit: action.newState };
    }
    case "setRecipe": {
      return { ...state, recipe: action.newState };
    }
    case "setKp": {
      return { ...state, kp: action.newState };
    }
    case "setKi": {
      return { ...state, ki: action.newState };
    }
    case "setKd": {
      return { ...state, kd: action.newState };
    }
    case "setSensorDiff": {
      return { ...state, sensorDiff: action.newState };
    }
    case "setBoilingPoint": {
      return { ...state, boilingPoint: action.newState };
    }
    case "setOnline": {
      return { ...state, isOnline: action.newState };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    baseUrl: "",
    isOnline: false,
    mode: "idle",
    temperature: 0.0,
    targetTemperature: 0.0,
    heatLimit: 100,
    pumpLimit: 100,
    isPaused: false,
    isNeedConfirm: false,
    isPumpEnabled: false,
    isMixerEnabled: false,
    confirmMessage: "",
    timeToEnd: -1,
    step: 0,
    stage: 0,
    recipe: null,
    sensorDiff: 5.0,
    kp: 0.0,
    ki: 0.0,
    kd: 0.0,
    boilingPoint: 100.0,
  });
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
