import * as Location from "expo-location";
import { PermissionsAndroid } from "react-native";
import WifiManager, { WifiEntry } from "react-native-wifi-reborn";

export class WiFiService {
  private static instance: WiFiService;
  private wifiEntries: WifiEntry[] = [];

  private constructor() {}

  public static getInstance(): WiFiService {
    if (!WiFiService.instance) {
      WiFiService.instance = new WiFiService();
    }
    return WiFiService.instance;
  }

  public async requestLocationPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  }

  public async turnOnLocation(): Promise<boolean> {
    const permit = await this.requestLocationPermission();
    if (!permit) return false;
    const result = await Location.getCurrentPositionAsync();
    return !!result;
  }

  public async requestPermission(): Promise<boolean> {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location permission is required for WiFi connections",
          message:
            "This app needs location permission as this is required to scan for wifi networks.",
          buttonNegative: "DENY",
          buttonPositive: "ALLOW",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  public async scanWifi(): Promise<WifiEntry[]> {
    try {
      const granted = await this.requestPermission();
      if (granted) {
        const wifiEntries = await WifiManager.loadWifiList();
        wifiEntries.forEach(element => {
          if (!this.wifiEntries.find(e => e.SSID === element.SSID)) {
            this.wifiEntries.push(element);
          }
        });
        return this.wifiEntries;
      } else {
        throw new Error("Location permission denied");
      }
    } catch (error) {
      console.error("WiFi scan error:", error);
      throw error;
    }
  }

  public getWifiEntries(): WifiEntry[] {
    return this.wifiEntries;
  }

  public async getCurrentSsid(): Promise<string> {
    return await WifiManager.getCurrentWifiSSID();
  }

  public async connectToWifi(ssid: string, password: string): Promise<void> {
    try {
      const granted = await this.requestPermission();
      if (granted) {
        await WifiManager.connectToProtectedSSID(ssid, password, false, false);
        
      } else {
        throw new Error("Location permission denied");
      } 
    } catch (error) {
      console.error("WiFi connection error:", error);
      throw error;
    }
  }
} 